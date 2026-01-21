import { useEffect, useState, useRef, useCallback } from 'react';
import { getDocumentByPath, updateReadingProgress, getReadingProgress, isBookmarked, addBookmark, removeBookmark, getDocumentNotes, addDocumentNote, deleteDocumentNote } from '../lib/supabase';
import { CodexDocument } from '../types';
import { Calendar, FileText, ChevronRight, BookOpen, Sparkles, Star, Maximize2, MessageSquare, X, Send, Download, Columns } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TableOfContents } from './TableOfContents';
import { ParticleField } from './ParticleField';
import { ExportMenu } from './ExportMenu';

interface DocumentViewerProps {
  path: string | null;
  isDarkMode?: boolean;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  onOpenSplitView?: () => void;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string }> = {
  root: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', darkBg: 'bg-emerald-500/10', darkText: 'text-emerald-400', darkBorder: 'border-emerald-500/30' },
  council: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', darkBg: 'bg-amber-500/10', darkText: 'text-amber-400', darkBorder: 'border-amber-500/30' },
  territory: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', darkBg: 'bg-blue-500/10', darkText: 'text-blue-400', darkBorder: 'border-blue-500/30' },
  artistic_systems: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', darkBg: 'bg-rose-500/10', darkText: 'text-rose-400', darkBorder: 'border-rose-500/30' },
  neuro: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', darkBg: 'bg-violet-500/10', darkText: 'text-violet-400', darkBorder: 'border-violet-500/30' },
  automation: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', darkBg: 'bg-cyan-500/10', darkText: 'text-cyan-400', darkBorder: 'border-cyan-500/30' },
  business: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', darkBg: 'bg-orange-500/10', darkText: 'text-orange-400', darkBorder: 'border-orange-500/30' },
  personal_os: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', darkBg: 'bg-teal-500/10', darkText: 'text-teal-400', darkBorder: 'border-teal-500/30' },
  convergence: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', darkBg: 'bg-slate-500/10', darkText: 'text-slate-400', darkBorder: 'border-slate-500/30' },
};

