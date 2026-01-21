import { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { SearchBar } from './components/SearchBar';
import { DocumentViewer } from './components/DocumentViewer';
import { CommandPalette } from './components/CommandPalette';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { ParticleField } from './components/ParticleField';
import { SplitView } from './components/SplitView';
import { TagFilter } from './components/TagFilter';
import { ToastProvider } from './components/Toast';
import { FeedbackFormExample } from './components/FeedbackFormExample';
import { CodexDocument } from './types';
import { Clock, History, MessageSquarePlus } from 'lucide-react';
import { getRecentDocuments } from './lib/supabase';

interface RecentDoc {
  codex_documents: CodexDocument;
  last_read_at: string;
}

function App() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<CodexDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('codex-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isKnowledgeGraphOpen, setIsKnowledgeGraphOpen] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [splitLeftPath, setSplitLeftPath] = useState<string | null>(null);
  const [splitRightPath, setSplitRightPath] = useState<string | null>(null);
  const [isFormExampleOpen, setIsFormExampleOpen] = useState(false);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        if (isFocusMode) setIsFocusMode(false);
        if (isSplitView) setIsSplitView(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        setIsKnowledgeGraphOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f' && e.shiftKey) {
        e.preventDefault();
        setIsFocusMode(f => !f);
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
  }, [isFocusMode, isSplitView, selectedPath]);

  const handleSelectDocument = useCallback((path: string) => {
    setSelectedPath(path);
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
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {!selectedPath && !isFocusMode && !isSplitView && (
        <div className="fixed inset-0 pointer-events-none">
          <ParticleField particleCount={60} connectionDistance={120} mouseRadius={150} className="opacity-30 pointer-events-auto" />
        </div>
      )}

      <div className={`flex flex-col h-screen transition-all duration-500 ease-out
        ${isFocusMode || isSplitView ? 'w-0 opacity-0 overflow-hidden' : 'w-72'}
        ${isDarkMode ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800' : 'bg-white/95 backdrop-blur-xl border-gray-200'}
        border-r relative z-10
      `}>
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Codex</h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Knowledge System</p>
            </div>
          </div>

          <button onClick={() => setIsCommandPaletteOpen(true)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="flex-1 text-left">Quick search...</span>
            <kbd className={`px-1.5 py-0.5 text-xs rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>Cmd+K</kbd>
          </button>
        </div>

        <SearchBar onSelectDocument={handleSelectDocument} onSearchResults={(results, query) => { setSearchResults(results); setSearchQuery(query); }} isDarkMode={isDarkMode} />

        <TagFilter selectedTags={selectedTags} onTagsChange={setSelectedTags} isDarkMode={isDarkMode} />

        {recentDocs.length > 0 && (
          <div className={`mx-3 mb-2 rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'}`}>
            <button onClick={() => setShowRecent(!showRecent)} className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50'}`}>
              <div className="flex items-center gap-2">
                <History className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recent</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${showRecent ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showRecent && (
              <div className="px-2 pb-2 space-y-1">
                {recentDocs.map(doc => (
                  <button key={doc.codex_documents.id} onClick={() => handleSelectDocument(doc.codex_documents.path)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-white'}`}>
                    <Clock className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-xs truncate flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{doc.codex_documents.title}</span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{formatTimeAgo(doc.last_read_at)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <Navigation onSelectDocument={handleSelectDocument} selectedPath={selectedPath} isDarkMode={isDarkMode} />

        <div className={`p-3 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsKnowledgeGraphOpen(true)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Graph
            </button>
            <button onClick={() => setIsFormExampleOpen(true)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800 text-green-400' : 'bg-gray-100 hover:bg-gray-200 text-green-600'}`} title="Form Validation Demo">
              <MessageSquarePlus className="w-5 h-5" />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          <div className={`mt-2 px-2 py-1.5 rounded-lg text-xs ${isDarkMode ? 'bg-gray-800/30 text-gray-500' : 'bg-gray-100/50 text-gray-400'}`}>
            <div className="flex items-center justify-between">
              <span>Cmd+G</span><span>Graph</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Cmd+\</span><span>Split View</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Cmd+Shift+F</span><span>Focus</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 relative transition-all duration-500 ${isFocusMode ? 'px-0' : ''}`}>
        {isFocusMode && (
          <button onClick={() => setIsFocusMode(false)} className={`absolute top-4 left-4 z-20 p-2 rounded-xl transition-all opacity-30 hover:opacity-100 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-lg'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        )}

        {isSplitView ? (
          <SplitView
            leftPath={splitLeftPath}
            rightPath={splitRightPath}
            onClose={() => setIsSplitView(false)}
            onSelectDocument={(path, side) => {
              if (side === 'left') setSplitLeftPath(path);
              else setSplitRightPath(path);
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
    </ToastProvider>
  );
}

export default App;
