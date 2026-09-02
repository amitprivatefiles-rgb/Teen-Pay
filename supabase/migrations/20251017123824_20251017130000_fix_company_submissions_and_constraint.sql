/*
  # Fix company user access to submissions and enforce one task per company rule

  1. Changes
    - Add company_id column to task_submissions for easier querying
    - Remove duplicate submissions (keep most recent per user per company)
    - Add RLS policy for company users to view task submissions for their company's tasks
    - Add constraint to enforce one task submission per user per company
    
  2. Security
    - Company users can only see submissions for their company's tasks
    - Users cannot submit more than one task per company
    
  3. Business Logic
    - One task submission per user per company enforced at database level
    - Company users can view all submissions for their tasks
    - Existing duplicates are removed (keeping the most recent)
*/

-- Add company_id column to task_submissions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'task_submissions' AND column_name = 'company_id'
  ) THEN
    -- Add the column
    ALTER TABLE task_submissions ADD COLUMN company_id uuid REFERENCES companies(id);
    
    -- Populate it with existing data
    UPDATE task_submissions ts
    SET company_id = t.company_id
    FROM tasks t
    WHERE ts.task_id = t.id;
    
    -- Make it NOT NULL after populating
    ALTER TABLE task_submissions ALTER COLUMN company_id SET NOT NULL;
  END IF;
END $$;

-- Remove duplicate submissions, keeping only the most recent one per user per company
DELETE FROM task_submissions
WHERE id IN (
  SELECT ts.id
  FROM task_submissions ts
  INNER JOIN (
    -- Get all duplicates with their row numbers
    SELECT 
      id,
      user_id,
      company_id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id, company_id 
        ORDER BY submitted_at DESC
      ) as rn
    FROM task_submissions
  ) ranked
  ON ts.id = ranked.id
  WHERE ranked.rn > 1  -- Keep only the first (most recent) submission
);

-- Drop the old constraint that only prevents duplicate (user_id, task_id)
ALTER TABLE task_submissions DROP CONSTRAINT IF EXISTS task_submissions_user_id_task_id_key;

-- Add a new unique constraint: one submission per user per company
CREATE UNIQUE INDEX IF NOT EXISTS task_submissions_user_company_unique
  ON task_submissions(user_id, company_id);

-- Create trigger to auto-populate company_id on insert
CREATE OR REPLACE FUNCTION set_submission_company_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Get company_id from the task
  SELECT company_id INTO NEW.company_id
  FROM tasks
  WHERE id = NEW.task_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_submission_company_id_trigger ON task_submissions;
CREATE TRIGGER set_submission_company_id_trigger
  BEFORE INSERT ON task_submissions
  FOR EACH ROW
  EXECUTE FUNCTION set_submission_company_id();

-- Add RLS policy for company users to view submissions for their company's tasks
CREATE POLICY "Company users can view submissions for their tasks"
  ON task_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM company_users cu
      WHERE cu.auth_user_id = auth.uid()
      AND cu.company_id = task_submissions.company_id
    )
  );

-- Add policy for company users to update submission status (for their review workflow)
CREATE POLICY "Company users can update their task submissions"
  ON task_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM company_users cu
      WHERE cu.auth_user_id = auth.uid()
      AND cu.company_id = task_submissions.company_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM company_users cu
      WHERE cu.auth_user_id = auth.uid()
      AND cu.company_id = task_submissions.company_id
    )
  );
