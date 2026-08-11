import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import ts from 'typescript';

import {
  extractMarkdownTitle,
  renderCodexContentMigration,
} from './codex-content-migration.mjs';

const migrationPath = process.argv[2];
if (!migrationPath) {
  throw new Error('Usage: node scripts/generate-codex-content-migration.mjs <migration-file>');
}

const documentBodiesSource = await readFile('src/content/codexDocumentBodies.ts', 'utf8');
const corpusSource = await readFile('src/content/codexCorpus.ts', 'utf8');
const source = `${documentBodiesSource}\n${corpusSource.replace(/^import .*;$/gm, '')}`;
const javascript = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`;
const { CODEX_DOCUMENT_BODIES, CORPUS_DOCUMENTS, getCodexDocumentProvenance } = await import(moduleUrl);

const payload = CORPUS_DOCUMENTS.map((document) => {
  const { path, category, parentPath: parent_path, order: document_order } = document;
  const content = CODEX_DOCUMENT_BODIES[path];
  if (!content) throw new Error(`Missing canonical body for ${path}`);
  const title = extractMarkdownTitle(content);
  if (!title) throw new Error(`Missing H1 title for ${path}`);
  return {
    path,
    title,
    content,
    category,
    parent_path,
    document_order,
    is_read_only: true,
    ...getCodexDocumentProvenance(path),
  };
});

const sql = renderCodexContentMigration(payload);

await writeFile(migrationPath, sql);
console.log(`Wrote ${payload.length} canonical documents to ${migrationPath}`);
