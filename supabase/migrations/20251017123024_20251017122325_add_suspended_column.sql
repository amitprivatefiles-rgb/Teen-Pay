/*
  # Add suspended column to profiles table

  1. Changes
    - Add suspended column to profiles table (boolean, default false)
    - This allows admins to suspend users from accessing tasks

  2. Security
    - Column is managed by admins only
    - Default value is false (users are not suspended by default)
*/

-- Add suspended column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'suspended'
  ) THEN
    ALTER TABLE profiles ADD COLUMN suspended boolean DEFAULT false;
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_suspended ON profiles(suspended) WHERE suspended = true;
