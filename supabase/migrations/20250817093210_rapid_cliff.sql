/*
  # Fix Bulk Imported Tasks Visibility

  1. Updates
    - Set all inactive tasks to active = true
    - Set all tasks to completed = false (unless they have approved submissions)
    - Ensure all tasks have proper default values

  2. Security
    - No changes to RLS policies needed
    - This only updates existing data visibility
*/

-- Update all tasks that are currently inactive to be active
-- This will make bulk imported tasks visible to users
UPDATE tasks 
SET 
  active = true,
  updated_at = now()
WHERE active = false;

-- Ensure all tasks without submissions are marked as not completed
UPDATE tasks 
SET 
  completed = false,
  updated_at = now()
WHERE completed IS NULL OR completed = true;

-- Set proper default values for any tasks missing them
UPDATE tasks 
SET 
  max_users = COALESCE(max_users, 1),
  star_rating = COALESCE(star_rating, 5),
  reward_amount = COALESCE(reward_amount, 10),
  active = COALESCE(active, true),
  completed = COALESCE(completed, false),
  updated_at = now()
WHERE 
  max_users IS NULL 
  OR star_rating IS NULL 
  OR reward_amount IS NULL 
  OR active IS NULL 
  OR completed IS NULL;

-- Update tasks that have approved submissions to be completed
UPDATE tasks 
SET 
  completed = true,
  active = false,
  updated_at = now()
WHERE id IN (
  SELECT DISTINCT task_id 
  FROM task_submissions 
  WHERE status = 'approved'
);

-- Ensure assigned tasks are marked as inactive (since they're taken by someone)
UPDATE tasks 
SET 
  active = false,
  updated_at = now()
WHERE assigned_to IS NOT NULL;