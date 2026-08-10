/*
  # Owner-scoped document interactions

  Authenticated, per-user storage for bookmarks, reading progress, and notes.
  Replaces anonymous public read/write policies from 20251230193853.

  Design:
  - `profiles` maps auth.users → app identity (email, display name, role)
  - Interaction rows carry `user_id = auth.uid()`
  - RLS allows only the owning authenticated user
  - Anon has no privileges on these tables
  - Canonical `codex_documents` stay public read-only; this does not unlock content edits
*/

-- ─── Profiles (auth provider identity → app user) ───────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  role text NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'user')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

REVOKE ALL ON profiles FROM anon, public;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

-- ─── Ensure base interaction tables exist ───────────────────────────────

CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  scroll_position float DEFAULT 0,
  last_read_at timestamptz DEFAULT now(),
  time_spent_seconds integer DEFAULT 0,
  completed boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  content text NOT NULL,
  position text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Upgrade to owner-scoped columns ────────────────────────────────────

ALTER TABLE reading_progress
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE bookmarks
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE document_notes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop anonymous / shared rows before enforcing NOT NULL ownership.
DELETE FROM reading_progress WHERE user_id IS NULL;
DELETE FROM bookmarks WHERE user_id IS NULL;
DELETE FROM document_notes WHERE user_id IS NULL;

ALTER TABLE reading_progress ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE bookmarks ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE document_notes ALTER COLUMN user_id SET NOT NULL;

-- Replace document-only uniqueness with per-user uniqueness.
ALTER TABLE reading_progress DROP CONSTRAINT IF EXISTS reading_progress_document_id_key;
ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_document_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS reading_progress_user_document_uidx
  ON reading_progress(user_id, document_id);

CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_user_document_uidx
  ON bookmarks(user_id, document_id);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user_last_read
  ON reading_progress(user_id, last_read_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created
  ON bookmarks(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_document_notes_user_document
  ON document_notes(user_id, document_id);

-- ─── Drop legacy public policies ────────────────────────────────────────

DROP POLICY IF EXISTS "Public can read reading_progress" ON reading_progress;
DROP POLICY IF EXISTS "Public can insert reading_progress" ON reading_progress;
DROP POLICY IF EXISTS "Public can update reading_progress" ON reading_progress;

DROP POLICY IF EXISTS "Public can read bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Public can insert bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Public can delete bookmarks" ON bookmarks;

DROP POLICY IF EXISTS "Public can read document_notes" ON document_notes;
DROP POLICY IF EXISTS "Public can insert document_notes" ON document_notes;
DROP POLICY IF EXISTS "Public can update document_notes" ON document_notes;
DROP POLICY IF EXISTS "Public can delete document_notes" ON document_notes;

-- Idempotent drop of owner policies in case migration is re-run after rename.
DROP POLICY IF EXISTS "Owners can read own reading_progress" ON reading_progress;
DROP POLICY IF EXISTS "Owners can insert own reading_progress" ON reading_progress;
DROP POLICY IF EXISTS "Owners can update own reading_progress" ON reading_progress;
DROP POLICY IF EXISTS "Owners can delete own reading_progress" ON reading_progress;

DROP POLICY IF EXISTS "Owners can read own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Owners can insert own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Owners can delete own bookmarks" ON bookmarks;

DROP POLICY IF EXISTS "Owners can read own document_notes" ON document_notes;
DROP POLICY IF EXISTS "Owners can insert own document_notes" ON document_notes;
DROP POLICY IF EXISTS "Owners can update own document_notes" ON document_notes;
DROP POLICY IF EXISTS "Owners can delete own document_notes" ON document_notes;

ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can read own reading_progress"
  ON reading_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert own reading_progress"
  ON reading_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update own reading_progress"
  ON reading_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete own reading_progress"
  ON reading_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can read own bookmarks"
  ON bookmarks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert own bookmarks"
  ON bookmarks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete own bookmarks"
  ON bookmarks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can read own document_notes"
  ON document_notes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert own document_notes"
  ON document_notes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update own document_notes"
  ON document_notes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete own document_notes"
  ON document_notes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

REVOKE ALL ON reading_progress FROM anon, public;
REVOKE ALL ON bookmarks FROM anon, public;
REVOKE ALL ON document_notes FROM anon, public;

GRANT SELECT, INSERT, UPDATE, DELETE ON reading_progress TO authenticated;
GRANT SELECT, INSERT, DELETE ON bookmarks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON document_notes TO authenticated;
