/*
  # Fix RLS policies for users to view all active tasks

  1. Changes
    - Drop the restrictive policy that requires assigned_to to be null
    - Create a new policy that allows regular users to view all active, non-completed tasks
    - Ensure all existing tasks have assigned_to set to NULL (for backward compatibility)
    - Maintains existing policies for admins and company users

  2. Security
    - Users can only read active tasks (not write)
    - Tasks must be active and not completed
    - Admin and company user policies remain unchanged
*/

-- Ensure all tasks have assigned_to = NULL if not already assigned
UPDATE tasks SET assigned_to = NULL WHERE assigned_to IS NULL;

-- Drop the old restrictive policy for users
DROP POLICY IF EXISTS "users_can_read_assigned_or_available_tasks" ON tasks;

-- Create new policy: Regular users can read all active, incomplete tasks
CREATE POLICY "Regular users can read active tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    active = true
    AND completed = false
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'user'
    )
  );
