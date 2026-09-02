-- Migration: Add Voting Tasks & Guest Task Submissions
-- Enables reality show voting tasks and guest (anonymous) task completion via shareable links

-- ============================================================
-- 1. Extend platform & task type constraints
-- ============================================================

-- Add 'voting' to allowed platforms
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_platform_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_platform_check 
  CHECK (platform IN ('google', 'instagram', 'youtube', 'playstore', 'voting'));

-- Add 'vote' to allowed task types
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_task_type_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_task_type_check 
  CHECK (task_type IN ('review', 'comment', 'like', 'follow', 'subscribe', 'install_review', 'vote'));

-- ============================================================
-- 2. Add shareable column to tasks
-- ============================================================

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS shareable BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_tasks_shareable ON tasks(shareable) WHERE shareable = true;

-- ============================================================
-- 3. Create guest_task_submissions table
-- ============================================================

CREATE TABLE IF NOT EXISTS guest_task_submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id         uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  company_id      uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  guest_email     text NOT NULL,
  platform        text NOT NULL,
  task_type       text NOT NULL,
  screenshot_url  text,
  status          text NOT NULL DEFAULT 'pending' 
                    CHECK (status IN ('pending', 'approved', 'rejected')),
  reward_amount   decimal(10,2) NOT NULL,
  submitted_at    timestamptz DEFAULT now(),
  reviewed_at     timestamptz,
  reviewed_by     uuid,
  admin_notes     text,
  credited_to_user_id uuid REFERENCES profiles(id),
  credited_at     timestamptz,
  
  CONSTRAINT unique_guest_email_task UNIQUE (guest_email, task_id)
);

-- ============================================================
-- 4. Indexes for guest_task_submissions
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_guest_subs_email ON guest_task_submissions(guest_email);
CREATE INDEX IF NOT EXISTS idx_guest_subs_task ON guest_task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_guest_subs_status ON guest_task_submissions(status);
CREATE INDEX IF NOT EXISTS idx_guest_subs_company ON guest_task_submissions(company_id);
CREATE INDEX IF NOT EXISTS idx_guest_subs_uncredited ON guest_task_submissions(guest_email) 
  WHERE status = 'approved' AND credited_to_user_id IS NULL;

-- ============================================================
-- 5. Row Level Security for guest_task_submissions
-- ============================================================

ALTER TABLE guest_task_submissions ENABLE ROW LEVEL SECURITY;

-- Anonymous users can insert guest submissions (for shareable link flow)
CREATE POLICY "anon_insert_guest_submissions" ON guest_task_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- Anonymous users can read guest submissions (to check duplicate by email)
CREATE POLICY "anon_select_guest_submissions" ON guest_task_submissions
  FOR SELECT TO anon USING (true);

-- Admins have full access to guest submissions
CREATE POLICY "admin_all_guest_submissions" ON guest_task_submissions
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Company users can read their company's guest submissions
CREATE POLICY "company_read_guest_submissions" ON guest_task_submissions
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM company_users 
      WHERE auth_user_id = auth.uid() 
        AND company_id = guest_task_submissions.company_id
    )
  );

-- Company users can update their company's guest submissions (approve/reject)
CREATE POLICY "company_update_guest_submissions" ON guest_task_submissions
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM company_users 
      WHERE auth_user_id = auth.uid() 
        AND company_id = guest_task_submissions.company_id
    )
  );

-- ============================================================
-- 6. Allow anonymous read access to shareable tasks
-- ============================================================

-- Anonymous users can read active shareable tasks (for the public task page)
CREATE POLICY "anon_read_shareable_tasks" ON tasks
  FOR SELECT TO anon USING (active = true AND shareable = true);

-- Anonymous users can read companies (for showing company info on task page)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'companies' AND policyname = 'anon_read_active_companies'
  ) THEN
    CREATE POLICY "anon_read_active_companies" ON companies
      FOR SELECT TO anon USING (active = true);
  END IF;
END $$;

-- ============================================================
-- 7. Auto-credit trigger: credit pending guest rewards on signup
-- ============================================================

CREATE OR REPLACE FUNCTION credit_pending_guest_rewards()
RETURNS TRIGGER AS $$
DECLARE
  pending_total decimal(10,2);
  credited_count integer;
BEGIN
  -- Sum all approved, uncredited guest submissions for this email
  SELECT COALESCE(SUM(reward_amount), 0), COUNT(*)
  INTO pending_total, credited_count
  FROM guest_task_submissions
  WHERE guest_email = NEW.email
    AND status = 'approved'
    AND credited_to_user_id IS NULL;
  
  IF pending_total > 0 THEN
    -- Credit to user's total_earnings
    UPDATE profiles
    SET total_earnings = COALESCE(total_earnings, 0) + pending_total
    WHERE id = NEW.id;
    
    -- Mark guest submissions as credited
    UPDATE guest_task_submissions
    SET credited_to_user_id = NEW.id,
        credited_at = now()
    WHERE guest_email = NEW.email
      AND status = 'approved'
      AND credited_to_user_id IS NULL;
    
    RAISE LOG 'Credited % pending guest rewards (% submissions) to user % (%)', 
      pending_total, credited_count, NEW.id, NEW.email;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log but don't fail signup if crediting fails
  RAISE LOG 'Error crediting guest rewards for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create
DROP TRIGGER IF EXISTS credit_guest_rewards_on_signup ON profiles;
CREATE TRIGGER credit_guest_rewards_on_signup
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION credit_pending_guest_rewards();
