import { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  isDarkMode: boolean;
  onNavigate: (id: string) => void;
}

export function TableOfContents({ content, isDarkMode, onNavigate }: TableOfContentsProps) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const lines = content.split('\n');
    const tocItems: TOCItem[] = [];
    let itemIndex = 0;

    lines.forEach(line => {
      const h1Match = line.match(/^# (.+)/);
      const h2Match = line.match(/^## (.+)/);
      const h3Match = line.match(/^### (.+)/);

      if (h1Match) {
        tocItems.push({
          id: `heading-${itemIndex++}`,
          title: h1Match[1],
          level: 1
        });
      } else if (h2Match) {
        tocItems.push({
          id: `heading-${itemIndex++}`,
          title: h2Match[1],
          level: 2
        });
      } else if (h3Match) {
        tocItems.push({
          id: `heading-${itemIndex++}`,
          title: h3Match[1],
          level: 3
        });
      }
    });

    setItems(tocItems);
  }, [content]);

  if (items.length < 3) return null;

  return (
    <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-30 transition-all duration-300
      ${isExpanded ? 'w-64' : 'w-12'}
    `}>
      <div className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300
        ${isDarkMode ? 'bg-gray-800/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'}
      `}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center gap-3 p-3 transition-colors
            ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
          `}
        >
          <List className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          {isExpanded && (
            <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Contents
            </span>
          )}
        </button>

        {isExpanded && (
          <div className="max-h-80 overflow-y-auto px-2 pb-3">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveId(item.id);
                  onNavigate(item.id);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                  ${item.level === 1 ? 'font-semibold' : ''}
                  ${item.level === 2 ? 'pl-5' : ''}
                  ${item.level === 3 ? 'pl-7 text-xs' : ''}
                  ${activeId === item.id
                    ? isDarkMode
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-50 text-blue-600'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {item.level > 1 && (
                    <ChevronRight className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  )}
                  <span className="truncate">{item.title}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
