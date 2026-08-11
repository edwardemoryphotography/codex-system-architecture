-- Cover the canonical document hierarchy foreign key used by tree navigation.
create index if not exists codex_documents_parent_id_idx
  on public.codex_documents(parent_id);
