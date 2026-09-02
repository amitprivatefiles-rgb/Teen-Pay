/*
  # Change Task Submissions Unique Constraint to Platform + Task Type
  
  1. Changes
    - Add task_type column to task_submissions table
    - Populate task_type from associated tasks
    - Drop unique constraint on (user_id, platform)
    - Add unique constraint on (user_id, platform, task_type)
  
  2. New Behavior
    - Users can submit ONE task per platform per task type
    - Example for Instagram: User can do 1 Like + 1 Comment + 1 Follow task
    - Example for YouTube: User can do 1 Like + 1 Subscribe + 1 Comment task
    - Example for Google: User can do 1 Review task
    - Same applies across all platforms
  
  3. Task Types
    - review: Write a review
    - comment: Leave a comment
    - like: Like/heart content
    - follow: Follow an account
    - subscribe: Subscribe to a channel
    - install_review: Install app and review
*/

-- Step 1: Add task_type column to task_submissions
ALTER TABLE task_submissions 
ADD COLUMN IF NOT EXISTS task_type text;

-- Step 2: Populate task_type from tasks table for existing submissions
UPDATE task_submissions ts
SET task_type = t.task_type
FROM tasks t
WHERE ts.task_id = t.id
  AND ts.task_type IS NULL;

-- Step 3: Make task_type NOT NULL after populating
ALTER TABLE task_submissions 
ALTER COLUMN task_type SET NOT NULL;

-- Step 4: Drop the old unique constraint on (user_id, platform)
DROP INDEX IF EXISTS task_submissions_user_platform_unique;

-- Step 5: Add new unique constraint on (user_id, platform, task_type)
CREATE UNIQUE INDEX IF NOT EXISTS task_submissions_user_platform_type_unique 
ON task_submissions (user_id, platform, task_type);