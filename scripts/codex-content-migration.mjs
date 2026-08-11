export function extractMarkdownTitle(content) {
  return content.match(/^# ([^\r\n]+)/m)?.[1] ?? null;
}

function escapeSqlLiteral(value) {
  return value.replace(/'/g, "''");
}

export function renderCodexContentMigration(payload) {
  const canonicalJson = escapeSqlLiteral(JSON.stringify(payload));

  return `-- Generated from the canonical Codex corpus.
-- Upserts the 59 reviewed public documents and adds machine-readable provenance.
alter table public.codex_documents
  add column if not exists path text,
  add column if not exists category text,
  add column if not exists parent_id uuid,
  add column if not exists "order" integer default 0,
  add column if not exists provenance_status text[],
  add column if not exists evidence_basis text,
  add column if not exists last_reviewed date,
  add column if not exists is_read_only boolean default true;

create unique index if not exists codex_documents_path_unique
  on public.codex_documents(path);

create index if not exists codex_documents_parent_id_idx
  on public.codex_documents(parent_id);

do $migration$
declare
  canonical_documents jsonb := '${canonicalJson}'::jsonb;
  expected_count integer := ${payload.length};
  stored_count integer;
  changed_count integer;
begin
  insert into public.codex_documents (
    title,
    path,
    content,
    category,
    "order",
    provenance_status,
    evidence_basis,
    last_reviewed,
    is_read_only,
    updated_at
  )
  select
    canonical.title,
    canonical.path,
    canonical.content,
    canonical.category,
    canonical.document_order,
    array(select jsonb_array_elements_text(canonical.provenance_status)),
    canonical.evidence_basis,
    canonical.last_reviewed,
    canonical.is_read_only,
    now()
  from jsonb_to_recordset(canonical_documents) as canonical(
    path text,
    title text,
    content text,
    category text,
    parent_path text,
    document_order integer,
    provenance_status jsonb,
    evidence_basis text,
    last_reviewed date,
    is_read_only boolean
  )
  on conflict (path) do update
  set
    title = excluded.title,
    content = excluded.content,
    category = excluded.category,
    "order" = excluded."order",
    provenance_status = excluded.provenance_status,
    evidence_basis = excluded.evidence_basis,
    last_reviewed = excluded.last_reviewed,
    is_read_only = excluded.is_read_only,
    updated_at = now();

  get diagnostics changed_count = row_count;
  if changed_count <> expected_count then
    raise exception 'Codex reality repair rolled back: expected % upserts, applied %',
      expected_count,
      changed_count;
  end if;

  update public.codex_documents as child
  set parent_id = parent.id
  from jsonb_to_recordset(canonical_documents) as canonical(path text, parent_path text)
  left join public.codex_documents as parent on parent.path = canonical.parent_path
  where child.path = canonical.path;

  select count(*)
  into stored_count
  from public.codex_documents as document
  join jsonb_to_recordset(canonical_documents) as canonical(path text)
    on canonical.path = document.path
  where document.provenance_status is not null
    and cardinality(document.provenance_status) > 0
    and document.evidence_basis is not null
    and document.last_reviewed is not null;

  if stored_count <> expected_count then
    raise exception 'Codex provenance verification failed: expected % complete rows, found %',
      expected_count,
      stored_count;
  end if;
end
$migration$;

do $constraint$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'codex_documents_provenance_status_allowed'
      and conrelid = 'public.codex_documents'::regclass
  ) then
    alter table public.codex_documents
      add constraint codex_documents_provenance_status_allowed
      check (
        provenance_status is null
        or (
          cardinality(provenance_status) > 0
          and provenance_status <@ array[
            'verified',
            'repository_evidence',
            'concept',
            'unknown'
          ]::text[]
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'codex_documents_canonical_provenance_complete'
      and conrelid = 'public.codex_documents'::regclass
  ) then
    alter table public.codex_documents
      add constraint codex_documents_canonical_provenance_complete
      check (
        path is null
        or (
          content is not null
          and category is not null
          and provenance_status is not null
          and cardinality(provenance_status) > 0
          and evidence_basis is not null
          and last_reviewed is not null
          and is_read_only is not null
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'codex_documents_parent_id_fkey'
      and conrelid = 'public.codex_documents'::regclass
  ) then
    alter table public.codex_documents
      add constraint codex_documents_parent_id_fkey
      foreign key (parent_id) references public.codex_documents(id) on delete set null;
  end if;
end
$constraint$;
`;
}