export function DocumentViewer({ path, isDarkMode = false, isFocusMode = false, onToggleFocusMode, onOpenSplitView }: DocumentViewerProps) {
  const [document, setDocument] = useState<CodexDocument | null>(null);
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
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      setStartTime(Date.now());
      setShowNotes(false);
      setShowExport(false);
      try {
        const doc = await getDocumentByPath(path);
        setDocument(doc);

        if (doc) {
          const [isMarked, progress, docNotes] = await Promise.all([
            isBookmarked(doc.id),
            getReadingProgress(doc.id),
            getDocumentNotes(doc.id)
          ]);
          setBookmarked(isMarked);
          setNotes(docNotes || []);

          if (progress && scrollRef.current) {
            setTimeout(() => {
              if (scrollRef.current) {
                const scrollHeight = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
                scrollRef.current.scrollTop = (progress.scroll_position / 100) * scrollHeight;
              }
            }, 100);
          }
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
    const progress = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 100;
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
    return () => { saveProgress(); clearInterval(interval); };
  }, [document, scrollProgress, startTime]);

  const toggleBookmark = async () => {
    if (!document) return;
    try {
      if (bookmarked) await removeBookmark(document.id);
      else await addBookmark(document.id);
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleAddNote = async () => {
    if (!document || !newNote.trim()) return;
    try {
      const note = await addDocumentNote(document.id, newNote.trim());
      if (note) { setNotes([note, ...notes]); setNewNote(''); }
    } catch (error) { console.error('Failed to add note:', error); }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDocumentNote(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error) { console.error('Failed to delete note:', error); }
  };

  if (!path) {
    return (
      <div className={`flex-1 flex items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
        <ParticleField particleCount={50} connectionDistance={100} mouseRadius={180} className="opacity-40" />
        <div className="text-center max-w-lg px-6 relative z-10">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to Codex</h2>
          <p className={`text-lg leading-relaxed mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your personal knowledge base and operational system. Select a document from the navigation to explore.
          </p>
          <div className={`flex items-center justify-center gap-3 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Sparkles className="w-4 h-4" />
            <span>Press</span>
            <kbd className={`px-2 py-1 rounded font-mono text-xs ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>Cmd+K</kbd>
            <span>to search</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="text-center p-8">
          <FileText className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
          <p className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{error || 'Document not found'}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const colors = categoryColors[document.category] || categoryColors.root;
  const pathParts = document.path.split('/').filter(Boolean);

  return (
    <div className={`flex-1 flex flex-col overflow-hidden relative ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="absolute top-0 left-0 right-0 h-1 z-20" style={{ background: `linear-gradient(to right, #3b82f6 ${scrollProgress}%, ${isDarkMode ? '#1f2937' : '#e5e7eb'} ${scrollProgress}%)` }} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className={`sticky top-0 z-10 backdrop-blur-xl transition-all duration-300 ${isDarkMode ? colors.darkBg + ' border-b ' + colors.darkBorder : colors.bg + ' border-b ' + colors.border}`}>
          <div className={`max-w-4xl mx-auto px-8 py-6 ${isFocusMode ? 'max-w-3xl' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {pathParts.map((part, idx) => (
                  <span key={idx} className="flex items-center">
                    {idx > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
                    <span className={idx === pathParts.length - 1 ? (isDarkMode ? colors.darkText : colors.text) + ' font-medium' : ''}>
                      {part.replace('.md', '').replace(/_/g, ' ')}
                    </span>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button onClick={toggleBookmark} className={`p-2 rounded-xl transition-all ${bookmarked ? 'text-amber-500 bg-amber-500/10' : isDarkMode ? 'text-gray-500 hover:text-amber-500 hover:bg-gray-800' : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'}`} title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}>
                  <Star className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button onClick={() => setShowNotes(!showNotes)} className={`p-2 rounded-xl transition-all relative ${showNotes ? isDarkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50' : isDarkMode ? 'text-gray-500 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'}`} title="Notes">
                  <MessageSquare className="w-5 h-5" />
                  {notes.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">{notes.length}</span>}
                </button>
                <div className="relative">
                  <button onClick={() => setShowExport(!showExport)} className={`p-2 rounded-xl transition-all ${showExport ? isDarkMode ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50' : isDarkMode ? 'text-gray-500 hover:text-green-400 hover:bg-gray-800' : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'}`} title="Export">
                    <Download className="w-5 h-5" />
                  </button>
                  {showExport && <ExportMenu document={document} isDarkMode={isDarkMode} onClose={() => setShowExport(false)} />}
                </div>
                {onOpenSplitView && (
                  <button onClick={onOpenSplitView} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`} title="Split view">
                    <Columns className="w-5 h-5" />
                  </button>
                )}
                {onToggleFocusMode && (
                  <button onClick={onToggleFocusMode} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`} title="Focus mode">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${isDarkMode ? colors.darkBg + ' ' + colors.darkText + ' border ' + colors.darkBorder : colors.bg + ' ' + colors.text + ' border ' + colors.border}`}>
              {document.category.replace(/_/g, ' ').toUpperCase()}
            </div>

            <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{document.title}</h1>

            <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <Calendar className="w-4 h-4" />
              <span>Last updated {formatDate(document.updated_at)}</span>
            </div>
          </div>
        </div>

        <article className={`max-w-4xl mx-auto px-8 py-8 ${isFocusMode ? 'max-w-3xl' : ''}`}>
          <MarkdownRenderer content={document.content} isDarkMode={isDarkMode} />
        </article>
      </div>

      <TableOfContents content={document.content} isDarkMode={isDarkMode} onNavigate={(id) => console.log('Navigate to:', id)} />

      {showNotes && (
        <div className={`absolute right-4 top-32 w-80 rounded-2xl shadow-2xl overflow-hidden z-30 ${isDarkMode ? 'bg-gray-800/95 backdrop-blur-xl border border-gray-700' : 'bg-white/95 backdrop-blur-xl border border-gray-200'}`} style={{ animation: 'slideIn 0.2s ease-out' }}>
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notes</h3>
              <button onClick={() => setShowNotes(false)} className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex gap-2">
              <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddNote()} placeholder="Add a note..." className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`} />
              <button onClick={handleAddNote} disabled={!newNote.trim()} className={`p-2 rounded-xl transition-all ${newNote.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <div className={`p-4 text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No notes yet</div>
            ) : (
              notes.map(note => (
                <div key={note.id} className={`p-4 border-b last:border-b-0 group ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{note.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(note.created_at)}</span>
                    <button onClick={() => handleDeleteNote(note.id)} className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
