/*
  # Update age constraints for profiles

  1. Changes
    - Remove age restriction (13-19) from profiles table
    - Allow users of any age to create accounts
    - Update check constraint to allow ages 1-100

  2. Security
    - Keep existing RLS policies
    - Maintain data integrity with reasonable age limits
*/

-- Remove the existing age constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_check;

-- Add new age constraint allowing any reasonable age
ALTER TABLE profiles ADD CONSTRAINT profiles_age_check CHECK ((age >= 1) AND (age <= 100));