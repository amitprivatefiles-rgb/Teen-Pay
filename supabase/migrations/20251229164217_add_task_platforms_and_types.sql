/*
  # Add Task Platforms and Types Support
  
  1. Changes
    - Add `platform` column to tasks table (google, instagram, youtube, playstore)
    - Add `task_type` column to tasks table (review, comment, like, follow, subscribe, install_review)
    - Add `task_link` column to tasks table for platform-specific links
    - Update existing tasks to have default values
  
  2. Task Types by Platform
    - Google: review
    - Instagram: comment, like, follow
    - YouTube: comment, like, subscribe
    - Play Store: install_review
  
  3. Notes
    - Existing tasks will be set to platform='google' and task_type='review' for backward compatibility
    - All new columns are required for new tasks
*/

-- Add platform column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'platform'
  ) THEN
    ALTER TABLE tasks ADD COLUMN platform text DEFAULT 'google';
    ALTER TABLE tasks ALTER COLUMN platform SET NOT NULL;
  END IF;
END $$;

-- Add task_type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'task_type'
  ) THEN
    ALTER TABLE tasks ADD COLUMN task_type text DEFAULT 'review';
    ALTER TABLE tasks ALTER COLUMN task_type SET NOT NULL;
  END IF;
END $$;

-- Add task_link column (can be null for now, will be required for new tasks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'task_link'
  ) THEN
    ALTER TABLE tasks ADD COLUMN task_link text;
  END IF;
END $$;

-- Add check constraints for valid values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tasks_platform_check'
  ) THEN
    ALTER TABLE tasks 
    ADD CONSTRAINT tasks_platform_check 
    CHECK (platform IN ('google', 'instagram', 'youtube', 'playstore'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tasks_task_type_check'
  ) THEN
    ALTER TABLE tasks 
    ADD CONSTRAINT tasks_task_type_check 
    CHECK (task_type IN ('review', 'comment', 'like', 'follow', 'subscribe', 'install_review'));
  END IF;
END $$;

-- Update existing tasks to have proper values
UPDATE tasks 
SET platform = 'google', task_type = 'review' 
WHERE platform IS NULL OR task_type IS NULL;

-- Create index for faster filtering by platform
CREATE INDEX IF NOT EXISTS idx_tasks_platform ON tasks(platform);
CREATE INDEX IF NOT EXISTS idx_tasks_task_type ON tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_tasks_platform_company ON tasks(platform, company_id) WHERE active = true;