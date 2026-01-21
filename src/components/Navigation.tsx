import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, Folder } from 'lucide-react';
import { getDocuments } from '../lib/supabase';
import { CodexDocument } from '../types';

interface NavigationProps {
  onSelectDocument: (path: string) => void;
  selectedPath: string | null;
  isDarkMode?: boolean;
}

interface TreeNode {
  document: CodexDocument;
  children: TreeNode[];
}

const categoryIcons: Record<string, string> = {
  root: 'text-emerald-500',
  council: 'text-amber-500',
  territory: 'text-blue-500',
  artistic_systems: 'text-rose-500',
  neuro: 'text-violet-500',
  automation: 'text-cyan-500',
  business: 'text-orange-500',
  personal_os: 'text-teal-500',
  convergence: 'text-slate-500',
};

export function Navigation({ onSelectDocument, selectedPath, isDarkMode = false }: NavigationProps) {
  const [documents, setDocuments] = useState<CodexDocument[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/codex', '/codex/root', '/codex/council', '/codex/artistic_systems']));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const buildTree = (): TreeNode[] => {
    const docsMap = new Map<string | null, CodexDocument[]>();

    documents.forEach(doc => {
      const parentId = doc.parent_id;
      if (!docsMap.has(parentId)) {
        docsMap.set(parentId, []);
      }
      docsMap.get(parentId)!.push(doc);
    });

    const buildNodes = (parentId: string | null): TreeNode[] => {
      const children = docsMap.get(parentId) || [];
      return children
        .sort((a, b) => a.order - b.order)
        .map(doc => ({
          document: doc,
          children: buildNodes(doc.id),
        }));
    };

    return buildNodes(null);
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const TreeNodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedFolders.has(node.document.path);
    const isSelected = selectedPath === node.document.path;
    const iconColor = categoryIcons[node.document.category] || 'text-gray-500';

    return (
      <div>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleFolder(node.document.path);
            }
            onSelectDocument(node.document.path);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 group
            ${isSelected
              ? isDarkMode
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-blue-50 text-blue-700'
              : isDarkMode
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          style={{ paddingLeft: `${12 + level * 14}px` }}
        >
          <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
            {hasChildren ? (
              <ChevronDown className={`w-4 h-4 flex-shrink-0 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
            ) : (
              <div className="w-4" />
            )}
          </span>
          {hasChildren ? (
            <Folder className={`w-4 h-4 flex-shrink-0 ${iconColor} transition-transform group-hover:scale-110`} />
          ) : (
            <BookOpen className={`w-4 h-4 flex-shrink-0 ${iconColor} transition-transform group-hover:scale-110`} />
          )}
          <span className="truncate font-medium">{node.document.title}</span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-200 ease-out
            ${hasChildren && isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          {node.children.map(child => (
            <TreeNodeComponent key={child.document.id} node={child} level={level + 1} />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex-1 p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const tree = buildTree();

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {tree.map(node => (
        <TreeNodeComponent key={node.document.id} node={node} />
      ))}
    </div>
  );
}
