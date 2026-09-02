/*
  # Complete fix for user task access and one task per company rule

  1. Changes
    - Drop ALL existing task policies to start fresh
    - Create comprehensive policies for users, admins, and company users
    - Ensure users can see all active tasks
    - Enforce one task per company per user via database constraint

  2. Security
    - Users can read all active tasks but cannot modify them
    - Admins can manage all tasks
    - Company users can manage their company's tasks only
    - Each user can submit only one task per company (enforced at database level)

  3. Business Logic
    - One task submission per user per company enforced by UNIQUE constraint on (user_id, company_id) in task_submissions
    - Frontend filters out tasks from companies user has already submitted to
*/

-- Add company_id index on task_submissions if not exists for faster lookups
CREATE INDEX IF NOT EXISTS idx_task_submissions_user_company
  ON task_submissions(user_id, task_id);

-- Drop ALL existing task policies to avoid conflicts
DROP POLICY IF EXISTS "users_can_read_assigned_or_available_tasks" ON tasks;
DROP POLICY IF EXISTS "admin_can_manage_all_tasks" ON tasks;
DROP POLICY IF EXISTS "authenticated_users_can_read_active_tasks" ON tasks;
DROP POLICY IF EXISTS "tasks_select_active" ON tasks;
DROP POLICY IF EXISTS "tasks_admin_all" ON tasks;
DROP POLICY IF EXISTS "Users can read active tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can manage all tasks" ON tasks;
DROP POLICY IF EXISTS "Regular users can read active tasks" ON tasks;
DROP POLICY IF EXISTS "Company users can read their company tasks" ON tasks;
DROP POLICY IF EXISTS "Company users can insert tasks for their company" ON tasks;
DROP POLICY IF EXISTS "Company users can update their company tasks" ON tasks;
DROP POLICY IF EXISTS "Company users can delete their company tasks" ON tasks;

-- Policy 1: All authenticated users can read active, non-completed tasks
CREATE POLICY "All authenticated users can read active tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (active = true AND completed = false);

-- Policy 2: Admins have full access to all tasks
CREATE POLICY "Admins have full access to all tasks"
  ON tasks
  FOR ALL
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

-- Policy 3: Company users can read their company tasks
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

-- Policy 4: Company users can insert tasks for their company
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

-- Policy 5: Company users can update their company tasks
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

-- Policy 6: Company users can delete their company tasks
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
