/*
  # Fix RLS Policies for Tasks and Task Completions

  1. Tasks Table
    - Enable RLS on tasks table
    - Allow authenticated users to read active tasks
    - Allow admins to manage all tasks

  2. Task Completions Table
    - Enable RLS on task_completions table
    - Allow users to read their own completions
    - Allow users to insert their own completions
    - Allow admins to manage all completions

  3. Security
    - Users can only see their own task completions
    - All authenticated users can see active tasks
    - Admin has full access to everything
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "tasks_select_active" ON tasks;
DROP POLICY IF EXISTS "tasks_admin_all" ON tasks;
DROP POLICY IF EXISTS "Admins can manage all tasks" ON tasks;
DROP POLICY IF EXISTS "Users can read active tasks" ON tasks;

DROP POLICY IF EXISTS "task_completions_select_own" ON task_completions;
DROP POLICY IF EXISTS "task_completions_insert_own" ON task_completions;
DROP POLICY IF EXISTS "task_completions_admin_all" ON task_completions;
DROP POLICY IF EXISTS "task_completions_select_policy" ON task_completions;
DROP POLICY IF EXISTS "task_completions_insert_policy" ON task_completions;
DROP POLICY IF EXISTS "task_completions_admin_policy" ON task_completions;

-- Ensure RLS is enabled
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- Tasks table policies
CREATE POLICY "authenticated_users_can_read_active_tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "admin_can_manage_all_tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.email() = 'admin@teenpay.com')
  WITH CHECK (auth.email() = 'admin@teenpay.com');

-- Task completions table policies
CREATE POLICY "users_can_read_own_completions"
  ON task_completions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_completions"
  ON task_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_can_manage_all_completions"
  ON task_completions
  FOR ALL
  TO authenticated
  USING (auth.email() = 'admin@teenpay.com')
  WITH CHECK (auth.email() = 'admin@teenpay.com');