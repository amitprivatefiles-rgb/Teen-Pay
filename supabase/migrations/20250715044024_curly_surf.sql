/*
  # Remove Google Profile Link Requirement

  1. Changes
    - Make google_profile_link column nullable in profiles table
    - Remove validation constraints for Google profile links
    - Update trigger function to handle missing google_profile_link

  2. Security
    - Maintain existing RLS policies
    - Keep all other validation constraints
*/

-- Make google_profile_link nullable
ALTER TABLE profiles ALTER COLUMN google_profile_link DROP NOT NULL;

-- Update the trigger function to handle missing google_profile_link
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    phone, 
    age, 
    google_profile_link,
    role
  )
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone_number',
    (new.raw_user_meta_data->>'age')::integer,
    new.raw_user_meta_data->>'google_profile_link', -- This can now be null
    CASE 
      WHEN new.email = 'admin@teenpay.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;