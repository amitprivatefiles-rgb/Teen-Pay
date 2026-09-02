/*
  # Change Task Submissions Unique Constraint to Platform-Based
  
  1. Changes
    - Add platform column to task_submissions table
    - Populate platform from associated tasks
    - Drop unique constraint on (user_id, task_id)
    - Add unique constraint on (user_id, platform)
  
  2. New Behavior
    - Users can submit ONE task per platform (Instagram, YouTube, Google, etc.)
    - Users can submit tasks across different platforms
    - Example: User can do 1 Instagram task + 1 YouTube task + 1 Google task
    - But cannot do 2 Instagram tasks or 2 YouTube tasks
  
  3. Security
    - Update RLS policies to work with new structure
*/

-- Step 1: Add platform column to task_submissions
ALTER TABLE task_submissions 
ADD COLUMN IF NOT EXISTS platform text;

-- Step 2: Populate platform from tasks table for existing submissions
UPDATE task_submissions ts
SET platform = t.platform
FROM tasks t
WHERE ts.task_id = t.id
  AND ts.platform IS NULL;

-- Step 3: Make platform NOT NULL after populating
ALTER TABLE task_submissions 
ALTER COLUMN platform SET NOT NULL;

-- Step 4: Drop the old unique constraint on (user_id, task_id)
DROP INDEX IF EXISTS task_submissions_user_task_unique;

-- Step 5: Add new unique constraint on (user_id, platform)
CREATE UNIQUE INDEX IF NOT EXISTS task_submissions_user_platform_unique 
ON task_submissions (user_id, platform);