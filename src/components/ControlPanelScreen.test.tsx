import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ControlPanelScreen } from './ControlPanelScreen';
import { ToastProvider } from './Toast';

vi.mock('../lib/supabase', () => ({
  initializeSessionStart: vi.fn().mockResolvedValue([]),
  isSupabaseConfigured: false,
  ROUTING_OWNER_EMAIL: 'freddyv@duck.com',
  getSession: vi.fn().mockResolvedValue(null),
  getWorkspaces: vi.fn().mockResolvedValue([]),
  onAuthStateChange: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
  signInOwnerWithMagicLink: vi.fn().mockResolvedValue(undefined),
  persistRouteOwner: vi.fn(),
}));

function renderControlPanel() {
  return render(
    <ToastProvider isDarkMode>
      <ControlPanelScreen isDarkMode />
    </ToastProvider>,
  );
}

describe('ControlPanelScreen', () => {
  it('renders the mobile-first control panel copy and actions', () => {
    renderControlPanel();

    expect(screen.getByRole('heading', { name: /what needs to move/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/what needs to move forward/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /route task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fast execute here/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute now/i })).toBeInTheDocument();
  });

  it('requires a repository and evidence answer before a route can be submitted', () => {
    renderControlPanel();

    expect(screen.getByRole('button', { name: /route task/i })).toBeDisabled();
    expect(screen.getByPlaceholderText(/codex-system-architecture/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/pr link, deployed url/i)).toBeInTheDocument();
  });

  it('does not show the owner sign-in prompt when Supabase is not configured', () => {
    renderControlPanel();

    expect(screen.queryByRole('button', { name: /^sign in$/i })).not.toBeInTheDocument();
  });
});
