#!/usr/bin/env node
/**
 * Local Automated Edition Manager (ship-ugly fallback when Vercel has no Supabase env).
 * POST http://127.0.0.1:3999/ingest
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(
  __dirname,
  '..',
  'automated-edition-manager',
  'data',
  'events.jsonl',
);
const PORT = Number(process.env.EDITION_MANAGER_PORT || 3999);

function ensureDir() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }
  if (req.method !== 'POST' || req.url !== '/ingest') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'POST /ingest only' }));
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  const row = {
    id: crypto.randomUUID(),
    received_at: new Date().toISOString(),
    ...body,
  };
  ensureDir();
  fs.appendFileSync(DATA_FILE, `${JSON.stringify(row)}\n`, 'utf8');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, data: [row] }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Edition Manager local ingest http://127.0.0.1:${PORT}/ingest`);
});
