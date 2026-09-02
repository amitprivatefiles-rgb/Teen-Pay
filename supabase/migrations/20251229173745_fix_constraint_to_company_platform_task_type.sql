/*
  # Fix Task Submissions Unique Constraint to Company + Platform + Task Type
  
  1. Changes
    - Drop unique constraint on (user_id, platform, task_type)
    - Add unique constraint on (user_id, company_id, platform, task_type)
  
  2. New Behavior
    - Users can submit ONE task per company per platform per task type
    - Example for Instagram Like:
      - User can do Instagram Like for Company A
      - User can do Instagram Like for Company B
      - User can do Instagram Like for Company C
    - Same applies for all platforms and task types
  
  3. Examples
    - User submits Instagram Like for ABC Company → Only ABC's Instagram Like tasks disappear
    - User can still see Instagram Like tasks from other companies (XYZ, DEF, etc.)
    - User submits YouTube Subscribe for ABC Company → Only ABC's YouTube Subscribe tasks disappear
    - User can still see YouTube Subscribe tasks from other companies
*/

-- Step 1: Drop the old unique constraint on (user_id, platform, task_type)
DROP INDEX IF EXISTS task_submissions_user_platform_type_unique;

-- Step 2: Add new unique constraint on (user_id, company_id, platform, task_type)
CREATE UNIQUE INDEX IF NOT EXISTS task_submissions_user_company_platform_type_unique 
ON task_submissions (user_id, company_id, platform, task_type);