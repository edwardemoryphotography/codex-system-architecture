import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getDocuments() {
  const { data, error } = await supabase
    .from('codex_documents')
    .select('*')
    .order('category', { ascending: true })
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getDocumentByPath(path: string) {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('codex_documents')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getDocumentsByCategory(category: string) {
  const { data, error } = await supabase
    .from('codex_documents')
    .select('*')
    .eq('category', category)
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getTags() {
  const { data, error } = await supabase
    .from('codex_tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getRecentDocuments(limit = 10) {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('document_id', documentId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBookmarks() {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ document_id: documentId })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function removeBookmark(documentId: string) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('document_id', documentId);

  if (error) throw error;
}

export async function isBookmarked(documentId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('document_id', documentId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function getDocumentNotes(documentId: string) {
  const { data, error } = await supabase
    .from('document_notes')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addDocumentNote(documentId: string, content: string, position?: string) {
  const { data, error } = await supabase
    .from('document_notes')
    .insert({ document_id: documentId, content, position })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteDocumentNote(noteId: string) {
  const { error } = await supabase
    .from('document_notes')
    .delete()
    .eq('id', noteId);

  if (error) throw error;
}

export async function getDocumentLinks() {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('document_links')
    .insert({ source_document_id: sourceId, target_document_id: targetId, link_type: linkType })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
