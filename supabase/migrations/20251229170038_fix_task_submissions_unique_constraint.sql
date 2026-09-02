/*
  # Fix Task Submissions Unique Constraint
  
  1. Problem
    - Current constraint prevents a user from submitting multiple tasks from the same company
    - Constraint is on (user_id, company_id) which is incorrect
    - Should be on (user_id, task_id) to prevent duplicate submissions for the SAME task
  
  2. Changes
    - Drop the incorrect unique constraint on (user_id, company_id)
    - Add correct unique constraint on (user_id, task_id)
  
  3. Reasoning
    - Users should be able to submit multiple different tasks from the same company
    - Users should NOT be able to submit the same task multiple times
    - This allows proper task submission flow while preventing duplicates
*/

-- Drop the incorrect unique constraint
DROP INDEX IF EXISTS task_submissions_user_company_unique;

-- Add the correct unique constraint on (user_id, task_id)
CREATE UNIQUE INDEX IF NOT EXISTS task_submissions_user_task_unique 
ON task_submissions (user_id, task_id);