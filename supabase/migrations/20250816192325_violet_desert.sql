/*
  # Fix infinite recursion in profiles RLS policies

  1. Problem
    - Infinite recursion detected in policy for relation "profiles"
    - This occurs when RLS policies reference themselves or create circular dependencies

  2. Solution
    - Drop all existing problematic policies
    - Create clean, simple policies without circular references
    - Use direct uid() comparisons instead of complex subqueries

  3. Security
    - Users can read and update their own profiles
    - Admin can manage all profiles via direct email check
    - Clean policy structure prevents recursion
*/

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_policy" ON profiles;

-- Create clean, simple policies without recursion
CREATE POLICY "users_can_read_own_profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "admin_can_manage_all_profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.email() = 'admin@teenpay.com')
  WITH CHECK (auth.email() = 'admin@teenpay.com');