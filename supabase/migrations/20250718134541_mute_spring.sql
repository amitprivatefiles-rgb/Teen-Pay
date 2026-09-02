/*
  # Fix Withdrawals Table RLS Permissions

  1. Security
    - Drop existing conflicting policies on withdrawals table
    - Enable RLS on withdrawals table
    - Add policy for users to read their own withdrawals
    - Add policy for users to insert their own withdrawals
    - Add policy for admin to manage all withdrawals

  2. Changes
    - Clean RLS policies without references to users table
    - Use auth.uid() and auth.email() for permissions
*/

-- Drop all existing policies on withdrawals table
DROP POLICY IF EXISTS "Admins can manage all withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Users can insert own withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Users can read own withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "withdrawals_admin_all" ON withdrawals;
DROP POLICY IF EXISTS "withdrawals_insert_own" ON withdrawals;
DROP POLICY IF EXISTS "withdrawals_select_own" ON withdrawals;

-- Ensure RLS is enabled
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Create simple, direct policies
CREATE POLICY "withdrawals_select_own" ON withdrawals
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "withdrawals_insert_own" ON withdrawals
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "withdrawals_admin_all" ON withdrawals
  FOR ALL TO authenticated
  USING (auth.email() = 'admin@teenpay.com')
  WITH CHECK (auth.email() = 'admin@teenpay.com');