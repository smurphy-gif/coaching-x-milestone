-- ═══════════════════════════════════════════════════════════════
-- Coaching × Milestone — Database Schema
-- Milestone Mortgage Solutions
-- ═══════════════════════════════════════════════════════════════
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════

-- 1. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'loan_officer' CHECK (role IN ('coach', 'loan_officer')),
  team TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'loan_officer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- 2. RESOURCES
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'doc' CHECK (type IN ('pdf', 'video', 'doc')),
  category TEXT NOT NULL DEFAULT 'Sales',
  url TEXT DEFAULT '',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 3. TASKS (coaching tasks with deadlines)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Sales',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  due_date DATE NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 4. TASK ASSIGNMENTS (who is assigned + completion status)
CREATE TABLE IF NOT EXISTS task_assignments (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  PRIMARY KEY (task_id, user_id)
);


-- 5. DAILY TASKS
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Sales',
  recurring BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 6. DAILY TASK ASSIGNMENTS
CREATE TABLE IF NOT EXISTS daily_task_assignments (
  daily_task_id UUID REFERENCES daily_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (daily_task_id, user_id)
);


-- 7. DAILY COMPLETIONS
CREATE TABLE IF NOT EXISTS daily_completions (
  daily_task_id UUID REFERENCES daily_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (daily_task_id, user_id, date)
);


-- 8. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'dm' CHECK (type IN ('announcement', 'dm')),
  from_user_id UUID REFERENCES profiles(id),
  title TEXT DEFAULT '',
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 9. MESSAGE RECIPIENTS
CREATE TABLE IF NOT EXISTS message_recipients (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ,
  PRIMARY KEY (message_id, user_id)
);


-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is a coach
CREATE OR REPLACE FUNCTION is_coach()
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coach'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES: coaches see all, LOs see themselves
CREATE POLICY "Coaches see all profiles" ON profiles FOR SELECT USING (is_coach());
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Coaches manage profiles" ON profiles FOR ALL USING (is_coach());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RESOURCES: everyone can read, coaches can manage
CREATE POLICY "Everyone reads resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Coaches manage resources" ON resources FOR ALL USING (is_coach());

-- TASKS: coaches manage, LOs see their assignments
CREATE POLICY "Coaches manage tasks" ON tasks FOR ALL USING (is_coach());
CREATE POLICY "LOs see assigned tasks" ON tasks FOR SELECT USING (
  EXISTS(SELECT 1 FROM task_assignments WHERE task_id = tasks.id AND user_id = auth.uid())
);

-- TASK ASSIGNMENTS: coaches manage, LOs see/update own
CREATE POLICY "Coaches manage assignments" ON task_assignments FOR ALL USING (is_coach());
CREATE POLICY "LOs see own assignments" ON task_assignments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "LOs complete own tasks" ON task_assignments FOR UPDATE USING (user_id = auth.uid());

-- DAILY TASKS: coaches manage, LOs see assigned
CREATE POLICY "Coaches manage daily tasks" ON daily_tasks FOR ALL USING (is_coach());
CREATE POLICY "LOs see assigned daily tasks" ON daily_tasks FOR SELECT USING (
  EXISTS(SELECT 1 FROM daily_task_assignments WHERE daily_task_id = daily_tasks.id AND user_id = auth.uid())
);

-- DAILY TASK ASSIGNMENTS
CREATE POLICY "Coaches manage daily assignments" ON daily_task_assignments FOR ALL USING (is_coach());
CREATE POLICY "LOs see own daily assignments" ON daily_task_assignments FOR SELECT USING (user_id = auth.uid());

-- DAILY COMPLETIONS: coaches see all, LOs manage own
CREATE POLICY "Coaches see all completions" ON daily_completions FOR ALL USING (is_coach());
CREATE POLICY "LOs manage own completions" ON daily_completions FOR ALL USING (user_id = auth.uid());

-- MESSAGES: coaches manage, LOs see own
CREATE POLICY "Coaches manage messages" ON messages FOR ALL USING (is_coach());
CREATE POLICY "LOs see announcements" ON messages FOR SELECT USING (type = 'announcement');
CREATE POLICY "LOs see own DMs" ON messages FOR SELECT USING (
  EXISTS(SELECT 1 FROM message_recipients WHERE message_id = messages.id AND user_id = auth.uid())
);

-- MESSAGE RECIPIENTS
CREATE POLICY "Coaches manage recipients" ON message_recipients FOR ALL USING (is_coach());
CREATE POLICY "LOs see own messages" ON message_recipients FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "LOs mark as read" ON message_recipients FOR UPDATE USING (user_id = auth.uid());


-- ═══════════════════════════════════════════════════════════════
-- DONE! Your database is ready.
-- Next: Create your first Coach user via Supabase Auth dashboard,
-- then update their profiles row to set role = 'coach'.
-- ═══════════════════════════════════════════════════════════════
