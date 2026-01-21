import { useState, useRef, useCallback, useEffect } from 'react';
import { X, GripVertical, Link2, Unlink } from 'lucide-react';
import { DocumentViewer } from './DocumentViewer';

interface SplitViewProps {
  leftPath: string | null;
  rightPath: string | null;
  onClose: () => void;
  onSelectDocument: (path: string, side: 'left' | 'right') => void;
  isDarkMode: boolean;
}

export function SplitView({ leftPath, rightPath, onClose, onSelectDocument, isDarkMode }: SplitViewProps) {
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [syncScroll, setSyncScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitRatio(Math.max(20, Math.min(80, newRatio)));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex-1 flex relative overflow-hidden">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <button
          onClick={() => setSyncScroll(!syncScroll)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl transition-all border ${
            syncScroll
              ? isDarkMode
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'bg-blue-50 text-blue-600 border-blue-200'
              : isDarkMode
                ? 'bg-white/10 text-gray-400 border-white/10 hover:bg-white/20'
                : 'bg-white/80 text-gray-600 border-gray-200/50 hover:bg-white shadow-lg'
          }`}
        >
          {syncScroll ? <Link2 className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
          <span className="text-sm font-medium">{syncScroll ? 'Synced' : 'Independent'}</span>
        </button>
        <button
          onClick={onClose}
          className={`p-2 rounded-xl backdrop-blur-xl transition-all border ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              : 'bg-white/80 hover:bg-white text-gray-900 border-gray-200/50 shadow-lg'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        className="h-full overflow-hidden"
        style={{ width: `${splitRatio}%` }}
      >
        <DocumentViewer
          path={leftPath}
          isDarkMode={isDarkMode}
          isFocusMode={false}
        />
      </div>

      <div
        className={`w-2 flex-shrink-0 cursor-col-resize flex items-center justify-center group z-10 ${
          isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onMouseDown={() => setIsDragging(true)}
      >
        <div className={`p-1 rounded transition-colors ${
          isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
        }`}>
          <GripVertical className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
      </div>

      <div
        className="h-full overflow-hidden"
        style={{ width: `${100 - splitRatio}%` }}
      >
        <DocumentViewer
          path={rightPath}
          isDarkMode={isDarkMode}
          isFocusMode={false}
        />
      </div>
    </div>
  );
}
