/**
 * Automated Edition Manager — live ingest (Vercel serverless).
 * Uses Supabase env vars configured on Vercel (not in the client bundle).
 */
import { createClient } from '@supabase/supabase-js';

// VITE_SUPABASE_URL has been seen set to the dashboard page
// (https://supabase.com/dashboard/project/<ref>) instead of the API URL,
// which silently breaks every insert. Derive the real endpoint from the ref.
function normalizeSupabaseUrl(url) {
  if (!url) return url;
  const dashboard = url.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);
  return dashboard ? `https://${dashboard[1].toLowerCase()}.supabase.co` : url;
}

function getSupabase() {
  const url = normalizeSupabaseUrl(process.env.VITE_SUPABASE_URL);
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ error: 'GET or POST only' });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(503).json({
      error: 'Supabase not configured on Vercel',
      hint: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Vercel project',
    });
  }

  // GET = health check: confirms env vars resolve and the table is reachable,
  // without writing anything. Checkable from a phone browser.
  if (req.method === 'GET') {
    const { error } = await supabase
      .from('edition_manager_events')
      .select('id')
      .limit(1);
    if (error) {
      return res.status(503).json({ ok: false, configured: true, error: error.message, code: error.code });
    }
    return res.status(200).json({ ok: true, configured: true, reachable: true });
  }

  const body = req.body ?? {};
  const row = {
    event_type: body.event_type ?? 'abandoned_checkout',
    customer_email: body.customer_email ?? null,
    cart_total_cents: body.cart_total_cents ?? null,
    edition_title: body.edition_title ?? null,
    payload: body.payload ?? {},
    source: body.source ?? 'print-sales-auto-agent',
  };

  const { data, error } = await supabase
    .from('edition_manager_events')
    .insert(row)
    .select();

  if (error) {
    const missingTable =
      error.code === '42P01' ||
      (error.message && error.message.includes('edition_manager_events'));
    return res.status(missingTable ? 503 : 400).json({
      error: error.message,
      code: error.code,
      hint: missingTable
        ? 'Run supabase/migrations/20260520140000_edition_manager_events.sql on supabase-indigo-paddle'
        : undefined,
    });
  }

  return res.status(200).json({ ok: true, data });
}
