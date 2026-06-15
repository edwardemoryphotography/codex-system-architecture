/**
 * One-shot: apply edition_manager_events migration when POSTGRES_URL is on Vercel.
 * POST /api/apply-edition-migration (no body).
 */
import pg from 'pg';

const { Pool } = pg;

const SQL = `
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
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const connectionString =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    return res.status(503).json({
      error: 'No POSTGRES_URL on Vercel',
      hint: 'Link Supabase integration or run migration SQL in dashboard',
    });
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await pool.query(SQL);
    return res.status(200).json({ ok: true, message: 'edition_manager_events ready' });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  } finally {
    await pool.end();
  }
}
