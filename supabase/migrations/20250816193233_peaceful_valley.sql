/*
  # Auto-deactivate tasks on submission

  1. Database Changes
    - Create trigger function to deactivate tasks on submission
    - Add trigger to task_submissions table
    - Ensure tasks are immediately removed from website after any submission

  2. Security
    - Maintains existing RLS policies
    - Only affects task visibility, not data integrity
*/

-- Create function to auto-deactivate tasks on submission
CREATE OR REPLACE FUNCTION auto_deactivate_task_on_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Immediately deactivate the task when any submission is created
  UPDATE tasks 
  SET active = false 
  WHERE id = NEW.task_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_auto_deactivate_task ON task_submissions;

-- Create trigger that fires AFTER INSERT on task_submissions
CREATE TRIGGER trigger_auto_deactivate_task
  AFTER INSERT ON task_submissions
  FOR EACH ROW
  EXECUTE FUNCTION auto_deactivate_task_on_submission();

-- Update the task filtering in the application by ensuring only active tasks are shown
-- This is handled by the existing queries that filter by active = true