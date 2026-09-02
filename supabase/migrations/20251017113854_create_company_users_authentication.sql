/*
  # Create Company Users Authentication System

  1. New Tables
    - `company_users`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key to companies)
      - `email` (text, unique)
      - `name` (text)
      - `auth_user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Changes to Existing Tables
    - Add `company_user_id` to `tasks` table for tracking which company user created the task
  
  3. Security
    - Enable RLS on `company_users` table
    - Add policy for company users to read their own data
    - Add policy for admins to manage all company users
    - Update tasks table policies for company users
  
  4. Important Notes
    - Company users will use Supabase auth with a special metadata flag
    - Only admins can create company user accounts
    - Company users can only access tasks for their company
*/

-- Create company_users table
CREATE TABLE IF NOT EXISTS company_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT 'Company User',
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add company_user_id to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'created_by_company_user'
  ) THEN
    ALTER TABLE tasks ADD COLUMN created_by_company_user uuid REFERENCES company_users(id);
  END IF;
END $$;

-- Enable RLS on company_users
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;

-- Policy: Company users can read their own data
CREATE POLICY "Company users can read own data"
  ON company_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Policy: Admins can read all company users
CREATE POLICY "Admins can read all company users"
  ON company_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can insert company users
CREATE POLICY "Admins can insert company users"
  ON company_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update company users
CREATE POLICY "Admins can update company users"
  ON company_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete company users
CREATE POLICY "Admins can delete company users"
  ON company_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update tasks table policies for company users
CREATE POLICY "Company users can read their company tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.auth_user_id = auth.uid()
      AND company_users.company_id = tasks.company_id
    )
  );

CREATE POLICY "Company users can insert tasks for their company"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.auth_user_id = auth.uid()
      AND company_users.company_id = tasks.company_id
    )
  );

CREATE POLICY "Company users can update their company tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.auth_user_id = auth.uid()
      AND company_users.company_id = tasks.company_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.auth_user_id = auth.uid()
      AND company_users.company_id = tasks.company_id
    )
  );

CREATE POLICY "Company users can delete their company tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM company_users
      WHERE company_users.auth_user_id = auth.uid()
      AND company_users.company_id = tasks.company_id
    )
  );

-- Function to automatically set updated_at
CREATE OR REPLACE FUNCTION update_company_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_company_users_timestamp ON company_users;
CREATE TRIGGER update_company_users_timestamp
  BEFORE UPDATE ON company_users
  FOR EACH ROW
  EXECUTE FUNCTION update_company_users_updated_at();

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_users_company_id ON company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_auth_user_id ON company_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by_company_user ON tasks(created_by_company_user);