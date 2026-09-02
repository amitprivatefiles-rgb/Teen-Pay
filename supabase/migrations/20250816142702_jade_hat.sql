/*
  # Fix ambiguous column references in database functions

  1. Database Functions
    - Fix `get_available_tasks_for_user` function to properly qualify column names
    - Fix `assign_task_to_user` function to avoid ambiguous references
    - Fix `get_user_task_for_company` function column references

  2. Changes Made
    - Added proper table aliases (t, p, c, tc, ts)
    - Qualified all column references with table aliases
    - Fixed JOIN conditions to be explicit
    - Ensured no ambiguous column references remain
*/

-- Drop existing functions to recreate them with fixes
DROP FUNCTION IF EXISTS get_available_tasks_for_user(uuid);
DROP FUNCTION IF EXISTS assign_task_to_user(uuid, uuid);
DROP FUNCTION IF EXISTS get_user_task_for_company(uuid, uuid);

-- Fixed get_available_tasks_for_user function
CREATE OR REPLACE FUNCTION get_available_tasks_for_user(p_user_id uuid)
RETURNS TABLE (
  task_id uuid,
  company_id uuid,
  company_name text,
  title text,
  google_profile_link text,
  review_text text,
  star_rating integer,
  reward_amount numeric(10,2)
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as task_id,
    t.company_id,
    c.name as company_name,
    t.title,
    t.google_profile_link,
    t.review_text,
    t.star_rating,
    t.reward_amount
  FROM tasks t
  JOIN companies c ON t.company_id = c.id
  WHERE t.active = true
    AND t.assigned_to IS NULL
    AND t.completed = false
    AND c.active = true
    AND NOT EXISTS (
      SELECT 1 
      FROM tasks t2 
      WHERE t2.company_id = t.company_id 
        AND t2.assigned_to = p_user_id
    )
    AND NOT EXISTS (
      SELECT 1 
      FROM task_completions tc 
      JOIN tasks t3 ON tc.task_id = t3.id
      WHERE tc.user_id = p_user_id 
        AND t3.company_id = t.company_id
    )
  ORDER BY t.created_at ASC;
END;
$$;

-- Fixed assign_task_to_user function
CREATE OR REPLACE FUNCTION assign_task_to_user(p_task_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  task_exists boolean := false;
  user_has_company_task boolean := false;
  company_id_var uuid;
BEGIN
  -- Check if task exists and is available
  SELECT EXISTS(
    SELECT 1 FROM tasks t
    WHERE t.id = p_task_id 
      AND t.active = true 
      AND t.assigned_to IS NULL 
      AND t.completed = false
  ), t.company_id
  INTO task_exists, company_id_var
  FROM tasks t
  WHERE t.id = p_task_id;

  IF NOT task_exists THEN
    RETURN false;
  END IF;

  -- Check if user already has a task for this company
  SELECT EXISTS(
    SELECT 1 FROM tasks t
    WHERE t.company_id = company_id_var 
      AND t.assigned_to = p_user_id
  ) INTO user_has_company_task;

  IF user_has_company_task THEN
    RETURN false;
  END IF;

  -- Check if user has completed any task for this company
  SELECT EXISTS(
    SELECT 1 
    FROM task_completions tc 
    JOIN tasks t ON tc.task_id = t.id
    WHERE tc.user_id = p_user_id 
      AND t.company_id = company_id_var
  ) INTO user_has_company_task;

  IF user_has_company_task THEN
    RETURN false;
  END IF;

  -- Assign the task
  UPDATE tasks 
  SET assigned_to = p_user_id, 
      assigned_at = now()
  WHERE id = p_task_id 
    AND assigned_to IS NULL;

  RETURN FOUND;
END;
$$;

-- Fixed get_user_task_for_company function
CREATE OR REPLACE FUNCTION get_user_task_for_company(p_user_id uuid, p_company_id uuid)
RETURNS TABLE (
  task_id uuid,
  title text,
  google_profile_link text,
  review_text text,
  star_rating integer,
  reward_amount numeric(10,2),
  assigned_at timestamptz,
  submission_status text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as task_id,
    t.title,
    t.google_profile_link,
    t.review_text,
    t.star_rating,
    t.reward_amount,
    t.assigned_at,
    COALESCE(ts.status, 'not_submitted') as submission_status
  FROM tasks t
  LEFT JOIN task_submissions ts ON t.id = ts.task_id AND ts.user_id = p_user_id
  WHERE t.company_id = p_company_id 
    AND t.assigned_to = p_user_id
    AND t.active = true
  LIMIT 1;
END;
$$;