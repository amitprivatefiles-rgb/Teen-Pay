/*
  # Fix handle_new_user function age constraint issue

  1. Problem
    - The handle_new_user function was setting age to 0 when not provided
    - The profiles table has a CHECK constraint requiring age >= 1
    - This causes "Database error saving new user" during signup

  2. Solution
    - Modify handle_new_user to properly handle age casting
    - Allow NULL values for age when not provided or invalid
    - This satisfies the table schema and avoids CHECK constraint violation

  3. Changes
    - Update handle_new_user function to cast age properly
    - Use NULL instead of 0 for missing/invalid age values
*/

-- Fix the handle_new_user function to properly handle age constraints
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, phone, age, role, total_earnings, daily_earnings)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number', NEW.raw_user_meta_data->>'phone', ''),
    -- Cast age to integer, but allow NULL if not provided or invalid
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
           AND NEW.raw_user_meta_data->>'age' ~ '^[0-9]+$' 
           AND (NEW.raw_user_meta_data->>'age')::integer >= 1
      THEN (NEW.raw_user_meta_data->>'age')::integer
      ELSE NULL
    END,
    'user',
    0,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();