import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { CORPUS_DOCUMENTS } from '../content/codexCorpus';
import { KnowledgeGraph } from './KnowledgeGraph';

vi.mock('../lib/supabase', () => ({
  getDocuments: vi.fn().mockResolvedValue([]),
  getDocumentLinks: vi.fn().mockResolvedValue([]),
}));

vi.mock('../hooks/useMediaQuery', () => ({
  useIsMobileLayout: () => true,
}));

describe('KnowledgeGraph', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({
        setTransform: vi.fn(),
        clearRect: vi.fn(),
        createRadialGradient: vi.fn(() => ({
          addColorStop: vi.fn(),
        })),
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        fillText: vi.fn(),
        setLineDash: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
      })),
    });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 390,
      height: 844,
      top: 0,
      left: 0,
      bottom: 844,
      right: 390,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
  });

  it('renders the full Codex graph metadata on mobile', async () => {
    render(
      <KnowledgeGraph
        isOpen
        onClose={() => {}}
        onSelectDocument={() => {}}
        isDarkMode
      />,
    );

    expect(await screen.findByRole('heading', { name: /knowledge graph/i })).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(`${CORPUS_DOCUMENTS.length} nodes`, 'i')),
    ).toBeInTheDocument();
    expect(screen.getByText(/full codex map/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close knowledge graph/i })).toBeInTheDocument();
  });

  it('opens filters with territory chips', async () => {
    const user = userEvent.setup();

    render(
      <KnowledgeGraph
        isOpen
        onClose={() => {}}
        onSelectDocument={() => {}}
        isDarkMode
      />,
    );

    await screen.findByText(/full codex map/i);
    await user.click(screen.getByRole('button', { name: /toggle filters/i }));

    expect(screen.getByPlaceholderText(/search nodes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all territories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /artistic systems/i })).toBeInTheDocument();
  });
});
