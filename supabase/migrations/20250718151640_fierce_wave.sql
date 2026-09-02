/*
  # Add Task Verification System

  1. New Tables
    - `task_submissions` - Store task submissions with screenshots
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `task_id` (uuid, foreign key to tasks)
      - `screenshot_url` (text, URL to uploaded screenshot)
      - `status` (text, pending/approved/rejected)
      - `admin_notes` (text, optional notes from admin)
      - `submitted_at` (timestamp)
      - `reviewed_at` (timestamp, when admin reviewed)
      - `reviewed_by` (uuid, admin who reviewed)

  2. Modifications
    - Update `task_completions` to reference `task_submissions`
    - Add verification workflow

  3. Security
    - Enable RLS on `task_submissions` table
    - Add policies for users and admin access
*/

-- Create task_submissions table
CREATE TABLE IF NOT EXISTS task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  screenshot_url text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  UNIQUE(user_id, task_id)
);

-- Enable RLS
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_task_submissions_user_id ON task_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_status ON task_submissions(status);

-- RLS Policies for task_submissions
CREATE POLICY "users_can_insert_own_submissions"
  ON task_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_read_own_submissions"
  ON task_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_can_manage_all_submissions"
  ON task_submissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Update task_completions to reference submissions (optional, for tracking)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'task_completions' AND column_name = 'submission_id'
  ) THEN
    ALTER TABLE task_completions ADD COLUMN submission_id uuid REFERENCES task_submissions(id);
  END IF;
END $$;