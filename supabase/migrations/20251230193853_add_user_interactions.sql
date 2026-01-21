/*
  # Add User Interaction Tables
  
  1. New Tables
    - `reading_progress` - Track reading position and scroll progress
      - `id` (uuid, primary key)
      - `document_id` (uuid, references codex_documents)
      - `scroll_position` (float) - 0-100 percentage
      - `last_read_at` (timestamp)
      - `time_spent_seconds` (integer)
      - `completed` (boolean)
    
    - `bookmarks` - User's favorited documents
      - `id` (uuid, primary key)  
      - `document_id` (uuid, references codex_documents)
      - `created_at` (timestamp)
    
    - `document_notes` - Quick notes/annotations on documents
      - `id` (uuid, primary key)
      - `document_id` (uuid, references codex_documents)
      - `content` (text)
      - `position` (text) - JSON with section reference
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `document_links` - Connections between documents
      - `id` (uuid, primary key)
      - `source_document_id` (uuid)
      - `target_document_id` (uuid)
      - `link_type` (text) - 'reference', 'related', 'parent', etc.
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Public read/write for anonymous users (no auth required for this app)
*/

CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  scroll_position float DEFAULT 0,
  last_read_at timestamptz DEFAULT now(),
  time_spent_seconds integer DEFAULT 0,
  completed boolean DEFAULT false,
  UNIQUE(document_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(document_id)
);

CREATE TABLE IF NOT EXISTS document_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  content text NOT NULL,
  position text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  target_document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  link_type text DEFAULT 'reference',
  created_at timestamptz DEFAULT now(),
  UNIQUE(source_document_id, target_document_id)
);

ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read reading_progress"
  ON reading_progress FOR SELECT TO public USING (true);

CREATE POLICY "Public can insert reading_progress"
  ON reading_progress FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Public can update reading_progress"
  ON reading_progress FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Public can read bookmarks"
  ON bookmarks FOR SELECT TO public USING (true);

CREATE POLICY "Public can insert bookmarks"
  ON bookmarks FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Public can delete bookmarks"
  ON bookmarks FOR DELETE TO public USING (true);

CREATE POLICY "Public can read document_notes"
  ON document_notes FOR SELECT TO public USING (true);

CREATE POLICY "Public can insert document_notes"
  ON document_notes FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Public can update document_notes"
  ON document_notes FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Public can delete document_notes"
  ON document_notes FOR DELETE TO public USING (true);

CREATE POLICY "Public can read document_links"
  ON document_links FOR SELECT TO public USING (true);

CREATE POLICY "Public can insert document_links"
  ON document_links FOR INSERT TO public WITH CHECK (true);

CREATE INDEX idx_reading_progress_document ON reading_progress(document_id);
CREATE INDEX idx_reading_progress_last_read ON reading_progress(last_read_at DESC);
CREATE INDEX idx_bookmarks_document ON bookmarks(document_id);
CREATE INDEX idx_document_notes_document ON document_notes(document_id);
CREATE INDEX idx_document_links_source ON document_links(source_document_id);
CREATE INDEX idx_document_links_target ON document_links(target_document_id);