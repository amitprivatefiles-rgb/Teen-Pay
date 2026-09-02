/*
  # Remove unused database functions and optimize current ones

  1. Drop unused functions
    - Functions that are no longer called by the application
    - Redundant or deprecated functions
  
  2. Keep only active functions
    - handle_new_user (for user registration)
    - handle_task_completion (for task approval workflow)
  
  3. Clean up unused tables/columns if any
*/

-- Drop unused functions (if they exist)
DROP FUNCTION IF EXISTS assign_task_to_user(uuid, uuid);
DROP FUNCTION IF EXISTS get_available_tasks_for_user(uuid);
DROP FUNCTION IF EXISTS complete_task_for_user(uuid, uuid);
DROP FUNCTION IF EXISTS update_user_earnings(uuid, numeric);
DROP FUNCTION IF EXISTS get_user_task_stats(uuid);
DROP FUNCTION IF EXISTS batch_assign_tasks();
DROP FUNCTION IF EXISTS auto_assign_tasks();
DROP FUNCTION IF EXISTS calculate_user_earnings(uuid);
DROP FUNCTION IF EXISTS process_task_batch(uuid);
DROP FUNCTION IF EXISTS validate_task_submission(uuid, uuid);

-- Drop unused triggers (if they exist)
DROP TRIGGER IF EXISTS trigger_auto_assign_tasks ON tasks;
DROP TRIGGER IF EXISTS trigger_update_earnings ON task_completions;
DROP TRIGGER IF EXISTS trigger_batch_processing ON task_batches;

-- Clean up any unused indexes that might slow down queries
DROP INDEX IF EXISTS idx_tasks_auto_assign;
DROP INDEX IF EXISTS idx_user_assignments_batch;
DROP INDEX IF EXISTS idx_batch_processing;

-- Keep only the essential functions that are actually used:
-- 1. handle_new_user - for user registration
-- 2. handle_task_completion - for task approval workflow

-- Verify the essential functions exist and are optimized
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, phone, age, role, total_earnings, daily_earnings)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number', NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 0),
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

-- Keep the task completion function as it's used for earnings
CREATE OR REPLACE FUNCTION handle_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when status changes to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Create wallet transaction record
    INSERT INTO wallet_transactions (
      user_id,
      amount,
      transaction_type,
      description,
      reference_id
    )
    SELECT 
      NEW.user_id,
      t.reward_amount,
      'credit',
      'Task completion reward: ' || t.title,
      NEW.id
    FROM tasks t
    WHERE t.id = NEW.task_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the task completion trigger exists
DROP TRIGGER IF EXISTS trigger_handle_task_completion ON task_submissions;
CREATE TRIGGER trigger_handle_task_completion
  AFTER UPDATE ON task_submissions
  FOR EACH ROW EXECUTE FUNCTION handle_task_completion();