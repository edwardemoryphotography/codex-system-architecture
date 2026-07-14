import { useEffect, useState, useRef, useCallback } from 'react';
import {
  getDocumentByPath,
  getDocuments,
  updateReadingProgress,
  getReadingProgress,
  isBookmarked,
  addBookmark,
  removeBookmark,
  getDocumentNotes,
  addDocumentNote,
  deleteDocumentNote,
} from '../lib/supabase';
import { CodexDocument } from '../types';
import {
  Calendar,
  FileText,
  ChevronRight,
  Star,
  Maximize2,
  MessageSquare,
  X,
  Send,
  Download,
  Columns,
  BookOpen,
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TableOfContents } from './TableOfContents';
import { ControlPanelScreen } from './ControlPanelScreen';
import { ExportMenu } from './ExportMenu';
import { useToast } from './Toast';

interface DocumentViewerProps {
  path: string | null;
  isDarkMode?: boolean;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  onOpenSplitView?: () => void;
  onSelectDocument?: (path: string) => void;
  onOpenGraph?: () => void;
  onOpenControlPanel?: () => void;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
}

const categoryColors: Record<
  string,
  { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string }
> = {
  root: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    darkBg: 'bg-emerald-500/10',
    darkText: 'text-emerald-400',
    darkBorder: 'border-emerald-500/30',
  },
  council: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    darkBg: 'bg-amber-500/10',
    darkText: 'text-amber-400',
    darkBorder: 'border-amber-500/30',
  },
  territory: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    darkBg: 'bg-blue-500/10',
    darkText: 'text-blue-400',
    darkBorder: 'border-blue-500/30',
  },
  artistic_systems: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    darkBg: 'bg-rose-500/10',
    darkText: 'text-rose-400',
    darkBorder: 'border-rose-500/30',
  },
  neuro: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    darkBg: 'bg-violet-500/10',
    darkText: 'text-violet-400',
    darkBorder: 'border-violet-500/30',
  },
  automation: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    darkBg: 'bg-cyan-500/10',
    darkText: 'text-cyan-400',
    darkBorder: 'border-cyan-500/30',
  },
  business: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    darkBg: 'bg-orange-500/10',
    darkText: 'text-orange-400',
    darkBorder: 'border-orange-500/30',
  },
  personal_os: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    darkBg: 'bg-teal-500/10',
    darkText: 'text-teal-400',
    darkBorder: 'border-teal-500/30',
  },
  convergence: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    darkBg: 'bg-slate-500/10',
    darkText: 'text-slate-400',
    darkBorder: 'border-slate-500/30',
  },
  onboarding: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    darkBg: 'bg-violet-500/10',
    darkText: 'text-violet-400',
    darkBorder: 'border-violet-500/30',
  },
};

