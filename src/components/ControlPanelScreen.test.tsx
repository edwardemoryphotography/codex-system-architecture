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
  });
});
