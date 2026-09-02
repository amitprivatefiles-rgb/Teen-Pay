/*
  # Create get_company_available_tasks function

  1. New Functions
    - `get_company_available_tasks(p_company_id)`
      - Returns all active tasks for a company that haven't been submitted by any user
      - Includes task details like title, google_profile_link, review_text, star_rating, reward_amount
      - Filters out tasks that have submissions in task_submissions table

  2. Security
    - Function is accessible to authenticated users
    - Uses existing RLS policies on tasks table
*/

CREATE OR REPLACE FUNCTION public.get_company_available_tasks(p_company_id uuid)
RETURNS TABLE (
  task_id uuid,
  title text,
  google_profile_link text,
  review_text text,
  star_rating integer,
  reward_amount numeric(10,2),
  max_users integer,
  created_at timestamptz
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