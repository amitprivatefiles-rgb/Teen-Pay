/*
  # Fix RLS Policy for user_task_assignments Table

  1. Security Updates
    - Add INSERT policy for user_task_assignments table
    - Allow users to create their own task assignments
    - Ensure users can only assign tasks to themselves

  2. Changes
    - Add policy for authenticated users to insert their own assignments
    - Policy checks that user_id matches the authenticated user's ID
*/

-- Add INSERT policy for user_task_assignments
CREATE POLICY "users_can_insert_own_assignments"
  ON user_task_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());