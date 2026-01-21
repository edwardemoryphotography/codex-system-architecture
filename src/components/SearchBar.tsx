import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { searchDocuments } from '../lib/supabase';
import { CodexDocument } from '../types';

interface SearchBarProps {
  onSelectDocument: (path: string) => void;
  onSearchResults: (results: CodexDocument[], query: string) => void;
  isDarkMode?: boolean;
}

export function SearchBar({ onSelectDocument, onSearchResults, isDarkMode = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CodexDocument[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);

    if (q.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const docs = await searchDocuments(q);
      setResults(docs);
      onSearchResults(docs, q);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [onSearchResults]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onSearchResults([], '');
  };

  return (
    <div className="relative px-3 py-2">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all
        ${isDarkMode
          ? 'bg-gray-800/50 focus-within:bg-gray-800'
          : 'bg-gray-100 focus-within:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500/20'
        }
      `}>
        <Search className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder="Filter..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className={`flex-1 outline-none text-sm bg-transparent
            ${isDarkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
          `}
        />
        {query && (
          <button
            onClick={handleClear}
            className={`p-1 rounded transition-colors
              ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
            `}
          >
            <X className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        )}
      </div>

      {showResults && (
        <div className={`absolute top-full left-3 right-3 mt-2 rounded-xl shadow-xl z-50 overflow-hidden
          ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
        `}
          style={{
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          {loading ? (
            <div className={`p-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.slice(0, 10).map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    onSelectDocument(doc.path);
                    setShowResults(false);
                    setQuery('');
                  }}
                  className={`w-full text-left px-4 py-3 transition-all
                    ${isDarkMode
                      ? 'hover:bg-gray-700 border-gray-700'
                      : 'hover:bg-gray-50 border-gray-100'
                    }
                    ${idx < results.length - 1 ? 'border-b' : ''}
                  `}
                >
                  <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {doc.title}
                  </div>
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {doc.path}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={`p-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No results found
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
