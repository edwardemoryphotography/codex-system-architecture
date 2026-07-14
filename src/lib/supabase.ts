import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { corpusToDocuments, isLeanDocumentSet } from '../content/codexCorpus';
import type { CodexAction, CodexDocument, SessionMode } from '../types';

// VITE_SUPABASE_URL has been seen set to the dashboard page
// (https://supabase.com/dashboard/project/<ref>) instead of the API URL,
// which silently breaks every query. Derive the real endpoint from the ref.
export function normalizeSupabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  const dashboard = url.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);
  return dashboard ? `https://${dashboard[1].toLowerCase()}.supabase.co` : url;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Normalize lean/partial schemas (missing path/parent_id) into CodexDocument shape. */
export function normalizeDocument(row: Record<string, unknown>): CodexDocument {
  const id = String(row.id ?? '');
  const title = String(row.title ?? 'Untitled');
  const category = String(row.category ?? 'root');
  const existingPath = typeof row.path === 'string' && row.path.length > 0 ? row.path : null;

  return {
    id,
    title,
    path: existingPath ?? `/${category}/${slugify(title) || id.slice(0, 8)}`,
    content: String(row.content ?? ''),
    category,
    parent_id: (row.parent_id as string | null | undefined) ?? null,
    order: typeof row.order === 'number' ? row.order : 0,
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: String(row.updated_at ?? row.created_at ?? new Date().toISOString()),
  };
}

/** Keep live row identity and relationships while making reviewed corpus copy authoritative. */
export function mergeCanonicalDocument(
  live: CodexDocument,
  canonical: CodexDocument,
): CodexDocument {
  return {
    ...live,
    title: canonical.title,
    content: canonical.content,
    category: canonical.category,
    order: canonical.order,
  };
}

function mergeLiveDocumentsWithCorpus(liveDocs: CodexDocument[]): CodexDocument[] {
  const canonicalDocs = corpusToDocuments();
  const liveByPath = new Map(liveDocs.map((document) => [document.path, document]));
  const canonicalPaths = new Set(canonicalDocs.map((document) => document.path));

  const mergedCanonical = canonicalDocs.map((canonical) => {
    const live = liveByPath.get(canonical.path);
    return live ? mergeCanonicalDocument(live, canonical) : canonical;
  });
  const nonCorpusDocuments = liveDocs.filter((document) => !canonicalPaths.has(document.path));

  return [...mergedCanonical, ...nonCorpusDocuments];
}

function isMissingRelationError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === 'PGRST205' || /could not find the table/i.test(error.message ?? '');
}

function isMissingColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === '42703' || /column .* does not exist/i.test(error.message ?? '');
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string | undefined);
// Prefer the legacy anon key; fall back to the newer publishable key name from
// Supabase dashboard "Connect" snippets (Vite apps still use createClient).
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

function client(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY).',
    );
  }
  return supabase;
}

async function fetchLiveDocuments(): Promise<CodexDocument[]> {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('codex_documents')
    .select('*')
    .order('category', { ascending: true })
    .order('order', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => normalizeDocument(row as Record<string, unknown>));
}

export async function getDocuments() {
  if (!supabase) {
    return corpusToDocuments();
  }

  try {
    const liveDocs = await fetchLiveDocuments();
    if (isLeanDocumentSet(liveDocs)) {
      return corpusToDocuments();
    }
    return mergeLiveDocumentsWithCorpus(liveDocs);
  } catch {
    return corpusToDocuments();
  }
}

export async function getDocumentByPath(path: string) {
  const corpusDocs = corpusToDocuments();
  const corpusMatch = corpusDocs.find((doc) => doc.path === path) ?? null;

  if (!supabase) {
    return corpusMatch;
  }

  const byPath = await client()
    .from('codex_documents')
    .select(`
      *,
      codex_document_tags (
        codex_tags (*)
      )
    `)
    .eq('path', path)
    .maybeSingle();

  if (!byPath.error && byPath.data) {
    const liveDocument = normalizeDocument(byPath.data as Record<string, unknown>);
    return corpusMatch ? mergeCanonicalDocument(liveDocument, corpusMatch) : liveDocument;
  }

  // Lean schemas may omit `path` / tag joins — fall back to id lookup.
  const idMatch = path.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
  const candidateId = idMatch?.[0] ?? (path.includes('/') ? null : path);

  if (candidateId) {
    const byId = await client()
      .from('codex_documents')
      .select('*')
      .eq('id', candidateId)
      .maybeSingle();

    if (!byId.error && byId.data) {
      const liveDocument = normalizeDocument(byId.data as Record<string, unknown>);
      return corpusMatch ? mergeCanonicalDocument(liveDocument, corpusMatch) : liveDocument;
    }
  }

  if (corpusMatch) {
    return corpusMatch;
  }

  // Final fallback: load all and match synthesized path (small datasets only).
  if (isMissingColumnError(byPath.error) || isMissingRelationError(byPath.error) || !byPath.data) {
    const docs = await getDocuments();
    return docs.find((doc) => doc.path === path) ?? null;
  }

  if (byPath.error) throw byPath.error;
  return null;
}

