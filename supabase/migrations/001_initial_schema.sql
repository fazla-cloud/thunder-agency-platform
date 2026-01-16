-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client', 'admin', 'designer', 'marketer')),
  full_name TEXT,
  title TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  duration_seconds INTEGER,
  dimensions TEXT,
  brief TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'drafts' CHECK (status IN ('drafts', 'in_progress', 'completed', 'archived')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create content_types table
CREATE TABLE IF NOT EXISTS content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create platforms table
CREATE TABLE IF NOT EXISTS platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create durations table (predefined duration options in seconds)
CREATE TABLE IF NOT EXISTS durations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  seconds INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create dimensions table (predefined dimension options)
CREATE TABLE IF NOT EXISTS dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimensions ENABLE ROW LEVEL SECURITY;

-- Create a SECURITY DEFINER function to check if user is admin
-- This function bypasses RLS to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all profiles (using is_admin function to avoid recursion)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Clients can view profiles of users assigned to their tasks
CREATE POLICY "Clients can view assigned user profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.assigned_to = profiles.id
      AND tasks.client_id = auth.uid()
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can update any profile (for role and title management)
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Projects RLS Policies
-- Clients can read their own projects
CREATE POLICY "Clients can view own projects" ON projects
  FOR SELECT USING (
    client_id = auth.uid() OR public.is_admin(auth.uid())
  );

-- Clients can create their own projects
CREATE POLICY "Clients can create own projects" ON projects
  FOR INSERT WITH CHECK (client_id = auth.uid());

-- Admins can create projects for any client
CREATE POLICY "Admins can create projects" ON projects
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Clients can update their own projects
CREATE POLICY "Clients can update own projects" ON projects
  FOR UPDATE USING (client_id = auth.uid());

-- Admins can update all projects
CREATE POLICY "Admins can update all projects" ON projects
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Tasks RLS Policies
-- Clients can read tasks for their projects
CREATE POLICY "Clients can view own tasks" ON tasks
  FOR SELECT USING (
    client_id = auth.uid() OR public.is_admin(auth.uid())
  );

-- Designers and marketers can view tasks assigned to them
CREATE POLICY "Assigned users can view their tasks" ON tasks
  FOR SELECT USING (
    assigned_to = auth.uid()
  );

-- Clients can create tasks for their projects
CREATE POLICY "Clients can create own tasks" ON tasks
  FOR INSERT WITH CHECK (
    client_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_id AND client_id = auth.uid()
    )
  );

-- Admins can create tasks
CREATE POLICY "Admins can create tasks" ON tasks
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Clients can update their own tasks
CREATE POLICY "Clients can update own tasks" ON tasks
  FOR UPDATE USING (client_id = auth.uid());

-- Designers and marketers can update tasks assigned to them
CREATE POLICY "Assigned users can update their tasks" ON tasks
  FOR UPDATE USING (
    assigned_to = auth.uid()
  );

-- Admins can update all tasks
CREATE POLICY "Admins can update all tasks" ON tasks
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Content Types RLS Policies
-- Anyone can view content_types
CREATE POLICY "Anyone can view content_types" ON content_types
  FOR SELECT USING (true);

-- Admins can manage content_types
CREATE POLICY "Admins can manage content_types" ON content_types
  FOR ALL USING (public.is_admin(auth.uid()));

-- Platforms RLS Policies
-- Anyone can view platforms
CREATE POLICY "Anyone can view platforms" ON platforms
  FOR SELECT USING (true);

-- Admins can manage platforms
CREATE POLICY "Admins can manage platforms" ON platforms
  FOR ALL USING (public.is_admin(auth.uid()));

-- Durations RLS Policies
-- Anyone can view durations
CREATE POLICY "Anyone can view durations" ON durations
  FOR SELECT USING (true);

-- Admins can manage durations
CREATE POLICY "Admins can manage durations" ON durations
  FOR ALL USING (public.is_admin(auth.uid()));

-- Dimensions RLS Policies
-- Anyone can view dimensions
CREATE POLICY "Anyone can view dimensions" ON dimensions
  FOR SELECT USING (true);

-- Admins can manage dimensions
CREATE POLICY "Admins can manage dimensions" ON dimensions
  FOR ALL USING (public.is_admin(auth.uid()));

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, is_active)
  VALUES (
    NEW.id,
    'client', -- Default role
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default values for content_types
INSERT INTO content_types (name) VALUES
  ('Post'),
  ('Reel'),
  ('Video'),
  ('Story'),
  ('Banner'),
  ('Carousel')
ON CONFLICT (name) DO NOTHING;

-- Insert default values for platforms
INSERT INTO platforms (name) VALUES
  ('Instagram'),
  ('Facebook'),
  ('YouTube'),
  ('TikTok'),
  ('Twitter'),
  ('LinkedIn')
ON CONFLICT (name) DO NOTHING;

-- Insert default values for durations
INSERT INTO durations (label, seconds) VALUES
  ('15 seconds', 15),
  ('30 seconds', 30),
  ('60 seconds', 60),
  ('90 seconds', 90),
  ('2 minutes', 120),
  ('3 minutes', 180),
  ('5 minutes', 300)
ON CONFLICT (seconds) DO NOTHING;

-- Insert default values for dimensions
INSERT INTO dimensions (label, value) VALUES
  ('Instagram Post', '1080x1080'),
  ('Instagram Story', '1080x1920'),
  ('Instagram Reel', '1080x1920'),
  ('Facebook Post', '1200x630'),
  ('YouTube Thumbnail', '1280x720'),
  ('YouTube Video', '1920x1080'),
  ('TikTok Video', '1080x1920'),
  ('Twitter Post', '1200x675'),
  ('LinkedIn Post', '1200x627')
ON CONFLICT (value) DO NOTHING;

-- ============================================================================
-- Storage Bucket Setup for Avatars
-- ============================================================================
-- IMPORTANT: You must create the 'avatars' bucket in Supabase Dashboard first:
-- 1. Go to Storage > Create Bucket
-- 2. Name: avatars
-- 3. Public: Yes (recommended) OR No (then use RLS policies below)
-- 4. After creating the bucket, the RLS policies below will be applied

-- RLS Policies for avatars bucket
-- These policies allow users to upload/update/delete their own avatars and view all avatars

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow all authenticated users to view avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'avatars');

-- Note: If you made the bucket public, the SELECT policy above is optional
-- but the INSERT/UPDATE/DELETE policies are still needed for security