export function DocumentViewer({
  path,
  isDarkMode = false,
  isFocusMode = false,
  onToggleFocusMode,
  onOpenSplitView,
  onSelectDocument,
  onOpenGraph,
  onOpenControlPanel,
}: DocumentViewerProps) {
  const toast = useToast();
  const [document, setDocument] = useState<CodexDocument | null>(null);
  const [childDocs, setChildDocs] = useState<CodexDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!path) {
      setDocument(null);
      setChildDocs([]);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      setStartTime(Date.now());
      setShowNotes(false);
      setShowExport(false);
      setScrollProgress(0);
      try {
        const doc = await getDocumentByPath(path);
        setDocument(doc);

        if (doc) {
          const [isMarked, progress, docNotes, allDocs] = await Promise.all([
            isBookmarked(doc.id),
            getReadingProgress(doc.id),
            getDocumentNotes(doc.id),
            getDocuments(),
          ]);
          setBookmarked(isMarked);
          setNotes(docNotes || []);
          setChildDocs(
            allDocs
              .filter((d) => d.parent_id === doc.id)
              .sort((a, b) => a.order - b.order),
          );

          if (progress && scrollRef.current) {
            setTimeout(() => {
              if (scrollRef.current) {
                const scrollHeight =
                  scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
                scrollRef.current.scrollTop = (progress.scroll_position / 100) * scrollHeight;
              }
            }, 100);
          }
        } else {
          setChildDocs([]);
        }
      } catch (err) {
        setError('Failed to load document');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [path]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !document) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const progress =
      scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 100;
    setScrollProgress(progress);
  }, [document]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
      return () => scrollEl.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (!document) return;
    const saveProgress = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      updateReadingProgress(document.id, scrollProgress, timeSpent).catch(console.error);
    };
    const interval = setInterval(saveProgress, 5000);
    return () => {
      saveProgress();
      clearInterval(interval);
    };
  }, [document, scrollProgress, startTime]);

  const navigateToHeading = useCallback((id: string) => {
    const el = scrollRef.current?.querySelector(`#${CSS.escape(id)}`);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const toggleBookmark = async () => {
    if (!document) return;
    try {
      if (bookmarked) {
        await removeBookmark(document.id);
        setBookmarked(false);
        toast.info('Bookmark removed');
      } else {
        await addBookmark(document.id);
        setBookmarked(true);
        toast.success('Bookmarked', document.title);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      toast.error('Could not update bookmark');
    }
  };

  const handleAddNote = async () => {
    if (!document || !newNote.trim()) return;
    try {
      const note = await addDocumentNote(document.id, newNote.trim());
      if (note) {
        setNotes([note, ...notes]);
        setNewNote('');
        toast.success('Note saved');
      }
    } catch (err) {
      console.error('Failed to add note:', err);
      toast.error('Could not save note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDocumentNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  if (!path) {
    return (
      <ControlPanelScreen
        isDarkMode={isDarkMode}
        onSelectDocument={onSelectDocument}
        onOpenGraph={onOpenGraph}
      />
    );
  }

  if (loading) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}
      >
        <div className="text-center codex-enter">
          <div className="w-16 h-16 relative mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading document...
          </p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}
      >
        <div className="text-center p-8 codex-enter">
          <FileText
            className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}
          />
          <p className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {error || 'Document not found'}
          </p>
          {onOpenControlPanel && (
            <button
              type="button"
              onClick={onOpenControlPanel}
              className="codex-press codex-focus-ring mt-4 text-sm text-sky-400 hover:text-sky-300"
            >
              Back to Control Panel
            </button>
          )}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  const colors = categoryColors[document.category] || categoryColors.root;
  const pathParts = document.path.split('/').filter(Boolean);
  const progressLabel =
    scrollProgress >= 98 ? 'Done' : scrollProgress < 2 ? 'Start' : `${Math.round(scrollProgress)}%`;

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden relative ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 z-20 transition-[background] duration-150"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${scrollProgress}%, ${
            isDarkMode ? '#1f2937' : '#e5e7eb'
          } ${scrollProgress}%)`,
        }}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div
          className={`sticky top-0 z-10 backdrop-blur-xl transition-all duration-300 ${
            isDarkMode
              ? colors.darkBg + ' border-b ' + colors.darkBorder
              : colors.bg + ' border-b ' + colors.border
          }`}
        >
          <div
            className={`max-w-4xl mx-auto px-4 py-4 md:px-8 md:py-6 ${isFocusMode ? 'max-w-3xl' : ''}`}
          >
            <div className="flex items-start md:items-center justify-between gap-3 mb-4">
              <nav
                aria-label="Breadcrumb"
                className={`flex items-center gap-1 text-xs md:text-sm overflow-x-auto max-w-full ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                {pathParts.map((part, idx) => {
                  const crumbPath = '/' + pathParts.slice(0, idx + 1).join('/');
                  const isLast = idx === pathParts.length - 1;
                  const label = part.replace('.md', '').replace(/_/g, ' ');
                  return (
                    <span key={crumbPath} className="flex items-center shrink-0">
                      {idx > 0 && <ChevronRight className="w-4 h-4 mx-1 opacity-60" />}
                      {isLast || !onSelectDocument ? (
                        <span
                          className={
                            isLast
                              ? (isDarkMode ? colors.darkText : colors.text) + ' font-medium'
                              : ''
                          }
                        >
                          {label}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectDocument(crumbPath)}
                          className={`codex-press codex-focus-ring rounded-md px-1 -mx-1 hover:underline ${
                            isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-800'
                          }`}
                        >
                          {label}
                        </button>
                      )}
                    </span>
                  );
                })}
              </nav>

              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`hidden sm:inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-medium tabular-nums ${
                    isDarkMode
                      ? 'bg-gray-800/80 text-gray-400 border border-gray-700'
                      : 'bg-white/80 text-gray-500 border border-gray-200'
                  }`}
                  title="Reading progress"
                >
                  {progressLabel}
                </span>
                <button
                  type="button"
                  onClick={() => void toggleBookmark()}
                  className={`codex-press codex-focus-ring p-2 rounded-xl transition-all ${
                    bookmarked
                      ? 'text-amber-500 bg-amber-500/10'
                      : isDarkMode
                        ? 'text-gray-500 hover:text-amber-500 hover:bg-gray-800'
                        : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'
                  }`}
                  title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Star className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className={`codex-press codex-focus-ring p-2 rounded-xl transition-all relative ${
                    showNotes
                      ? isDarkMode
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-blue-600 bg-blue-50'
                      : isDarkMode
                        ? 'text-gray-500 hover:text-blue-400 hover:bg-gray-800'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                  title="Notes"
                >
                  <MessageSquare className="w-5 h-5" />
                  {notes.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notes.length}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowExport(!showExport)}
                    className={`codex-press codex-focus-ring p-2 rounded-xl transition-all ${
                      showExport
                        ? isDarkMode
                          ? 'text-green-400 bg-green-500/10'
                          : 'text-green-600 bg-green-50'
                        : isDarkMode
                          ? 'text-gray-500 hover:text-green-400 hover:bg-gray-800'
                          : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'
                    }`}
                    title="Export"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  {showExport && (
                    <ExportMenu
                      document={document}
                      isDarkMode={isDarkMode}
                      onClose={() => setShowExport(false)}
                    />
                  )}
                </div>
                {onOpenSplitView && (
                  <button
                    type="button"
                    onClick={onOpenSplitView}
                    className={`codex-press codex-focus-ring hidden md:inline-flex p-2 rounded-xl transition-all ${
                      isDarkMode
                        ? 'text-gray-500 hover:text-white hover:bg-gray-800'
                        : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title="Split view"
                  >
                    <Columns className="w-5 h-5" />
                  </button>
                )}
                {onToggleFocusMode && (
                  <button
                    type="button"
                    onClick={onToggleFocusMode}
                    className={`codex-press codex-focus-ring p-2 rounded-xl transition-all ${
                      isDarkMode
                        ? 'text-gray-500 hover:text-white hover:bg-gray-800'
                        : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title="Focus mode"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                isDarkMode
                  ? colors.darkBg + ' ' + colors.darkText + ' border ' + colors.darkBorder
                  : colors.bg + ' ' + colors.text + ' border ' + colors.border
              }`}
            >
              {document.category.replace(/_/g, ' ').toUpperCase()}
            </div>

            <h1
              className={`text-2xl md:text-4xl font-bold mb-4 codex-enter ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {document.title}
            </h1>

            <div
              className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
            >
              <Calendar className="w-4 h-4" />
              <span>Last updated {formatDate(document.updated_at)}</span>
            </div>
          </div>
        </div>

        <article
          className={`max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-8 codex-enter-delayed ${
            isFocusMode ? 'max-w-3xl' : ''
          }`}
        >
          {childDocs.length > 0 && onSelectDocument && (
            <div className="mb-8">
              <p
                className={`text-xs uppercase tracking-[0.14em] mb-3 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                In this territory
              </p>
              <div className="flex flex-wrap gap-2">
                {childDocs.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => onSelectDocument(child.path)}
                    className={`codex-press codex-focus-ring codex-surface inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border ${
                      isDarkMode
                        ? 'border-gray-800 bg-gray-900/70 text-gray-200 hover:border-gray-600'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 opacity-60" />
                    {child.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <MarkdownRenderer content={document.content} isDarkMode={isDarkMode} />
        </article>
      </div>

      <TableOfContents
        content={document.content}
        isDarkMode={isDarkMode}
        onNavigate={navigateToHeading}
      />

      {showNotes && (
        <div
          className={`fixed md:absolute inset-x-4 bottom-4 md:inset-x-auto md:right-4 md:top-32 md:bottom-auto w-auto md:w-80 rounded-2xl shadow-2xl overflow-hidden z-30 pb-[env(safe-area-inset-bottom)] md:pb-0 codex-enter ${
            isDarkMode
              ? 'bg-gray-800/95 backdrop-blur-xl border border-gray-700'
              : 'bg-white/95 backdrop-blur-xl border border-gray-200'
          }`}
        >
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Notes
              </h3>
              <button
                type="button"
                onClick={() => setShowNotes(false)}
                className={`codex-press p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void handleAddNote()}
                placeholder="Add a note..."
                className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none codex-focus-ring ${
                  isDarkMode
                    ? 'bg-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => void handleAddNote()}
                disabled={!newNote.trim()}
                className={`codex-press p-2 rounded-xl transition-all ${
                  newNote.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-500'
                      : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <div
                className={`p-4 text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              >
                No notes yet
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 border-b last:border-b-0 group ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}
                >
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatDate(note.created_at)}
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleDeleteNote(note.id)}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
                        isDarkMode
                          ? 'hover:bg-gray-700 text-gray-500'
                          : 'hover:bg-gray-100 text-gray-400'
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
