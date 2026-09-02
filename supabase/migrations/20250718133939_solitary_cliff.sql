/*
  # Fix Task Completions RLS Policies

  1. Security
    - Drop existing conflicting policies on task_completions table
    - Add proper RLS policies for authenticated users to access their own data
    - Add admin access policies
*/

-- Drop all existing policies on task_completions
DROP POLICY IF EXISTS "Admins can read all completions" ON task_completions;
DROP POLICY IF EXISTS "Users can insert own completions" ON task_completions;
DROP POLICY IF EXISTS "Users can read own completions" ON task_completions;
DROP POLICY IF EXISTS "task_completions_admin_all" ON task_completions;
DROP POLICY IF EXISTS "task_completions_insert_own" ON task_completions;
DROP POLICY IF EXISTS "task_completions_select_own" ON task_completions;

-- Create simple, direct policies for task_completions
CREATE POLICY "task_completions_select_policy"
  ON task_completions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "task_completions_insert_policy"
  ON task_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "task_completions_admin_policy"
  ON task_completions
  FOR ALL
  TO authenticated
  USING (auth.email() = 'admin@teenpay.com')
  WITH CHECK (auth.email() = 'admin@teenpay.com');

-- Ensure RLS is enabled
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;