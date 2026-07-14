import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ControlPanelScreen } from './ControlPanelScreen';

vi.mock('../lib/supabase', () => ({
  initializeSessionStart: vi.fn().mockResolvedValue([]),
  isSupabaseConfigured: false,
}));

describe('ControlPanelScreen', () => {
  it('renders the mobile-first control panel copy and actions', () => {
    render(<ControlPanelScreen isDarkMode />);

    expect(screen.getByRole('heading', { name: /what needs to move/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/what needs to move forward/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /route task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fast execute here/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute now/i })).toBeInTheDocument();
    expect(screen.getByText(/launch pads/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /personal os/i })).toBeInTheDocument();
  });

  it('exposes graph and launch actions when callbacks are provided', () => {
    const onSelectDocument = vi.fn();
    const onOpenGraph = vi.fn();

    render(
      <ControlPanelScreen
        isDarkMode
        onSelectDocument={onSelectDocument}
        onOpenGraph={onOpenGraph}
      />,
    );

    screen.getByRole('button', { name: /open graph/i }).click();
    expect(onOpenGraph).toHaveBeenCalledTimes(1);

    screen.getByRole('button', { name: /personal os/i }).click();
    expect(onSelectDocument).toHaveBeenCalledWith('/codex/personal_os');
  });
});
