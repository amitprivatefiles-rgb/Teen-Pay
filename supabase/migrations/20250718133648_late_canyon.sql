/*
  # Fix Profiles Table RLS Policies

  1. Security
    - Drop all existing conflicting policies on profiles table
    - Enable RLS on profiles table
    - Create simple, direct policies using auth.uid()
    - Add policies for SELECT, INSERT, and UPDATE operations
    - Add admin access policy

  2. Changes
    - Remove any policies that reference the 'users' table
    - Use only auth.uid() for user identification
    - Ensure policies are non-recursive and straightforward
*/

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Enable all access for admin users" ON profiles;
DROP POLICY IF EXISTS "Enable insert access for users to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update access for users to own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own data" ON profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON profiles;
DROP POLICY IF EXISTS "Users can update own data" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, direct policies
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin policy for admin@teenpay.com
CREATE POLICY "profiles_admin_policy" ON profiles
  FOR ALL
  TO authenticated
  USING (auth.email() = 'admin@teenpay.com')
  WITH CHECK (auth.email() = 'admin@teenpay.com');