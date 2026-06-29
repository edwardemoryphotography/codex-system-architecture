import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, afterEach } from 'vitest';

import { CodexAppShell } from './CodexAppShell';

vi.mock('../lib/supabase', () => ({
  getDocuments: vi.fn().mockResolvedValue([]),
  getRecentDocuments: vi.fn().mockResolvedValue([]),
  getTags: vi.fn().mockResolvedValue([]),
  isSupabaseConfigured: false,
}));

function mockMobileLayout(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)' ? matches : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

describe('CodexAppShell', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('links to the cognition deck', () => {
    mockMobileLayout(false);
    render(<CodexAppShell />);

    expect(screen.getByRole('link', { name: /cognition deck/i })).toHaveAttribute(
      'href',
      '/cognition',
    );
  });

  it('shows a mobile navigation header on small screens', async () => {
    mockMobileLayout(true);
    const user = userEvent.setup();

    render(<CodexAppShell />);

    expect(screen.getByRole('button', { name: /open navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open search/i })).toBeInTheDocument();
    expect(screen.getByText('Cmd+K')).toHaveClass('hidden');

    await user.click(screen.getByRole('button', { name: /open navigation/i }));

    expect(screen.getAllByRole('button', { name: /close navigation/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /cognition deck/i })).toBeInTheDocument();
  });
});
