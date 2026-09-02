/*
  # Allow Multiple Submissions for YouTube and Instagram Tasks

  1. Changes
    - Drop the existing unique constraint on task_submissions
    - Create a partial unique index that only applies to non-YouTube/Instagram platforms
    - This allows users to submit multiple tasks for YouTube and Instagram
    - Other platforms (Facebook, Twitter, TikTok) remain restricted to one submission per company per task type

  2. Security
    - Maintains existing RLS policies
    - No changes to data access permissions
*/

-- Drop the existing unique constraint
ALTER TABLE task_submissions 
DROP CONSTRAINT IF EXISTS task_submissions_user_company_platform_task_type_unique;

-- Create a partial unique index for non-YouTube/Instagram platforms
-- This ensures users can only submit once per company per platform per task type
-- EXCEPT for YouTube and Instagram where multiple submissions are allowed
CREATE UNIQUE INDEX IF NOT EXISTS task_submissions_user_company_platform_task_type_unique_non_yt_ig
ON task_submissions (user_id, company_id, platform, task_type)
WHERE platform NOT IN ('youtube', 'instagram');
