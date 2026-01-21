/*
  # Create Codex Document Management Schema
  
  1. New Tables
    - `codex_documents` - Stores all codex documents with hierarchy support
      - `id` (uuid, primary key)
      - `title` (text)
      - `path` (text, unique) - Full path like "/codex/root/identity.md"
      - `content` (text) - Full document content
      - `category` (text) - Category like "root", "council", "artistic_systems"
      - `parent_id` (uuid) - For hierarchical structure
      - `order` (integer) - Display order within parent
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `codex_tags` - Document tags/labels
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `color` (text) - Hex color for UI
      - `created_at` (timestamp)
    - `codex_document_tags` - Junction table for many-to-many relationship
      - `document_id` (uuid, foreign key)
      - `tag_id` (uuid, foreign key)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to documents
    - Restrict write access to authenticated users (for future admin)
*/

CREATE TABLE IF NOT EXISTS codex_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  path text UNIQUE NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  parent_id uuid REFERENCES codex_documents(id) ON DELETE SET NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS codex_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS codex_document_tags (
  document_id uuid NOT NULL REFERENCES codex_documents(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES codex_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

ALTER TABLE codex_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE codex_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE codex_document_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read documents"
  ON codex_documents
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read tags"
  ON codex_tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read document tags"
  ON codex_document_tags
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_documents_category ON codex_documents(category);
CREATE INDEX idx_documents_path ON codex_documents(path);
CREATE INDEX idx_documents_parent ON codex_documents(parent_id);
CREATE INDEX idx_document_tags_document ON codex_document_tags(document_id);
CREATE INDEX idx_document_tags_tag ON codex_document_tags(tag_id);