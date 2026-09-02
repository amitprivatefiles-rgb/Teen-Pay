/*
  # Add User Suspension Feature

  1. Schema Changes
    - Add `suspended` column to profiles table
    - Add `suspended_at` timestamp column
    - Add `suspended_by` reference to admin who suspended
    - Add `suspension_reason` text field

  2. Security
    - Update RLS policies to prevent suspended users from accessing data
    - Add admin policies for user management

  3. Indexes
    - Add index on suspended status for performance
*/

-- Add suspension columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'suspended'
  ) THEN
    ALTER TABLE profiles ADD COLUMN suspended boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'suspended_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN suspended_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'suspended_by'
  ) THEN
    ALTER TABLE profiles ADD COLUMN suspended_by uuid REFERENCES profiles(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'suspension_reason'
  ) THEN
    ALTER TABLE profiles ADD COLUMN suspension_reason text;
  END IF;
END $$;

-- Add index for suspended users
CREATE INDEX IF NOT EXISTS idx_profiles_suspended ON profiles(suspended) WHERE suspended = true;

-- Update RLS policies to prevent suspended users from accessing data
DROP POLICY IF EXISTS "users_can_read_own_profile" ON profiles;
CREATE POLICY "users_can_read_own_profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (uid() = id AND (suspended = false OR suspended IS NULL));

DROP POLICY IF EXISTS "users_can_update_own_profile" ON profiles;
CREATE POLICY "users_can_update_own_profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (uid() = id AND (suspended = false OR suspended IS NULL))
  WITH CHECK (uid() = id AND (suspended = false OR suspended IS NULL));

-- Update task-related policies to prevent suspended users from accessing tasks
DROP POLICY IF EXISTS "users_can_read_assigned_or_available_tasks" ON tasks;
CREATE POLICY "users_can_read_assigned_or_available_tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    active = true 
    AND ((assigned_to = uid()) OR ((assigned_to IS NULL) AND (completed = false)))
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = uid() 
      AND (profiles.suspended = false OR profiles.suspended IS NULL)
    )
  );

-- Update task submissions policies
DROP POLICY IF EXISTS "users_can_insert_own_submissions" ON task_submissions;
CREATE POLICY "users_can_insert_own_submissions"
  ON task_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = uid() 
      AND (profiles.suspended = false OR profiles.suspended IS NULL)
    )
  );

DROP POLICY IF EXISTS "users_can_read_own_submissions" ON task_submissions;
CREATE POLICY "users_can_read_own_submissions"
  ON task_submissions
  FOR SELECT
  TO authenticated
  USING (
    uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = uid() 
      AND (profiles.suspended = false OR profiles.suspended IS NULL)
    )
  );

-- Update withdrawals policies
DROP POLICY IF EXISTS "withdrawals_insert_own" ON withdrawals;
CREATE POLICY "withdrawals_insert_own"
  ON withdrawals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = uid()
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = uid() 
      AND (profiles.suspended = false OR profiles.suspended IS NULL)
    )
  );

DROP POLICY IF EXISTS "withdrawals_select_own" ON withdrawals;
CREATE POLICY "withdrawals_select_own"
  ON withdrawals
  FOR SELECT
  TO authenticated
  USING (
    user_id = uid()
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = uid() 
      AND (profiles.suspended = false OR profiles.suspended IS NULL)
    )
  );

-- Add admin policies for user management
CREATE POLICY IF NOT EXISTS "admin_can_suspend_users"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles admin_profile
      WHERE admin_profile.id = uid() 
      AND admin_profile.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles admin_profile
      WHERE admin_profile.id = uid() 
      AND admin_profile.role = 'admin'
    )
  );

-- Add function to handle user suspension
CREATE OR REPLACE FUNCTION suspend_user(
  target_user_id uuid,
  reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the current user (admin)
  admin_id := auth.uid();
  
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can suspend users';
  END IF;
  
  -- Suspend the user
  UPDATE profiles 
  SET 
    suspended = true,
    suspended_at = now(),
    suspended_by = admin_id,
    suspension_reason = reason
  WHERE id = target_user_id AND role = 'user';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found or cannot be suspended';
  END IF;
END;
$$;

-- Add function to unsuspend user
CREATE OR REPLACE FUNCTION unsuspend_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the current user (admin)
  admin_id := auth.uid();
  
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can unsuspend users';
  END IF;
  
  -- Unsuspend the user
  UPDATE profiles 
  SET 
    suspended = false,
    suspended_at = NULL,
    suspended_by = NULL,
    suspension_reason = NULL
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;