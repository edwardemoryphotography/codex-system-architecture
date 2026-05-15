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
        name: /closing manifesto/i,
      }),
    ).toBeInTheDocument();
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
});
