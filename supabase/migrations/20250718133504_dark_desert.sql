/*
  # Fix Profiles Table RLS Permissions

  1. Security Changes
    - Drop all existing policies that may be causing conflicts
    - Enable RLS on profiles table
    - Create simple, working policies for authenticated users
    - Allow users to read and update their own profiles
    - Allow profile creation during signup

  2. Policy Structure
    - SELECT: Users can read their own profile data
    - INSERT: Users can create their own profile during signup
    - UPDATE: Users can update their own profile data
    - Admin policy: Admins can manage all profiles
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "Users can read own data" ON profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON profiles;
DROP POLICY IF EXISTS "Users can update own data" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "Enable read access for users to own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert access for users to own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update access for users to own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin policy for complete access
CREATE POLICY "Enable all access for admin users"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@teenpay.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@teenpay.com'
    )
  );