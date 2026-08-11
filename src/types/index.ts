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

export interface Workspace {
  id: string;
  name: string;
}

export type ExecutionLane =
  | 'execution'
  | 'research'
  | 'architecture'
  | 'deployment'
  | 'documentation'
  | 'system_state'
  | 'override';

export type RouteRisk = 'low' | 'medium' | 'high' | 'critical';

export type RouteSensitivity = 'public' | 'internal' | 'private' | 'restricted';

export type EvidenceKind =
  | 'merged_pr'
  | 'live_deployment'
  | 'published_artifact'
  | 'confirmed_action'
  | 'test_run'
  | 'custom';

/** Matches the p_proposal jsonb shape persist_route_owner()/persist_route_atomic() expect. */
export interface RouteProposal {
  workspace_id: string;
  idempotency_key: string;
  intent: string;
  task_type: string;
  execution_lane: ExecutionLane;
  selected_agent: string;
  repository: string;
  repository_path?: string | null;
  risk: RouteRisk;
  sensitivity: RouteSensitivity;
  required_evidence: string;
  rationale: string;
  confidence: number;
  route_source: 'model' | 'doctrine_fallback' | 'user';
  evidence_kind: EvidenceKind;
}

export interface RoutedRequestRecord {
  id: string;
  workspace_id: string;
  intent: string;
  execution_lane: ExecutionLane;
  repository: string;
  status: string;
  created_at: string;
}

export interface PersistRouteResult {
  routedRequest: RoutedRequestRecord;
  eventLogged: boolean;
  replayed: boolean;
}
