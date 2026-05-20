/*
  # Unified schema: Control Panel actions + session start

  Same database as codex_documents (Tier 4 knowledge + execution).
  Idempotent: safe if actions table / function already exist on supabase-indigo-paddle.
*/

CREATE TABLE IF NOT EXISTS actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_title text NOT NULL,
  status text NOT NULL DEFAULT 'TODO',
  context_complexity text,
  portfolio_segment text,
  priority_weight numeric NOT NULL DEFAULT 0,
  is_next_action boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT actions_status_check CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE'))
);

CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_next ON actions(is_next_action) WHERE is_next_action = true;
CREATE INDEX IF NOT EXISTS idx_actions_priority ON actions(priority_weight DESC);

ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read actions" ON actions;
DROP POLICY IF EXISTS "Public can insert actions" ON actions;
DROP POLICY IF EXISTS "Public can update actions" ON actions;
DROP POLICY IF EXISTS "Public can delete actions" ON actions;

CREATE POLICY "Public can read actions"
  ON actions FOR SELECT TO public USING (true);

CREATE POLICY "Public can insert actions"
  ON actions FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Public can update actions"
  ON actions FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Public can delete actions"
  ON actions FOR DELETE TO public USING (true);

CREATE OR REPLACE FUNCTION initialize_session_start(session_mode text DEFAULT 'high')
RETURNS SETOF actions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  picked_id uuid;
BEGIN
  UPDATE actions SET is_next_action = false WHERE is_next_action = true;

  RETURN QUERY
  SELECT a.*
  FROM actions a
  WHERE a.status = 'TODO'
    AND (
      session_mode NOT IN ('high', 'low')
      OR (
        session_mode = 'high'
        AND COALESCE(a.context_complexity, 'medium') IN ('high', 'medium')
      )
      OR (
        session_mode = 'low'
        AND COALESCE(a.context_complexity, 'medium') IN ('low', 'medium')
      )
    )
  ORDER BY a.priority_weight DESC, a.created_at ASC
  LIMIT 10;

  SELECT a.id INTO picked_id
  FROM actions a
  WHERE a.status = 'TODO'
    AND (
      session_mode NOT IN ('high', 'low')
      OR (
        session_mode = 'high'
        AND COALESCE(a.context_complexity, 'medium') IN ('high', 'medium')
      )
      OR (
        session_mode = 'low'
        AND COALESCE(a.context_complexity, 'medium') IN ('low', 'medium')
      )
    )
  ORDER BY a.priority_weight DESC, a.created_at ASC
  LIMIT 1;

  IF picked_id IS NOT NULL THEN
    UPDATE actions SET is_next_action = true WHERE id = picked_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION initialize_session_start(text) TO anon, authenticated, service_role;

INSERT INTO actions (action_title, status, context_complexity, portfolio_segment, priority_weight)
SELECT v.action_title, v.status, v.context_complexity, v.portfolio_segment, v.priority_weight
FROM (
  VALUES
    ('Wire Route Task to initialize_session_start', 'TODO', 'high', 'codex-system-architecture', 95),
    ('Add VITE_SUPABASE_* to Vercel production', 'TODO', 'high', 'codex-system-architecture', 90),
    ('Control Panel Screen 2 — classifier routing', 'TODO', 'high', 'legacy-codex', 85),
    ('Audit notion-wiki ingest on new deploy', 'TODO', 'low', 'notion-wiki', 40),
    ('Refresh Brain Dump Map links in repo README', 'TODO', 'low', 'documentation', 25)
) AS v(action_title, status, context_complexity, portfolio_segment, priority_weight)
WHERE NOT EXISTS (SELECT 1 FROM actions LIMIT 1);
