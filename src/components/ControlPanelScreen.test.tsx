import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ControlPanelScreen } from './ControlPanelScreen';
import { ToastProvider } from './Toast';

const mocks = vi.hoisted(() => ({
  isSupabaseConfigured: false,
  session: null as { user: { email: string } } | null,
  workspaces: [] as Array<{ id: string; name: string }>,
  persistRouteOwner: vi.fn(),
}));

vi.mock('../lib/supabase', () => ({
  initializeSessionStart: vi.fn().mockResolvedValue([]),
  get isSupabaseConfigured() {
    return mocks.isSupabaseConfigured;
  },
  ROUTING_OWNER_EMAIL: 'freddyv@duck.com',
  getSession: vi.fn().mockImplementation(() => Promise.resolve(mocks.session)),
  getWorkspaces: vi.fn().mockImplementation(() => Promise.resolve(mocks.workspaces)),
  onAuthStateChange: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
  signInOwnerWithMagicLink: vi.fn().mockResolvedValue(undefined),
  persistRouteOwner: mocks.persistRouteOwner,
}));

vi.mock('../lib/auth', () => ({
  storeUser: vi.fn().mockResolvedValue('user-id'),
  getCurrentUser: vi.fn(),
  getCurrentUserOrNull: vi.fn().mockResolvedValue(null),
  requireOwner: vi.fn(),
}));

function renderControlPanel() {
  return render(
    <ToastProvider isDarkMode>
      <ControlPanelScreen isDarkMode />
    </ToastProvider>,
  );
}

async function fillRouteForm() {
  fireEvent.change(screen.getByPlaceholderText(/what needs to move forward/i), {
    target: { value: 'Ship the retry fix' },
  });
  fireEvent.click(screen.getByRole('button', { name: /execute now/i }));
  fireEvent.change(screen.getByPlaceholderText(/codex-system-architecture/i), {
    target: { value: 'codex-system-architecture' },
  });
  fireEvent.change(screen.getByPlaceholderText(/pr link, deployed url/i), {
    target: { value: 'PR #42' },
  });
  await waitFor(() => expect(screen.getByRole('button', { name: /route task/i })).toBeEnabled());
}

describe('ControlPanelScreen', () => {
  afterEach(() => {
    mocks.isSupabaseConfigured = false;
    mocks.session = null;
    mocks.workspaces = [];
    mocks.persistRouteOwner.mockReset();
  });

  it('renders the mobile-first control panel copy and actions', () => {
    renderControlPanel();

    expect(screen.getByRole('heading', { name: /what needs to move/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/what needs to move forward/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /route task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fast execute here/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute now/i })).toBeInTheDocument();
  });

  it('exposes graph and launch actions when callbacks are provided', () => {
    const onSelectDocument = vi.fn();
    const onOpenGraph = vi.fn();

    render(
      <ToastProvider isDarkMode>
        <ControlPanelScreen
          isDarkMode
          onSelectDocument={onSelectDocument}
          onOpenGraph={onOpenGraph}
        />
      </ToastProvider>,
    );

    expect(screen.getByText(/launch pads/i)).toBeInTheDocument();
    screen.getByRole('button', { name: /open graph/i }).click();
    expect(onOpenGraph).toHaveBeenCalledTimes(1);

    screen.getByRole('button', { name: /personal os/i }).click();
    expect(onSelectDocument).toHaveBeenCalledWith('/codex/personal_os');
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

  it('reuses the same idempotency key on retry after a failed route, and rotates it after success', async () => {
    mocks.isSupabaseConfigured = true;
    mocks.session = { user: { email: 'freddyv@duck.com' } };
    mocks.workspaces = [{ id: 'ws-1', name: 'Test workspace' }];
    mocks.persistRouteOwner
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({
        replayed: false,
        routedRequest: { execution_lane: 'execution', repository: 'codex-system-architecture', status: 'queued' },
      });

    renderControlPanel();
    await fillRouteForm();

    fireEvent.click(screen.getByRole('button', { name: /route task/i }));
    await waitFor(() => expect(mocks.persistRouteOwner).toHaveBeenCalledTimes(1));

    // Retry after the ambiguous failure without editing the draft.
    fireEvent.click(screen.getByRole('button', { name: /route task/i }));
    await waitFor(() => expect(mocks.persistRouteOwner).toHaveBeenCalledTimes(2));

    const [firstCall, secondCall] = mocks.persistRouteOwner.mock.calls;
    expect(secondCall[0].idempotency_key).toBe(firstCall[0].idempotency_key);
  });
});
