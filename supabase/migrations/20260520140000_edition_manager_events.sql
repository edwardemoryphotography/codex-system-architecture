/*
  Automated Edition Manager — minimum shippable ingest endpoint (Supabase REST).
  Print Sales Auto Agent POSTs rows to /rest/v1/edition_manager_events
*/

CREATE TABLE IF NOT EXISTS edition_manager_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  customer_email text,
  cart_total_cents integer,
  edition_title text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'print-sales-auto-agent',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT edition_manager_events_type_check CHECK (
    event_type IN ('abandoned_checkout', 'sale', 'waitlist', 'inventory_lock')
  )
);

CREATE INDEX IF NOT EXISTS idx_edition_manager_events_created
  ON edition_manager_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_edition_manager_events_type
  ON edition_manager_events (event_type);

ALTER TABLE edition_manager_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read edition_manager_events" ON edition_manager_events;
DROP POLICY IF EXISTS "Public can insert edition_manager_events" ON edition_manager_events;

CREATE POLICY "Public can read edition_manager_events"
  ON edition_manager_events FOR SELECT TO public USING (true);

CREATE POLICY "Public can insert edition_manager_events"
  ON edition_manager_events FOR INSERT TO public WITH CHECK (true);
