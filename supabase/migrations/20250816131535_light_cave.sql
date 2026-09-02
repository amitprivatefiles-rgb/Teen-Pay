/*
  # Create Storage Bucket for Task Screenshots

  1. Storage Setup
    - Create 'task-screenshots' bucket for file uploads
    - Enable public access for uploaded files
    - Set up RLS policies for secure access

  2. Security
    - Allow authenticated users to upload files
    - Allow users to read their own uploaded files
    - Allow admins to read all files for review
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-screenshots', 'task-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload task screenshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-screenshots' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own uploaded files
CREATE POLICY "Users can read own task screenshots"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'task-screenshots' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to read all task screenshots for review
CREATE POLICY "Admins can read all task screenshots"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'task-screenshots' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow users to update their own files (for resubmissions)
CREATE POLICY "Users can update own task screenshots"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'task-screenshots' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own task screenshots"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'task-screenshots' AND
  (storage.foldername(name))[1] = auth.uid()::text
);