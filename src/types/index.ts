export interface CodexDocument {
  id: string;
  title: string;
  path: string;
  content: string;
  category: string;
  parent_id: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CodexTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface DocumentWithTags extends CodexDocument {
  tags: CodexTag[];
}
