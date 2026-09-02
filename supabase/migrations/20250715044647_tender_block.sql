/*
  # Complete TeenPay Database Setup

  1. New Tables
    - `profiles` - User profile information
    - `tasks` - Available tasks for users
    - `task_completions` - Track completed tasks
    - `withdrawals` - User withdrawal requests

  2. Security
    - Enable RLS on all tables
    - Add non-recursive policies for safe data access
    - Create trigger for automatic profile creation

  3. Functions
    - Auto-create profile on user signup
    - Handle user metadata properly
*/

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Enable admin access to all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own data" ON profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON profiles;
DROP POLICY IF EXISTS "Users can update own data" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  age integer CHECK (age >= 13 AND age <= 19),
  google_profile_link text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  total_earnings numeric(10,2) DEFAULT 0,
  daily_earnings numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive RLS policies
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin policy using direct role check (no subquery)
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@teenpay.com'
    )
  );

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  google_profile_link text NOT NULL,
  review_text text NOT NULL,
  star_rating integer DEFAULT 5 CHECK (star_rating >= 1 AND star_rating <= 5),
  reward_amount numeric(10,2) DEFAULT 10,
  max_users integer DEFAULT 50,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "tasks_select_active" ON tasks
  FOR SELECT TO authenticated
  USING (active = true);

CREATE POLICY "tasks_admin_all" ON tasks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@teenpay.com'
    )
  );

-- Create task_completions table
CREATE TABLE IF NOT EXISTS task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, task_id)
);

ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- Task completions policies
CREATE POLICY "task_completions_select_own" ON task_completions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "task_completions_insert_own" ON task_completions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "task_completions_admin_all" ON task_completions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@teenpay.com'
    )
  );

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  upi_id text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- Withdrawals policies
CREATE POLICY "withdrawals_select_own" ON withdrawals
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "withdrawals_insert_own" ON withdrawals
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "withdrawals_admin_all" ON withdrawals
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@teenpay.com'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_tasks_active ON tasks(active);
CREATE INDEX IF NOT EXISTS idx_task_completions_user_id ON task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text := 'user';
BEGIN
  -- Check if this is an admin email
  IF NEW.email = 'admin@teenpay.com' THEN
    user_role := 'admin';
  END IF;

  -- Insert new profile
  INSERT INTO public.profiles (
    id,
    name,
    email,
    phone,
    age,
    google_profile_link,
    role,
    total_earnings,
    daily_earnings
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'age')::integer 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'google_profile_link',
    user_role,
    0,
    0
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample tasks for testing
INSERT INTO tasks (title, google_profile_link, review_text, star_rating, reward_amount, max_users, active) VALUES
('Review Local Restaurant', 'https://maps.google.com/contrib/example1', 'Great food and excellent service! Highly recommend this place.', 5, 15.00, 25, true),
('Rate Coffee Shop', 'https://maps.google.com/contrib/example2', 'Amazing coffee and cozy atmosphere. Perfect for studying.', 5, 12.00, 30, true),
('Review Shopping Mall', 'https://maps.google.com/contrib/example3', 'Wide variety of stores and good facilities. Clean and well-maintained.', 4, 20.00, 20, true)
ON CONFLICT DO NOTHING;