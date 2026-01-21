import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, FileText, Bookmark, Clock, Hash, Command, ArrowRight, Star, Moon, Sun, Maximize2, Network } from 'lucide-react';
import { searchDocuments, getBookmarks, getRecentDocuments } from '../lib/supabase';
import { CodexDocument } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (path: string) => void;
  onToggleDarkMode: () => void;
  onToggleFocusMode: () => void;
  onOpenKnowledgeGraph: () => void;
  isDarkMode: boolean;
}

type CommandType = 'document' | 'bookmark' | 'recent' | 'action';

interface CommandItem {
  id: string;
  type: CommandType;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  category?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectDocument,
  onToggleDarkMode,
  onToggleFocusMode,
  onOpenKnowledgeGraph,
  isDarkMode
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<CommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const defaultActions: CommandItem[] = [
    {
      id: 'toggle-dark',
      type: 'action',
      title: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Toggle theme',
      icon: isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: () => { onToggleDarkMode(); onClose(); }
    },
    {
      id: 'focus-mode',
      type: 'action',
      title: 'Toggle Focus Mode',
      subtitle: 'Distraction-free reading',
      icon: <Maximize2 className="w-4 h-4" />,
      action: () => { onToggleFocusMode(); onClose(); }
    },
    {
      id: 'knowledge-graph',
      type: 'action',
      title: 'Open Knowledge Graph',
      subtitle: 'Visualize document connections',
      icon: <Network className="w-4 h-4" />,
      action: () => { onOpenKnowledgeGraph(); onClose(); }
    }
  ];

  const loadInitialItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bookmarksData, recentData] = await Promise.all([
        getBookmarks(),
        getRecentDocuments(5)
      ]);

      const bookmarkItems: CommandItem[] = (bookmarksData || []).map((b: { codex_documents: CodexDocument }) => ({
        id: `bookmark-${b.codex_documents.id}`,
        type: 'bookmark' as CommandType,
        title: b.codex_documents.title,
        subtitle: b.codex_documents.path,
        category: b.codex_documents.category,
        icon: <Star className="w-4 h-4 text-amber-500" />,
        action: () => { onSelectDocument(b.codex_documents.path); onClose(); }
      }));

      const recentItems: CommandItem[] = (recentData || [])
        .filter((r: { codex_documents: CodexDocument | null }) => r.codex_documents)
        .map((r: { codex_documents: CodexDocument }) => ({
          id: `recent-${r.codex_documents.id}`,
          type: 'recent' as CommandType,
          title: r.codex_documents.title,
          subtitle: r.codex_documents.path,
          category: r.codex_documents.category,
          icon: <Clock className="w-4 h-4 text-gray-400" />,
          action: () => { onSelectDocument(r.codex_documents.path); onClose(); }
        }));

      setItems([...defaultActions, ...bookmarkItems, ...recentItems]);
    } catch (error) {
      console.error('Failed to load items:', error);
      setItems(defaultActions);
    } finally {
      setIsLoading(false);
    }
  }, [onSelectDocument, onClose, isDarkMode]);

  const searchItems = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      loadInitialItems();
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchDocuments(searchQuery);
      const searchResults: CommandItem[] = (results || []).map((doc: CodexDocument) => ({
        id: `doc-${doc.id}`,
        type: 'document' as CommandType,
        title: doc.title,
        subtitle: doc.path,
        category: doc.category,
        icon: <FileText className="w-4 h-4" />,
        action: () => { onSelectDocument(doc.path); onClose(); }
      }));

      const filteredActions = defaultActions.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setItems([...filteredActions, ...searchResults]);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onSelectDocument, onClose, loadInitialItems]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      loadInitialItems();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, loadInitialItems]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchItems(query);
    }, 150);
    return () => clearTimeout(debounce);
  }, [query, searchItems]);

  useEffect(() => {
    if (listRef.current && items.length > 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, items.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (items[selectedIndex]) {
          items[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  const groupedItems = items.reduce((acc, item) => {
    const group = item.type === 'action' ? 'Actions' :
                  item.type === 'bookmark' ? 'Bookmarks' :
                  item.type === 'recent' ? 'Recent' : 'Documents';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden
          ${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}
          transform transition-all duration-200 ease-out
        `}
        style={{
          animation: 'commandPaletteIn 0.2s ease-out'
        }}
      >
        <div className={`flex items-center gap-3 px-4 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <Search className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search documents, actions, or type a command..."
            className={`flex-1 bg-transparent outline-none text-lg
              ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
            `}
          />
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
            ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}
          `}>
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        <div
          ref={listRef}
          className="max-h-[400px] overflow-y-auto py-2"
        >
          {isLoading ? (
            <div className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Searching...</p>
            </div>
          ) : items.length === 0 ? (
            <div className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-sm">No results found</p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([group, groupItems]) => (
              <div key={group}>
                <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider
                  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}
                `}>
                  {group}
                </div>
                {groupItems.map((item) => {
                  const currentIndex = flatIndex++;
                  const isSelected = currentIndex === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150
                        ${isSelected
                          ? isDarkMode
                            ? 'bg-gray-800 text-white'
                            : 'bg-blue-50 text-blue-900'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                        ${isSelected
                          ? isDarkMode ? 'bg-gray-700' : 'bg-blue-100'
                          : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                        }
                      `}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        {item.subtitle && (
                          <p className={`text-sm truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      {item.category && (
                        <span className={`px-2 py-0.5 text-xs rounded-full
                          ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}
                        `}>
                          {item.category.replace(/_/g, ' ')}
                        </span>
                      )}
                      {isSelected && (
                        <ArrowRight className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-blue-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className={`flex items-center justify-between px-4 py-3 border-t text-xs
          ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}
        `}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes commandPaletteIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
