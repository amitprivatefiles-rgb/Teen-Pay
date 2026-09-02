/*
  # Fix per-user, per-company restriction system

  1. Updated Functions
    - Fix `get_company_available_tasks` to only filter for the specific user
    - Keep `user_has_submitted_for_company` for checking individual user status
    
  2. Logic
    - Tasks are only hidden from users who have already submitted for that company
    - Other users can still see and complete all available tasks
    - Restriction is applied per-user, per-company basis
*/

-- Drop and recreate the function with correct logic
DROP FUNCTION IF EXISTS get_company_available_tasks(uuid, uuid);

-- Function to get available tasks for a company (filtered per user)
CREATE OR REPLACE FUNCTION get_company_available_tasks(
  p_company_id uuid,
  p_user_id uuid
)
RETURNS TABLE (
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
  -- Check if this specific user has already submitted for this company
  IF EXISTS (
    SELECT 1 
    FROM task_submissions ts
    JOIN tasks t ON ts.task_id = t.id
    WHERE t.company_id = p_company_id 
    AND ts.user_id = p_user_id
  ) THEN
    -- Return empty result for this user only
    RETURN;
  END IF;

  -- Return all available tasks for this company (not submitted by anyone yet)
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
    )
  ORDER BY t.created_at DESC;
END;
$$;