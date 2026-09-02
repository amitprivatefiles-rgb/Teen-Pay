/*
  # Fix unique task assignment logic

  1. Database Changes
    - Add assigned_to and assigned_at columns to tasks table
    - Create function to get available tasks for a user
    - Create function to assign task to user
    - Update task completion logic

  2. Security
    - Update RLS policies for new assignment logic
    - Ensure users can only see their assigned tasks or unassigned tasks
*/

-- Add assignment tracking columns to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE tasks ADD COLUMN assigned_to uuid REFERENCES profiles(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'assigned_at'
  ) THEN
    ALTER TABLE tasks ADD COLUMN assigned_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'completed'
  ) THEN
    ALTER TABLE tasks ADD COLUMN completed boolean DEFAULT false;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_company_assigned ON tasks(company_id, assigned_to, completed);

-- Function to get available tasks for a user (unassigned tasks from companies they haven't completed)
CREATE OR REPLACE FUNCTION get_available_tasks_for_user(user_id uuid)
RETURNS TABLE (
  task_id uuid,
  company_id uuid,
  title text,
  google_profile_link text,
  review_text text,
  star_rating integer,
  reward_amount numeric,
  company_name text,
  company_logo_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as task_id,
    t.company_id,
    t.title,
    t.google_profile_link,
    t.review_text,
    t.star_rating,
    t.reward_amount,
    c.name as company_name,
    c.logo_url as company_logo_url
  FROM tasks t
  JOIN companies c ON t.company_id = c.id
  WHERE t.active = true
    AND t.assigned_to IS NULL
    AND t.completed = false
    AND c.active = true
    AND NOT EXISTS (
      -- User hasn't completed any task for this company
      SELECT 1 FROM task_submissions ts
      JOIN tasks t2 ON ts.task_id = t2.id
      WHERE ts.user_id = user_id
        AND t2.company_id = t.company_id
        AND ts.status = 'approved'
    )
  ORDER BY t.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign a task to a user
CREATE OR REPLACE FUNCTION assign_task_to_user(task_id uuid, user_id uuid)
RETURNS boolean AS $$
DECLARE
  task_exists boolean;
BEGIN
  -- Check if task is available for assignment
  SELECT EXISTS(
    SELECT 1 FROM tasks t
    JOIN companies c ON t.company_id = c.id
    WHERE t.id = task_id
      AND t.active = true
      AND t.assigned_to IS NULL
      AND t.completed = false
      AND c.active = true
      AND NOT EXISTS (
        SELECT 1 FROM task_submissions ts
        JOIN tasks t2 ON ts.task_id = t2.id
        WHERE ts.user_id = user_id
          AND t2.company_id = t.company_id
          AND ts.status = 'approved'
      )
  ) INTO task_exists;

  IF task_exists THEN
    -- Assign the task to the user
    UPDATE tasks 
    SET assigned_to = user_id, assigned_at = now()
    WHERE id = task_id AND assigned_to IS NULL;
    
    RETURN FOUND;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's assigned task for a company
CREATE OR REPLACE FUNCTION get_user_task_for_company(user_id uuid, company_id uuid)
RETURNS TABLE (
  task_id uuid,
  title text,
  google_profile_link text,
  review_text text,
  star_rating integer,
  reward_amount numeric,
  assigned_at timestamptz,
  submission_status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as task_id,
    t.title,
    t.google_profile_link,
    t.review_text,
    t.star_rating,
    t.reward_amount,
    t.assigned_at,
    COALESCE(ts.status, 'not_submitted') as submission_status
  FROM tasks t
  LEFT JOIN task_submissions ts ON t.id = ts.task_id AND ts.user_id = user_id
  WHERE t.company_id = company_id
    AND t.assigned_to = user_id
    AND t.active = true
    AND t.completed = false
  ORDER BY t.assigned_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the task completion handler
CREATE OR REPLACE FUNCTION handle_task_completion()
RETURNS trigger AS $$
BEGIN
  -- Only process when status changes to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Mark the task as completed
    UPDATE tasks 
    SET completed = true 
    WHERE id = NEW.task_id;
    
    -- Update user earnings
    UPDATE profiles 
    SET 
      total_earnings = total_earnings + (
        SELECT reward_amount FROM tasks WHERE id = NEW.task_id
      ),
      daily_earnings = daily_earnings + (
        SELECT reward_amount FROM tasks WHERE id = NEW.task_id
      )
    WHERE id = NEW.user_id;
    
    -- Create task completion record
    INSERT INTO task_completions (user_id, task_id, submission_id)
    VALUES (NEW.user_id, NEW.task_id, NEW.id)
    ON CONFLICT (user_id, task_id) DO NOTHING;
    
    -- Create wallet transaction
    INSERT INTO wallet_transactions (user_id, amount, transaction_type, description, reference_id)
    VALUES (
      NEW.user_id,
      (SELECT reward_amount FROM tasks WHERE id = NEW.task_id),
      'credit',
      'Task completion reward',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for tasks table
DROP POLICY IF EXISTS "authenticated_users_can_read_active_tasks" ON tasks;
DROP POLICY IF EXISTS "admin_can_manage_all_tasks" ON tasks;

-- Users can read tasks assigned to them or unassigned active tasks
CREATE POLICY "users_can_read_assigned_or_available_tasks" ON tasks
  FOR SELECT TO authenticated
  USING (
    active = true AND (
      assigned_to = auth.uid() OR 
      (assigned_to IS NULL AND completed = false)
    )
  );

-- Admins can manage all tasks
CREATE POLICY "admin_can_manage_all_tasks" ON tasks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_available_tasks_for_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION assign_task_to_user(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_task_for_company(uuid, uuid) TO authenticated;