export async function searchDocuments(query: string) {
  const docs = await getDocuments();
  const needle = query.trim().toLowerCase();
  if (!needle) return docs;
  return docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(needle) ||
      doc.content.toLowerCase().includes(needle) ||
      doc.path.toLowerCase().includes(needle),
  );
}

export async function getDocumentsByCategory(category: string) {
  const docs = await getDocuments();
  return docs
    .filter((doc) => doc.category === category)
    .sort((a, b) => a.order - b.order);
}

export async function getTags() {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('codex_tags')
    .select('*')
    .order('name', { ascending: true });

  if (isMissingRelationError(error)) return [];
  if (error) throw error;
  return data;
}

export async function getRecentDocuments(limit = 10) {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('reading_progress')
    .select(`
      *,
      codex_documents (*)
    `)
    .order('last_read_at', { ascending: false })
    .limit(limit);

  if (isMissingRelationError(error)) return [];
  if (error) throw error;
  return (data ?? []).map((row) => {
    const doc = row.codex_documents
      ? normalizeDocument(row.codex_documents as Record<string, unknown>)
      : null;
    return { ...row, codex_documents: doc };
  });
}

export async function updateReadingProgress(documentId: string, scrollPosition: number, timeSpent: number) {
  if (!supabase) return null;
  const { data, error } = await client()
    .from('reading_progress')
    .upsert({
      document_id: documentId,
      scroll_position: scrollPosition,
      time_spent_seconds: timeSpent,
      last_read_at: new Date().toISOString(),
      completed: scrollPosition > 90
    }, { onConflict: 'document_id' })
    .select()
    .maybeSingle();

  if (isMissingRelationError(error)) return null;
  if (error) throw error;
  return data;
}

export async function getReadingProgress(documentId: string) {
  if (!supabase) return null;
  const { data, error } = await client()
    .from('reading_progress')
    .select('*')
    .eq('document_id', documentId)
    .maybeSingle();

  if (isMissingRelationError(error)) return null;
  if (error) throw error;
  return data;
}

export async function getBookmarks() {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('bookmarks')
    .select(`
      *,
      codex_documents (*)
    `)
    .order('created_at', { ascending: false });

  if (isMissingRelationError(error)) return [];
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...row,
    codex_documents: row.codex_documents
      ? normalizeDocument(row.codex_documents as Record<string, unknown>)
      : null,
  }));
}

export async function addBookmark(documentId: string) {
  if (!supabase) return null;
  const { data, error } = await client()
    .from('bookmarks')
    .insert({ document_id: documentId })
    .select()
    .maybeSingle();

  if (isMissingRelationError(error)) return null;
  if (error) throw error;
  return data;
}

export async function removeBookmark(documentId: string) {
  if (!supabase) return;
  const { error } = await client()
    .from('bookmarks')
    .delete()
    .eq('document_id', documentId);

  if (isMissingRelationError(error)) return;
  if (error) throw error;
}

export async function isBookmarked(documentId: string) {
  if (!supabase) return false;
  const { data, error } = await client()
    .from('bookmarks')
    .select('id')
    .eq('document_id', documentId)
    .maybeSingle();

  if (isMissingRelationError(error)) return false;
  if (error) throw error;
  return !!data;
}

export async function getDocumentNotes(documentId: string) {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('document_notes')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false });

  if (isMissingRelationError(error)) return [];
  if (error) throw error;
  return data;
}

export async function addDocumentNote(documentId: string, content: string, position?: string) {
  if (!supabase) return null;
  const { data, error } = await client()
    .from('document_notes')
    .insert({ document_id: documentId, content, position })
    .select()
    .maybeSingle();

  if (isMissingRelationError(error)) return null;
  if (error) throw error;
  return data;
}

export async function deleteDocumentNote(noteId: string) {
  if (!supabase) return;
  const { error } = await client()
    .from('document_notes')
    .delete()
    .eq('id', noteId);

  if (isMissingRelationError(error)) return;
  if (error) throw error;
}

export async function getDocumentLinks() {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('document_links')
    .select(`
      *,
      source:codex_documents!source_document_id (*),
      target:codex_documents!target_document_id (*)
    `);

  if (isMissingRelationError(error)) return [];
  if (error) throw error;
  return data;
}

export async function addDocumentLink(sourceId: string, targetId: string, linkType = 'reference') {
  if (!supabase) return null;
  const { data, error } = await client()
    .from('document_links')
    .insert({ source_document_id: sourceId, target_document_id: targetId, link_type: linkType })
    .select()
    .maybeSingle();

  if (isMissingRelationError(error)) return null;
  if (error) throw error;
  return data;
}

export async function getActions() {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('actions')
    .select('*')
    .order('priority_weight', { ascending: false });

  if (error) throw error;
  return (data ?? []) as CodexAction[];
}

export async function initializeSessionStart(sessionMode: SessionMode = 'high') {
  if (!supabase) return [];
  const { data, error } = await client().rpc('initialize_session_start', {
    session_mode: sessionMode,
  });

  if (error) throw error;
  return (data ?? []) as CodexAction[];
}
