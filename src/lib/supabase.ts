import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

function client(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

export async function getDocuments() {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('codex_documents')
    .select('*')
    .order('category', { ascending: true })
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getDocumentByPath(path: string) {
  if (!supabase) return null;
  const { data, error } = await client()
    .from('codex_documents')
    .select(`
      *,
      codex_document_tags (
        codex_tags (*)
      )
    `)
    .eq('path', path)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function searchDocuments(query: string) {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('codex_documents')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getDocumentsByCategory(category: string) {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('codex_documents')
    .select('*')
    .eq('category', category)
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getTags() {
  if (!supabase) return [];
  const { data, error } = await client()
    .from('codex_tags')
    .select('*')
    .order('name', { ascending: true });

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

  if (error) throw error;
  return data;
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

  if (error) throw error;
  return data;
}

export async function addBookmark(documentId: string) {
  if (!supabase) return null;
  const { data, error } = await client()
    .from('bookmarks')
    .insert({ document_id: documentId })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function removeBookmark(documentId: string) {
  if (!supabase) return;
  const { error } = await client()
    .from('bookmarks')
    .delete()
    .eq('document_id', documentId);

  if (error) throw error;
}

export async function isBookmarked(documentId: string) {
  if (!supabase) return false;
  const { data, error } = await client()
    .from('bookmarks')
    .select('id')
    .eq('document_id', documentId)
    .maybeSingle();

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

  if (error) throw error;
  return data;
}

export async function deleteDocumentNote(noteId: string) {
  if (!supabase) return;
  const { error } = await client()
    .from('document_notes')
    .delete()
    .eq('id', noteId);

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

  if (error) throw error;
  return data;
}
