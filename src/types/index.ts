export type ProvenanceStatus =
  | 'verified'
  | 'repository_evidence'
  | 'concept'
  | 'unknown';

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
  provenance_status: ProvenanceStatus[];
  evidence_basis: string;
  last_reviewed: string | null;
  is_read_only: boolean;
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

export type SessionMode = 'high' | 'low';

export type ActionStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface CodexAction {
  id: string;
  action_title: string;
  status: ActionStatus;
  context_complexity: string | null;
  portfolio_segment: string | null;
  priority_weight: number;
  is_next_action: boolean;
  created_at: string;
}
