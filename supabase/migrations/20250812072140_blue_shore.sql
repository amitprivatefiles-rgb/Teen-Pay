/*
  # Remove Multiple Review System

  1. Changes
    - Remove task_reviews table (no longer needed)
    - Add review_text back to tasks table
    - Remove task_review_id from task_submissions
    - Drop database functions for review assignment
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
    - Update policies to work with simplified structure
*/

-- Drop the database functions first
DROP FUNCTION IF EXISTS assign_next_review(uuid, uuid);
DROP FUNCTION IF EXISTS get_available_task_count(uuid, uuid);

-- Remove task_review_id from task_submissions
ALTER TABLE task_submissions DROP COLUMN IF EXISTS task_review_id;

-- Add review_text back to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'review_text'
  ) THEN
    ALTER TABLE tasks ADD COLUMN review_text text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Drop the task_reviews table
DROP TABLE IF EXISTS task_reviews CASCADE;

-- Update the unique constraint on task_submissions to allow multiple submissions per task
-- but maintain one submission per user per task
ALTER TABLE task_submissions DROP CONSTRAINT IF EXISTS task_submissions_user_id_task_id_key;
ALTER TABLE task_submissions ADD CONSTRAINT task_submissions_user_id_task_id_key UNIQUE (user_id, task_id);