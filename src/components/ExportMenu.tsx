import { useState } from 'react';
import { Download, FileText, File, Loader2, Check } from 'lucide-react';
import { CodexDocument } from '../types';

interface ExportMenuProps {
  document: CodexDocument;
  isDarkMode: boolean;
  onClose: () => void;
}

export function ExportMenu({ document, isDarkMode, onClose }: ExportMenuProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);

  const exportAsMarkdown = async () => {
    setExporting('md');
    try {
      const content = `# ${document.title}\n\n${document.content}`;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.title.replace(/[^a-z0-9]/gi, '_')}.md`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExported('md');
      setTimeout(() => setExported(null), 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const exportAsText = async () => {
    setExporting('txt');
    try {
      const content = document.content
        .replace(/^#+\s/gm, '')
        .replace(/\*\*/g, '')
        .replace(/`/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

      const blob = new Blob([`${document.title}\n\n${content}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExported('txt');
      setTimeout(() => setExported(null), 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const copyToClipboard = async () => {
    setExporting('copy');
    try {
      await navigator.clipboard.writeText(`# ${document.title}\n\n${document.content}`);
      setExported('copy');
      setTimeout(() => setExported(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div
      className={`absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden shadow-2xl border z-50 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      style={{ animation: 'slideDown 0.15s ease-out' }}
    >
      <div className={`px-3 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Export Document
        </p>
      </div>

      <div className="py-1">
        <button
          onClick={exportAsMarkdown}
          disabled={exporting !== null}
          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${
            isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          {exporting === 'md' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : exported === 'md' ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span className="text-sm">Download as Markdown</span>
        </button>

        <button
          onClick={exportAsText}
          disabled={exporting !== null}
          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${
            isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          {exporting === 'txt' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : exported === 'txt' ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <File className="w-4 h-4" />
          )}
          <span className="text-sm">Download as Text</span>
        </button>

        <button
          onClick={copyToClipboard}
          disabled={exporting !== null}
          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${
            isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          {exporting === 'copy' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : exported === 'copy' ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="text-sm">Copy to Clipboard</span>
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
