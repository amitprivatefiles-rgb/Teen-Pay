/*
  # Add Companies and Update Task Management System

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text, unique, company name)
      - `description` (text, company description)
      - `logo_url` (text, company logo)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Table Updates
    - `tasks` table: Add `company_id` foreign key
    - Update existing tasks to have a default company

  3. Security
    - Enable RLS on `companies` table
    - Add policies for companies access
    - Update task policies to include company context

  4. Functions
    - Add function to calculate company progress
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  logo_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add company_id to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create default company for existing tasks
INSERT INTO companies (name, description, active)
VALUES ('Default Company', 'Default company for existing tasks', true)
ON CONFLICT (name) DO NOTHING;

-- Update existing tasks to have the default company
UPDATE tasks 
SET company_id = (SELECT id FROM companies WHERE name = 'Default Company' LIMIT 1)
WHERE company_id IS NULL;

-- Make company_id required for new tasks
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'company_id' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE tasks ALTER COLUMN company_id SET NOT NULL;
  END IF;
END $$;

-- Enable RLS on companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Everyone can read active companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage all companies"
  ON companies
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(active);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Function to get company task statistics
CREATE OR REPLACE FUNCTION get_company_task_stats(company_uuid uuid)
RETURNS TABLE(
  total_tasks bigint,
  completed_tasks bigint,
  progress_percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN EXISTS (
      SELECT 1 FROM task_submissions ts 
      WHERE ts.task_id = t.id AND ts.status = 'approved'
    ) THEN 1 END) as completed_tasks,
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND(
        (COUNT(CASE WHEN EXISTS (
          SELECT 1 FROM task_submissions ts 
          WHERE ts.task_id = t.id AND ts.status = 'approved'
        ) THEN 1 END) * 100.0) / COUNT(*), 
        2
      )
    END as progress_percentage
  FROM tasks t
  WHERE t.company_id = company_uuid AND t.active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's company progress
CREATE OR REPLACE FUNCTION get_user_company_progress(user_uuid uuid, company_uuid uuid)
RETURNS TABLE(
  total_tasks bigint,
  completed_tasks bigint,
  progress_percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN EXISTS (
      SELECT 1 FROM task_submissions ts 
      WHERE ts.task_id = t.id AND ts.user_id = user_uuid AND ts.status = 'approved'
    ) THEN 1 END) as completed_tasks,
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND(
        (COUNT(CASE WHEN EXISTS (
          SELECT 1 FROM task_submissions ts 
          WHERE ts.task_id = t.id AND ts.user_id = user_uuid AND ts.status = 'approved'
        ) THEN 1 END) * 100.0) / COUNT(*), 
        2
      )
    END as progress_percentage
  FROM tasks t
  WHERE t.company_id = company_uuid AND t.active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;