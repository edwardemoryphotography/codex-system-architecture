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

function createCanvasContextMock() {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'createRadialGradient' || prop === 'createLinearGradient') {
          return () => ({ addColorStop: () => {} });
        }
        if (prop === 'measureText') {
          return (text: string) => ({ width: text.length * 7 });
        }
        if (prop === 'getLineDash') {
          return () => [];
        }
        return () => {};
      },
      set() {
        return true;
      },
    },
  );
}

describe('KnowledgeGraph', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(createCanvasContextMock),
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

  it('renders the atlas header with graph metadata', async () => {
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
    expect(screen.getByText(/current/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close knowledge graph/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /mobile graph controls/i })).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
  });

  it('opens the territory index with search and territory rows', async () => {
    const user = userEvent.setup();

    render(
      <KnowledgeGraph
        isOpen
        onClose={() => {}}
        onSelectDocument={() => {}}
        isDarkMode
      />,
    );

    await screen.findByText(/current/i);
    await user.click(screen.getByRole('button', { name: /territories/i }));

    expect(screen.getByPlaceholderText(/search the codex/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close graph explorer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all territories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /artistic systems/i })).toBeInTheDocument();
  });

  it('filters search results as you type', async () => {
    const user = userEvent.setup();

    render(
      <KnowledgeGraph
        isOpen
        onClose={() => {}}
        onSelectDocument={() => {}}
        isDarkMode
      />,
    );

    await screen.findByText(/current/i);
    await user.click(screen.getByRole('button', { name: /search/i }));
    await user.type(screen.getByPlaceholderText(/search the codex/i), 'authorship');

    expect(await screen.findByRole('listbox', { name: /search results/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /identity.*root/i })).toBeInTheDocument();
  });

  it('starts from a clean mobile view when reopened', async () => {
    const user = userEvent.setup();
    const props = {
      onClose: () => {},
      onSelectDocument: () => {},
      isDarkMode: true,
    };
    const { rerender } = render(<KnowledgeGraph isOpen {...props} />);

    await screen.findByText(/current/i);
    await user.click(screen.getByRole('button', { name: /search/i }));
    await user.type(screen.getByPlaceholderText(/search the codex/i), 'authorship');
    expect(screen.getByRole('listbox', { name: /search results/i })).toBeInTheDocument();

    rerender(<KnowledgeGraph isOpen={false} {...props} />);
    rerender(<KnowledgeGraph isOpen {...props} />);

    expect(await screen.findByRole('navigation', { name: /mobile graph controls/i })).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: /explore knowledge graph/i })).not.toBeInTheDocument();
  });

  it('opens a dismissible mobile detail sheet with collapsed connections', async () => {
    const user = userEvent.setup();

    render(
      <KnowledgeGraph
        isOpen
        onClose={() => {}}
        onSelectDocument={() => {}}
        isDarkMode
      />,
    );

    await screen.findByText(/current/i);
    await user.click(screen.getByRole('button', { name: /search/i }));
    await user.type(screen.getByPlaceholderText(/search the codex/i), 'authorship');
    await user.click(await screen.findByRole('option', { name: /identity.*root/i }));

    expect(screen.getByRole('dialog', { name: /node details/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /identity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open full document/i })).toBeInTheDocument();

    const connections = screen.getByRole('button', { name: /connections/i });
    expect(connections).toHaveAttribute('aria-expanded', 'false');
    await user.click(connections);
    expect(connections).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: /close document details/i }));
    expect(screen.queryByRole('dialog', { name: /node details/i })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /mobile graph controls/i })).toBeInTheDocument();
  });
});
