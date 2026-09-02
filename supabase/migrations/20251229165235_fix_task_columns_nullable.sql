/*
  # Fix Task Column Constraints for Multi-Platform Support
  
  1. Changes
    - Make `review_text` nullable (not needed for like, follow, subscribe tasks)
    - Make `google_profile_link` nullable (using `task_link` instead)
    - These fields are only required for specific task types:
      - review_text: required for 'review', 'comment', 'install_review'
      - google_profile_link: optional, using task_link instead
  
  2. Reasoning
    - Instagram/YouTube like, follow, subscribe tasks don't need review text
    - Using task_link as the primary link field for all platforms
    - Maintains backward compatibility with existing data
*/

-- Make review_text nullable
ALTER TABLE tasks 
ALTER COLUMN review_text DROP NOT NULL;

-- Make google_profile_link nullable
ALTER TABLE tasks 
ALTER COLUMN google_profile_link DROP NOT NULL;

-- Update existing records to use task_link if google_profile_link exists but task_link is null
UPDATE tasks 
SET task_link = google_profile_link 
WHERE task_link IS NULL AND google_profile_link IS NOT NULL;