/*
  # Task Auto-Assignment System

  1. New Functions
    - `assign_next_task_to_company()` - Automatically assigns pending tasks to companies
    - `handle_task_completion()` - Removes completed tasks and assigns new ones
  
  2. Triggers
    - Auto-assignment trigger on task approval
    - Maintains fresh task availability
  
  3. Changes
    - Tasks are automatically cycled when completed
    - Users always see fresh available tasks
*/

-- Function to assign the next pending task to a company
CREATE OR REPLACE FUNCTION assign_next_task_to_company(company_uuid UUID)
RETURNS VOID AS $$
DECLARE
  next_task_id UUID;
BEGIN
  -- Find the oldest pending task for this company that's not currently active
  SELECT id INTO next_task_id
  FROM tasks 
  WHERE company_id = company_uuid 
    AND active = false
  ORDER BY created_at ASC
  LIMIT 1;
  
  -- If we found a pending task, make it active
  IF next_task_id IS NOT NULL THEN
    UPDATE tasks 
    SET active = true, updated_at = now()
    WHERE id = next_task_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle task completion and assignment
CREATE OR REPLACE FUNCTION handle_task_completion()
RETURNS TRIGGER AS $$
DECLARE
  task_company_id UUID;
  completed_task_id UUID;
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Get the task and company info
    SELECT task_id, tasks.company_id INTO completed_task_id, task_company_id
    FROM task_submissions
    JOIN tasks ON tasks.id = task_submissions.task_id
    WHERE task_submissions.id = NEW.id;
    
    -- Deactivate the completed task
    UPDATE tasks 
    SET active = false, updated_at = now()
    WHERE id = completed_task_id;
    
    -- Assign next available task for this company
    PERFORM assign_next_task_to_company(task_company_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic task assignment
DROP TRIGGER IF EXISTS trigger_handle_task_completion ON task_submissions;
CREATE TRIGGER trigger_handle_task_completion
  AFTER UPDATE ON task_submissions
  FOR EACH ROW
  EXECUTE FUNCTION handle_task_completion();

-- Function to initialize company task assignments (run once for existing data)
CREATE OR REPLACE FUNCTION initialize_company_task_assignments()
RETURNS VOID AS $$
DECLARE
  company_record RECORD;
  active_task_count INTEGER;
BEGIN
  -- For each company, ensure at least one task is active
  FOR company_record IN SELECT id FROM companies WHERE active = true LOOP
    -- Check if company has any active tasks
    SELECT COUNT(*) INTO active_task_count
    FROM tasks 
    WHERE company_id = company_record.id AND active = true;
    
    -- If no active tasks, assign one
    IF active_task_count = 0 THEN
      PERFORM assign_next_task_to_company(company_record.id);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Initialize existing companies (run once)
SELECT initialize_company_task_assignments();