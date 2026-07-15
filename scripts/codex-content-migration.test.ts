import { describe, expect, it } from 'vitest';

import {
  extractMarkdownTitle,
  renderCodexContentMigration,
} from './codex-content-migration.mjs';

describe('Codex content migration generator', () => {
  it('extracts an H1 without retaining CRLF carriage returns', () => {
    expect(extractMarkdownTitle('# Verified Gear\r\n\r\nBody')).toBe('Verified Gear');
  });

  it('uses SQL-safe quoting even when content contains the old dollar delimiter', () => {
    const sql = renderCodexContentMigration([
      {
        path: '/codex/test',
        title: "Eddie's test",
        content: 'Literal $codex$ text and Eddie\'s verified note',
        provenance_status: ['verified'],
        evidence_basis: "Eddie's confirmation",
        last_reviewed: '2026-07-15',
      },
    ]);

    expect(sql).not.toContain('canonical_documents jsonb := $codex$');
    expect(sql).toContain("Eddie''s test");
    expect(sql).toContain('$codex$ text');
  });

  it('requires provenance for canonical paths without mutating unrelated legacy rows', () => {
    const sql = renderCodexContentMigration([
      {
        path: '/codex/test',
        title: 'Test',
        content: '# Test',
        category: 'systems',
        document_order: 0,
        provenance_status: ['repository_evidence'],
        evidence_basis: 'Repository document',
        last_reviewed: '2026-07-15',
        is_read_only: true,
      },
    ]);

    expect(sql).not.toContain('alter column path set not null');
    expect(sql).toContain('codex_documents_canonical_provenance_complete');
    expect(sql).toContain('path is null');
  });
});
