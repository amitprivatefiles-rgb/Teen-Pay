/*
  # Create Task Batches and Assignments System

  1. New Tables
    - `task_batches`
      - `id` (uuid, primary key)
      - `name` (text, batch name)
      - `description` (text, optional description)
      - `total_tasks` (integer, total number of tasks in batch)
      - `assigned_tasks` (integer, number of tasks assigned)
      - `completed_tasks` (integer, number of tasks completed)
      - `created_by` (uuid, admin who created the batch)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `batch_tasks`
      - `id` (uuid, primary key)
      - `batch_id` (uuid, foreign key to task_batches)
      - `google_profile_link` (text, Google profile URL)
      - `review_text` (text, review content)
      - `star_rating` (integer, 1-5 stars)
      - `reward_amount` (numeric, payment amount)
      - `status` (text, pending/assigned/completed)
      - `assigned_to` (uuid, user assigned to this task)
      - `assigned_at` (timestamp)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

    - `user_task_assignments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `batch_task_id` (uuid, foreign key to batch_tasks)
      - `batch_id` (uuid, foreign key to task_batches)
      - `status` (text, assigned/completed/submitted)
      - `assigned_at` (timestamp)
      - `completed_at` (timestamp)
      - `submission_id` (uuid, foreign key to task_submissions)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and user access
*/

-- Create task_batches table
CREATE TABLE IF NOT EXISTS task_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  total_tasks integer DEFAULT 0,
  assigned_tasks integer DEFAULT 0,
  completed_tasks integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create batch_tasks table
CREATE TABLE IF NOT EXISTS batch_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid REFERENCES task_batches(id) ON DELETE CASCADE,
  google_profile_link text NOT NULL,
  review_text text NOT NULL,
  star_rating integer DEFAULT 5 CHECK (star_rating >= 1 AND star_rating <= 5),
  reward_amount numeric(10,2) DEFAULT 10,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'completed')),
  assigned_to uuid REFERENCES profiles(id),
  assigned_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create user_task_assignments table
CREATE TABLE IF NOT EXISTS user_task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  batch_task_id uuid REFERENCES batch_tasks(id) ON DELETE CASCADE,
  batch_id uuid REFERENCES task_batches(id) ON DELETE CASCADE,
  status text DEFAULT 'assigned' CHECK (status IN ('assigned', 'completed', 'submitted')),
  assigned_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  submission_id uuid REFERENCES task_submissions(id)
);

-- Enable RLS
ALTER TABLE task_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for task_batches
CREATE POLICY "admin_can_manage_batches"
  ON task_batches
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Policies for batch_tasks
CREATE POLICY "admin_can_manage_batch_tasks"
  ON batch_tasks
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "users_can_read_assigned_tasks"
  ON batch_tasks
  FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

-- Policies for user_task_assignments
CREATE POLICY "admin_can_manage_assignments"
  ON user_task_assignments
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "users_can_read_own_assignments"
  ON user_task_assignments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_can_update_own_assignments"
  ON user_task_assignments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_batch_tasks_batch_id ON batch_tasks(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_tasks_status ON batch_tasks(status);
CREATE INDEX IF NOT EXISTS idx_batch_tasks_assigned_to ON batch_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_user_task_assignments_user_id ON user_task_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_task_assignments_batch_id ON user_task_assignments(batch_id);
CREATE INDEX IF NOT EXISTS idx_user_task_assignments_status ON user_task_assignments(status);

-- Function to auto-assign tasks from a batch
CREATE OR REPLACE FUNCTION assign_batch_tasks(batch_id_param uuid)
RETURNS void AS $$
DECLARE
  user_record RECORD;
  task_record RECORD;
  assignment_count integer;
BEGIN
  -- Get all users (excluding admins)
  FOR user_record IN 
    SELECT id FROM profiles WHERE role = 'user' ORDER BY created_at
  LOOP
    -- Check if user already has an assignment from this batch
    SELECT COUNT(*) INTO assignment_count
    FROM user_task_assignments 
    WHERE user_id = user_record.id AND batch_id = batch_id_param;
    
    -- If user doesn't have an assignment, give them one
    IF assignment_count = 0 THEN
      -- Find an unassigned task from this batch
      SELECT * INTO task_record
      FROM batch_tasks 
      WHERE batch_id = batch_id_param AND status = 'pending'
      LIMIT 1;
      
      -- If we found an unassigned task, assign it
      IF FOUND THEN
        -- Update the batch task
        UPDATE batch_tasks 
        SET status = 'assigned', 
            assigned_to = user_record.id, 
            assigned_at = now()
        WHERE id = task_record.id;
        
        -- Create assignment record
        INSERT INTO user_task_assignments (user_id, batch_task_id, batch_id, status)
        VALUES (user_record.id, task_record.id, batch_id_param, 'assigned');
        
        -- Update batch statistics
        UPDATE task_batches 
        SET assigned_tasks = assigned_tasks + 1,
            updated_at = now()
        WHERE id = batch_id_param;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;