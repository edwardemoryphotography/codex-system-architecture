import { useState, useEffect, useCallback } from 'react';
import { Brain, Clock, History, Menu, MessageSquarePlus, Search, X } from 'lucide-react';

import { Navigation } from './Navigation';
import { SearchBar } from './SearchBar';
import { DocumentViewer } from './DocumentViewer';
import { CommandPalette } from './CommandPalette';
import { KnowledgeGraph } from './KnowledgeGraph';
import { SplitView } from './SplitView';
import { TagFilter } from './TagFilter';
import { ToastProvider } from './Toast';
import { FeedbackFormExample } from './FeedbackFormExample';
import { SupabaseSetupBanner } from './SupabaseSetupBanner';
import { useIsMobileLayout } from '../hooks/useMediaQuery';
import { getRecentDocuments, isSupabaseConfigured } from '../lib/supabase';
import type { CodexDocument } from '../types';

interface RecentDoc {
  codex_documents: CodexDocument;
  last_read_at: string;
}

export function CodexAppShell() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('codex-dark-mode');
      return saved ? JSON.parse(saved) === true : true;
    } catch {
      return true;
    }
  });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isKnowledgeGraphOpen, setIsKnowledgeGraphOpen] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [splitLeftPath, setSplitLeftPath] = useState<string | null>(null);
  const [splitRightPath, setSplitRightPath] = useState<string | null>(null);
  const [isFormExampleOpen, setIsFormExampleOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isMobileLayout = useIsMobileLayout();
  const showDesktopSidebar = !isFocusMode && !isSplitView && !isMobileLayout;
  const showMobileSidebar = isMobileLayout && isMobileNavOpen && !isFocusMode && !isSplitView;

  useEffect(() => {
    localStorage.setItem('codex-dark-mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    (async () => {
      try {
        const docs = await getRecentDocuments(5);
        setRecentDocs(docs || []);
      } catch (error) {
        console.error('Failed to load recent docs:', error);
      }
    })();
  }, [selectedPath]);

  useEffect(() => {
    if (!isMobileLayout) {
      setIsMobileNavOpen(false);
    }
  }, [isMobileLayout]);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        if (isMobileNavOpen) setIsMobileNavOpen(false);
        if (isFocusMode) setIsFocusMode(false);
        if (isSplitView) setIsSplitView(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        setIsKnowledgeGraphOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f' && e.shiftKey) {
        e.preventDefault();
        setIsFocusMode((value) => !value);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        if (!isSplitView && selectedPath) {
          setSplitLeftPath(selectedPath);
          setSplitRightPath(null);
          setIsSplitView(true);
        } else {
          setIsSplitView(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, isSplitView, isMobileNavOpen, selectedPath]);

  const handleSelectDocument = useCallback((path: string) => {
    setSelectedPath(path);
    setIsMobileNavOpen(false);
  }, []);

  const openSplitView = useCallback(() => {
    if (selectedPath) {
      setSplitLeftPath(selectedPath);
      setSplitRightPath(null);
      setIsSplitView(true);
    }
  }, [selectedPath]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <ToastProvider isDarkMode={isDarkMode}>
      <div
        className={`min-h-screen flex flex-col transition-colors duration-500 ${
          isDarkMode ? 'codex-atmosphere text-[#eef2f7]' : 'codex-atmosphere-light text-slate-900'
        }`}
      >
        {!isSupabaseConfigured && <SupabaseSetupBanner isDarkMode={isDarkMode} />}
        <div className="flex flex-1 overflow-hidden min-h-0 relative">
          {showMobileSidebar && (
            <button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileNavOpen(false)}
            />
          )}

          <div
            className={`flex flex-col h-full transition-all duration-300 ease-out border-r z-40
              ${
                isMobileLayout
                  ? `fixed inset-y-0 left-0 w-[min(100vw,20rem)] max-w-full shadow-2xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ${
                      showMobileSidebar
                        ? 'translate-x-0 pointer-events-auto opacity-100'
                        : '-translate-x-full pointer-events-none opacity-0'
                    }`
                  : showDesktopSidebar
                    ? 'relative w-72 opacity-100'
                    : 'relative w-0 opacity-0 overflow-hidden pointer-events-none'
              }
              ${
                isDarkMode
                  ? 'bg-[#0a0e16]/90 backdrop-blur-2xl border-white/8'
                  : 'bg-white/90 backdrop-blur-2xl border-slate-200/80'
              }
            `}
          >
            <div className={`p-4 border-b ${isDarkMode ? 'border-white/8' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-codex-glow ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-codex-cyan/90 to-sky-600'
                      : 'bg-gradient-to-br from-sky-500 to-cyan-600'
                  }`}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h1
                    className={`font-display text-xl font-bold tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Codex
                  </h1>
                  <p
                    className={`font-mono text-[0.62rem] tracking-[0.16em] uppercase ${
                      isDarkMode ? 'text-white/35' : 'text-slate-400'
                    }`}
                  >
                    Knowledge System
                  </p>
                </div>
                {isMobileLayout && (
                  <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`p-2 rounded-xl transition-all ${
                      isDarkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/70'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <a
                href="/cognition"
                className={`mt-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all border ${
                  isDarkMode
                    ? 'border-codex-cyan/20 bg-codex-cyan/8 hover:bg-codex-cyan/12 text-codex-cyan'
                    : 'border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800'
                }`}
              >
                <Brain className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 font-medium">Cognition Deck</span>
                <span
                  className={`font-mono text-[0.6rem] tracking-[0.12em] uppercase ${
                    isDarkMode ? 'text-codex-cyan/55' : 'text-sky-600/70'
                  }`}
                >
                  Manifesto
                </span>
              </a>

              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className={`w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isDarkMode
                    ? 'bg-white/[0.04] hover:bg-white/[0.07] text-white/45 border border-white/8'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border border-transparent'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="flex-1 text-left">Quick search...</span>
                <kbd
                  className={`hidden md:inline px-1.5 py-0.5 font-mono text-[0.65rem] rounded ${
                    isDarkMode ? 'bg-white/10 text-white/50' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  Cmd+K
                </kbd>
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
            <SearchBar
              onSelectDocument={handleSelectDocument}
              onSearchResults={() => {}}
              isDarkMode={isDarkMode}
            />

            <TagFilter
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              isDarkMode={isDarkMode}
            />

            {recentDocs.length > 0 && (
              <div
                className={`mx-3 mb-2 rounded-xl overflow-hidden border ${
                  isDarkMode ? 'bg-white/[0.03] border-white/8' : 'bg-slate-100/80 border-transparent'
                }`}
              >
                <button
                  onClick={() => setShowRecent(!showRecent)}
                  className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${
                    isDarkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-200/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <History className={`w-4 h-4 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`} />
                    <span
                      className={`text-sm font-medium ${isDarkMode ? 'text-white/75' : 'text-slate-700'}`}
                    >
                      Recent
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${showRecent ? 'rotate-180' : ''} ${
                      isDarkMode ? 'text-white/40' : 'text-slate-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showRecent && (
                  <div className="px-2 pb-2 space-y-1">
                    {recentDocs.map((doc) => (
                      <button
                        key={doc.codex_documents.id}
                        onClick={() => handleSelectDocument(doc.codex_documents.path)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                          isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-white'
                        }`}
                      >
                        <Clock
                          className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}
                        />
                        <span
                          className={`text-xs truncate flex-1 ${
                            isDarkMode ? 'text-white/65' : 'text-slate-600'
                          }`}
                        >
                          {doc.codex_documents.title}
                        </span>
                        <span
                          className={`font-mono text-[0.6rem] ${
                            isDarkMode ? 'text-white/25' : 'text-slate-400'
                          }`}
                        >
                          {formatTimeAgo(doc.last_read_at)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Navigation
              onSelectDocument={handleSelectDocument}
              selectedPath={selectedPath}
              isDarkMode={isDarkMode}
            />
            </div>

            <div className={`p-3 border-t shrink-0 ${isDarkMode ? 'border-white/8' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsKnowledgeGraphOpen(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                    isDarkMode
                      ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/8'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Graph
                </button>
                <button
                  onClick={() => setIsFormExampleOpen(true)}
                  className={`p-2 rounded-xl transition-all ${
                    isDarkMode
                      ? 'bg-white/[0.04] hover:bg-white/[0.08] text-emerald-400 border border-white/8'
                      : 'bg-slate-100 hover:bg-slate-200 text-emerald-600'
                  }`}
                  title="Form Validation Demo"
                >
                  <MessageSquarePlus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-xl transition-all ${
                    isDarkMode
                      ? 'bg-white/[0.04] hover:bg-white/[0.08] text-codex-amber border border-white/8'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div
                className={`hidden md:block mt-2 px-2.5 py-2 rounded-xl font-mono text-[0.62rem] tracking-[0.08em] ${
                  isDarkMode ? 'bg-white/[0.03] text-white/30' : 'bg-slate-100/50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Cmd+G</span>
                  <span>Graph</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Cmd+\</span>
                  <span>Split View</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Cmd+Shift+F</span>
                  <span>Focus</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex-1 min-w-0 flex flex-col relative transition-all duration-500 ${isFocusMode ? 'px-0' : ''}`}>
            {isMobileLayout && !isFocusMode && !isSplitView && (
              <header
                className={`shrink-0 flex items-center gap-3 px-4 py-3 border-b md:hidden pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl ${
                  isDarkMode
                    ? 'border-white/8 bg-[#070a10]/90'
                    : 'border-slate-200 bg-white/90'
                }`}
              >
                <button
                  type="button"
                  aria-label="Open navigation"
                  onClick={() => setIsMobileNavOpen(true)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isDarkMode
                      ? 'bg-white/[0.06] text-white/85'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-display font-semibold truncate ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {selectedPath
                      ? selectedPath.split('/').pop()?.replace('.md', '').replace(/_/g, ' ')
                      : 'Codex'}
                  </p>
                  <p
                    className={`font-mono text-[0.6rem] tracking-[0.14em] uppercase truncate ${
                      isDarkMode ? 'text-white/35' : 'text-slate-400'
                    }`}
                  >
                    {selectedPath ? 'Knowledge System' : 'Control Panel'}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Open search"
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isDarkMode
                      ? 'bg-white/[0.06] text-white/85'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Search className="w-5 h-5" />
                </button>
              </header>
            )}

            <div className="flex-1 min-h-0 flex flex-col">
            {isFocusMode && (
              <button
                onClick={() => setIsFocusMode(false)}
                className={`absolute top-4 left-4 z-20 p-2 rounded-xl transition-all opacity-30 hover:opacity-100 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-lg'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>
            )}

            {isSplitView ? (
              <SplitView
                leftPath={splitLeftPath}
                rightPath={splitRightPath}
                onClose={() => setIsSplitView(false)}
                onSelectDocument={(path, side) => {
                  if (side === 'left') {
                    setSplitLeftPath(path);
                  } else {
                    setSplitRightPath(path);
                  }
                }}
                isDarkMode={isDarkMode}
              />
            ) : (
              <DocumentViewer
                path={selectedPath}
                isDarkMode={isDarkMode}
                isFocusMode={isFocusMode}
                onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
                onOpenSplitView={openSplitView}
              />
            )}
            </div>
          </div>

          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelectDocument={handleSelectDocument}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
            onOpenKnowledgeGraph={() => setIsKnowledgeGraphOpen(true)}
            isDarkMode={isDarkMode}
          />

          <KnowledgeGraph
            isOpen={isKnowledgeGraphOpen}
            onClose={() => setIsKnowledgeGraphOpen(false)}
            onSelectDocument={handleSelectDocument}
            isDarkMode={isDarkMode}
          />

          <FeedbackFormExample
            isOpen={isFormExampleOpen}
            onClose={() => setIsFormExampleOpen(false)}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </ToastProvider>
  );
}
