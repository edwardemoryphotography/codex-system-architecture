import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { CognitionDeck } from './CognitionDeck';

describe('CognitionDeck', () => {
  it('renders the opening thesis and counter', () => {
    render(<CognitionDeck />);

    expect(
      screen.getByRole('heading', {
        name: /cognition requires infrastructure/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/01 \/ 16/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /previous slide/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next slide/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to codex/i })).toHaveAttribute('href', '/');
  });

  it('advances to the next slide from the next button', async () => {
    const user = userEvent.setup();

    render(<CognitionDeck />);

    await user.click(screen.getByRole('button', { name: /next slide/i }));

    expect(
      screen.getByRole('heading', {
        name: /this is not a discipline problem/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/02 \/ 16/i)).toBeInTheDocument();
  });

  it('responds to keyboard navigation', () => {
    render(<CognitionDeck />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(screen.getByText(/02 \/ 16/i)).toBeInTheDocument();
  });

  it('clamps navigation on the first slide', async () => {
    const user = userEvent.setup();

    render(<CognitionDeck />);

    await user.click(screen.getByRole('button', { name: /previous slide/i }));

    expect(screen.getByText(/01 \/ 16/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /cognition requires infrastructure/i,
      }),
    ).toBeInTheDocument();
  });

  it('clamps navigation on the last slide', async () => {
    const user = userEvent.setup();

    render(<CognitionDeck />);

    const nextButton = screen.getByRole('button', { name: /next slide/i });

    for (let index = 0; index < 20; index += 1) {
      await user.click(nextButton);
    }

    expect(screen.getByText(/16 \/ 16/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /build systems that preserve reality contact/i,
      }),
    ).toBeInTheDocument();
  });

  it('exposes section visual state on the main shell', async () => {
    const user = userEvent.setup();
    const { container } = render(<CognitionDeck />);

    const shell = container.querySelector('main');
    const nextButton = screen.getByRole('button', { name: /next slide/i });

    expect(shell).not.toBeNull();
    expect(shell).toHaveAttribute('data-state', 'coherence');

    for (let index = 0; index < 4; index += 1) {
      await user.click(nextButton);
    }

    expect(
      screen.getByRole('heading', {
        name: /our systems mismatch the work we ask minds to do/i,
      }),
    ).toBeInTheDocument();
    expect(shell).toHaveAttribute('data-state', 'overload');
  });

  it('keeps the signal state while advancing within the recognition act', async () => {
    const user = userEvent.setup();
    const { container } = render(<CognitionDeck />);

    const shell = container.querySelector('main');

    await user.click(screen.getByRole('button', { name: /next slide/i }));

    expect(
      screen.getByRole('heading', {
        name: /this is not a discipline problem/i,
      }),
    ).toBeInTheDocument();
    expect(shell).toHaveAttribute('data-state', 'coherence');
  });

  it('reaches a throughput slide with throughput visual state', async () => {
    const user = userEvent.setup();
    const { container } = render(<CognitionDeck />);

    const shell = container.querySelector('main');
    const nextButton = screen.getByRole('button', { name: /next slide/i });

    await user.click(nextButton);
    await user.click(nextButton);

    expect(
      screen.getByRole('heading', {
        name: /throughput is now a cognitive constraint/i,
      }),
    ).toBeInTheDocument();
    expect(shell).toHaveAttribute('data-state', 'overload');
  });

  it('reaches a recursion slide with recursion visual state', async () => {
    const user = userEvent.setup();
    const { container } = render(<CognitionDeck />);

    const shell = container.querySelector('main');
    const nextButton = screen.getByRole('button', { name: /next slide/i });

    for (let index = 0; index < 13; index += 1) {
      await user.click(nextButton);
    }

    expect(
      screen.getByRole('heading', {
        name: /controlled recursive depth/i,
      }),
    ).toBeInTheDocument();
    expect(shell).toHaveAttribute('data-state', 'recursion');
  });

  it('ignores the global space shortcut when a button is focused', async () => {
    const user = userEvent.setup();

    render(<CognitionDeck />);

    const nextButton = screen.getByRole('button', { name: /next slide/i });
    nextButton.focus();

    await user.keyboard('[Space]');

    expect(screen.getByText(/02 \/ 16/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /this is not a discipline problem/i,
      }),
    ).toBeInTheDocument();
  });

  it('advances on a leftward swipe', () => {
    render(<CognitionDeck />);

    const deck = screen.getByRole('main', { name: /cognition deck/i });

    fireEvent.touchStart(deck, {
      changedTouches: [{ clientX: 220, clientY: 240 }],
    });
    fireEvent.touchEnd(deck, {
      changedTouches: [{ clientX: 120, clientY: 244 }],
    });

    expect(screen.getByText(/02 \/ 16/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /this is not a discipline problem/i,
      }),
    ).toBeInTheDocument();
  });

  it('restores a versioned session from local storage', () => {
    window.localStorage.setItem(
      'codex:cognition:v2.1',
      JSON.stringify({ version: 1, currentIndex: 4, selectedNodeId: null, recoveryScore: 67 }),
    );

    render(<CognitionDeck />);

    expect(screen.getByText(/05 \/ 16/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /our systems mismatch/i })).toBeInTheDocument();
  });

  it('exposes the real Codex graph nodes', async () => {
    const user = userEvent.setup();
    render(<CognitionDeck />);
    const nextButton = screen.getByRole('button', { name: /next slide/i });
    for (let index = 0; index < 13; index += 1) await user.click(nextButton);

    expect(screen.getByRole('button', { name: 'Memory' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Photography Business' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Muse/WHOOP' })).toBeInTheDocument();
  });

  it('routes a recovery score into a bounded work mode', async () => {
    const user = userEvent.setup();
    render(<CognitionDeck />);
    const nextButton = screen.getByRole('button', { name: /next slide/i });
    for (let index = 0; index < 12; index += 1) await user.click(nextButton);

    const input = screen.getByLabelText(/recovery score/i);
    await user.clear(input);
    await user.type(input, '33');

    expect(screen.getByText('recovery')).toBeInTheDocument();
    expect(screen.getByText(/20 minute session cap/i)).toBeInTheDocument();
  });

  it('collapses to the reality-contact manifesto', async () => {
    const user = userEvent.setup();
    render(<CognitionDeck />);
    const nextButton = screen.getByRole('button', { name: /next slide/i });
    for (let index = 0; index < 15; index += 1) await user.click(nextButton);

    expect(screen.getByRole('heading', { name: 'Build systems that preserve reality contact.' })).toBeInTheDocument();
  });
});
