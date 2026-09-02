/*
  # Add one task per company restriction

  1. Database Changes
    - Update get_company_available_tasks function to exclude companies where user already submitted
    - Add function to check if user has submitted for a company
    
  2. Security
    - Ensure users can only see tasks from companies they haven't submitted to
    - Maintain data integrity with proper filtering
*/

-- Function to check if user has already submitted a task for a company
CREATE OR REPLACE FUNCTION public.user_has_submitted_for_company(
  p_user_id uuid,
  p_company_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM task_submissions ts
    JOIN tasks t ON ts.task_id = t.id
    WHERE ts.user_id = p_user_id 
    AND t.company_id = p_company_id
  );
END;
$$;

-- Update the get_company_available_tasks function to include user restriction
CREATE OR REPLACE FUNCTION public.get_company_available_tasks(
  p_company_id uuid,
  p_user_id uuid DEFAULT NULL
) RETURNS TABLE (
  task_id uuid,
  title text,
  google_profile_link text,
  review_text text,
  star_rating integer,
  reward_amount numeric,
  max_users integer,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If user_id is provided, check if they've already submitted for this company
  IF p_user_id IS NOT NULL AND user_has_submitted_for_company(p_user_id, p_company_id) THEN
    -- Return empty result set if user has already submitted for this company
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    t.id as task_id,
    t.title,
    t.google_profile_link,
    t.review_text,
    t.star_rating,
    t.reward_amount,
    t.max_users,
    t.created_at
  FROM tasks t
  WHERE t.company_id = p_company_id
    AND t.active = true
    AND NOT EXISTS (
      SELECT 1 
      FROM task_submissions ts 
      WHERE ts.task_id = t.id
    );
END;
$$;