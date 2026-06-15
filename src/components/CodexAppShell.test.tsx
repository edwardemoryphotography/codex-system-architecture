import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CodexAppShell } from './CodexAppShell';

vi.mock('../lib/supabase', () => ({
  getDocuments: vi.fn().mockResolvedValue([]),
  getRecentDocuments: vi.fn().mockResolvedValue([]),
  isSupabaseConfigured: false,
}));

describe('CodexAppShell', () => {
  it('links to the cognition deck', () => {
    render(<CodexAppShell />);

    expect(screen.getByRole('link', { name: /cognition deck/i })).toHaveAttribute(
      'href',
      '/cognition',
    );
  });
});
