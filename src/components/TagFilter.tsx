import { useState, useEffect } from 'react';
import { Tag, X, Filter, ChevronDown } from 'lucide-react';
import { getTags } from '../lib/supabase';

interface TagData {
  id: string;
  name: string;
  color: string;
}

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  isDarkMode: boolean;
}

export function TagFilter({ selectedTags, onTagsChange, isDarkMode }: TagFilterProps) {
  const [tags, setTags] = useState<TagData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTags();
        setTags(data || []);
      } catch (error) {
        console.error('Failed to load tags:', error);
      }
    })();
  }, []);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(t => t !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const clearAll = () => {
    onTagsChange([]);
  };

  if (tags.length === 0) return null;

  return (
    <div className={`mx-3 mb-2 rounded-xl overflow-hidden transition-all ${
      isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
    }`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${
          isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Tags
          </span>
          {selectedTags.length > 0 && (
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${
              isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              {selectedTags.length}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${
          isExpanded ? 'rotate-180' : ''
        } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-200 ${
        isExpanded ? 'max-h-48' : 'max-h-0'
      }`}>
        <div className="px-3 pb-3 pt-1">
          {selectedTags.length > 0 && (
            <button
              onClick={clearAll}
              className={`mb-2 text-xs flex items-center gap-1 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                        : 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                      : isDarkMode
                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                        : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color || '#6b7280' }}
                  />
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
