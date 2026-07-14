import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import ts from 'typescript';

const migrationPath = process.argv[2];
if (!migrationPath) {
  throw new Error('Usage: node scripts/generate-codex-content-migration.mjs <migration-file>');
}

const source = await readFile('src/content/codexDocumentBodies.ts', 'utf8');
const javascript = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`;
const { CODEX_DOCUMENT_BODIES } = await import(moduleUrl);

const payload = Object.entries(CODEX_DOCUMENT_BODIES).map(([path, content]) => {
  const title = content.match(/^# (.+)$/m)?.[1];
  if (!title) throw new Error(`Missing H1 title for ${path}`);
  return { path, title, content };
});

const sql = `-- Generated from src/content/codexDocumentBodies.ts.
-- Repairs stored public copy; IDs, hierarchy, tags, links, bookmarks, and notes are unchanged.
do $migration$
declare
  canonical_documents jsonb := $codex$${JSON.stringify(payload)}$codex$::jsonb;
  expected_count integer := ${payload.length};
  matched_count integer;
  updated_count integer;
begin
  select count(*)
  into matched_count
  from public.codex_documents as document
  join jsonb_to_recordset(canonical_documents) as canonical(path text, title text, content text)
    on canonical.path = document.path;

  if matched_count <> expected_count then
    raise exception 'Codex reality repair aborted: expected % document paths, found %',
      expected_count,
      matched_count;
  end if;

  update public.codex_documents as document
  set
    title = canonical.title,
    content = canonical.content,
    updated_at = now()
  from jsonb_to_recordset(canonical_documents) as canonical(path text, title text, content text)
  where document.path = canonical.path;

  get diagnostics updated_count = row_count;
  if updated_count <> expected_count then
    raise exception 'Codex reality repair rolled back: expected % updates, applied %',
      expected_count,
      updated_count;
  end if;
end
$migration$;
`;

await writeFile(migrationPath, sql);
console.log(`Wrote ${payload.length} canonical documents to ${migrationPath}`);
