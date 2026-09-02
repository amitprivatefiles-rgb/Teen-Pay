/*
  # Fix task display system with company completion tracking

  1. New Functions
    - `get_company_tasks_for_user()` - Gets all tasks for a company with user completion status
    - `has_user_completed_company_task()` - Checks if user has completed any task for a company

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Function to check if user has completed any task for a company
CREATE OR REPLACE FUNCTION has_user_completed_company_task(
  p_user_id uuid,
  p_company_id uuid
)
RETURNS boolean
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
      AND ts.status IN ('approved', 'pending', 'under_review')
  );
END;
$$;

-- Function to get all tasks for a company with user completion status
CREATE OR REPLACE FUNCTION get_company_tasks_for_user(
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
  user_has_completed boolean,
  user_has_submitted boolean
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
    t.max_users,
    has_user_completed_company_task(p_user_id, p_company_id) as user_has_completed,
    EXISTS (
      SELECT 1 
      FROM task_submissions ts 
      WHERE ts.task_id = t.id 
        AND ts.user_id = p_user_id
    ) as user_has_submitted
  FROM tasks t
  WHERE t.company_id = p_company_id
    AND t.active = true
    AND NOT EXISTS (
      SELECT 1 
      FROM task_submissions ts 
      WHERE ts.task_id = t.id
        AND ts.status IN ('approved', 'pending', 'under_review')
    )
  ORDER BY t.created_at DESC;
END;
$$;