/*
  # Fix Company Deletion - Enable Cascade Delete
  
  1. Changes
    - Drop existing foreign key constraint on task_submissions.company_id
    - Add new foreign key constraint with CASCADE on delete
    - This allows companies to be deleted even when they have associated submissions
  
  2. Notes
    - When a company is deleted, all associated task_submissions will also be deleted
    - This maintains referential integrity while allowing admin to delete companies
*/

-- Drop the existing foreign key constraint
ALTER TABLE task_submissions 
DROP CONSTRAINT IF EXISTS task_submissions_company_id_fkey;

-- Add the constraint back with CASCADE delete
ALTER TABLE task_submissions
ADD CONSTRAINT task_submissions_company_id_fkey 
FOREIGN KEY (company_id) 
REFERENCES companies(id) 
ON DELETE CASCADE;