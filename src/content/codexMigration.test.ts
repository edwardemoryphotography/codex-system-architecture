import { describe, expect, it } from 'vitest';

import migration from '../../supabase/migrations/20260714112315_replace_simulated_codex_content.sql?raw';

describe('Codex reality repair migration', () => {
  it('updates all canonical document paths and aborts on a partial match', () => {
    expect(migration.match(/"path":"\/codex/g)).toHaveLength(59);
    expect(migration).toContain('expected_count integer := 59');
    expect(migration).toContain('if matched_count <> expected_count then');
    expect(migration).toContain('if updated_count <> expected_count then');
  });

  it('contains the verified gear and none of the known false camera ownership', () => {
    expect(migration).toContain('Sony A7 III');
    expect(migration).toContain('Sony RX10 IV');
    expect(migration).not.toContain('Sony A7R IV');
    expect(migration).not.toContain('Sony A7S III');
  });
});
