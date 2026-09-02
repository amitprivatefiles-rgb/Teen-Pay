/*
  # Add Task Verification Delay System

  1. Schema Changes
    - Add `verification_deadline` column to task_submissions table
    - Add `estimated_approval_date` column to task_submissions table
    - Update status check constraint to include 'under_review' status
    - Add index for efficient querying of verification deadlines

  2. Security
    - Maintain existing RLS policies
    - No changes to user permissions

  3. Features
    - 4-5 day verification delay for all task submissions
    - Automatic calculation of estimated approval dates
    - Enhanced status tracking for better user experience
*/

-- Add new columns to task_submissions table
DO $$
BEGIN
  -- Add verification_deadline column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'task_submissions' AND column_name = 'verification_deadline'
  ) THEN
    ALTER TABLE task_submissions ADD COLUMN verification_deadline timestamptz;
  END IF;

  -- Add estimated_approval_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'task_submissions' AND column_name = 'estimated_approval_date'
  ) THEN
    ALTER TABLE task_submissions ADD COLUMN estimated_approval_date timestamptz;
  END IF;
END $$;

-- Update the status check constraint to include 'under_review'
ALTER TABLE task_submissions DROP CONSTRAINT IF EXISTS task_submissions_status_check;
ALTER TABLE task_submissions ADD CONSTRAINT task_submissions_status_check 
  CHECK (status = ANY (ARRAY['pending'::text, 'under_review'::text, 'approved'::text, 'rejected'::text]));

-- Add index for efficient querying of verification deadlines
CREATE INDEX IF NOT EXISTS idx_task_submissions_verification_deadline 
  ON task_submissions(verification_deadline) 
  WHERE verification_deadline IS NOT NULL;

-- Update existing pending submissions to have verification deadlines
UPDATE task_submissions 
SET 
  verification_deadline = submitted_at + INTERVAL '5 days',
  estimated_approval_date = submitted_at + INTERVAL '5 days',
  status = 'under_review'
WHERE status = 'pending' AND verification_deadline IS NULL;