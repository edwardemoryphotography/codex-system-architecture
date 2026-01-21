import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Copy, CheckCheck } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isDarkMode?: boolean;
}

export function MarkdownRenderer({ content, isDarkMode = false }: MarkdownRendererProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id);
    } else {
      newCollapsed.add(id);
    }
    setCollapsedSections(newCollapsed);
  };

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const copyCode = async (code: string, blockId: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedBlock(blockId);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const renderInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let keyCounter = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const codeMatch = remaining.match(/`([^`]+)`/);

      let firstMatch: { type: string; match: RegExpMatchArray; index: number } | null = null;

      if (boldMatch && boldMatch.index !== undefined) {
        firstMatch = { type: 'bold', match: boldMatch, index: boldMatch.index };
      }

      if (codeMatch && codeMatch.index !== undefined) {
        if (!firstMatch || codeMatch.index < firstMatch.index) {
          firstMatch = { type: 'code', match: codeMatch, index: codeMatch.index };
        }
      }

      if (!firstMatch) {
        parts.push(remaining);
        break;
      }

      if (firstMatch.index > 0) {
        parts.push(remaining.slice(0, firstMatch.index));
      }

      if (firstMatch.type === 'bold') {
        parts.push(
          <strong key={`bold-${keyCounter++}`} className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {firstMatch.match[1]}
          </strong>
        );
      } else if (firstMatch.type === 'code') {
        parts.push(
          <code key={`code-${keyCounter++}`} className={`px-1.5 py-0.5 rounded text-sm font-mono
            ${isDarkMode ? 'bg-gray-700 text-cyan-400' : 'bg-gray-100 text-gray-800'}
          `}>
            {firstMatch.match[1]}
          </code>
        );
      }

      remaining = remaining.slice(firstMatch.index + firstMatch.match[0].length);
    }

    return <>{parts}</>;
  };

  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;
    let sectionCounter = 0;
    let checkCounter = 0;
    let codeBlockCounter = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('```')) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const code = codeLines.join('\n');
        const blockId = `code-${codeBlockCounter++}`;
        elements.push(
          <div key={blockId} className="relative group my-6">
            {lang && (
              <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-mono rounded-tl-xl rounded-br-lg
                ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}
              `}>
                {lang}
              </div>
            )}
            <button
              onClick={() => copyCode(code, blockId)}
              className={`absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all
                ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
              `}
              title="Copy code"
            >
              {copiedBlock === blockId ? (
                <CheckCheck className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              )}
            </button>
            <pre className={`p-4 pt-10 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed
              ${isDarkMode ? 'bg-gray-800/80 text-gray-100' : 'bg-gray-900 text-gray-100'}
            `}>
              <code>{code}</code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      if (line.startsWith('# ')) {
        const sectionId = `section-${sectionCounter++}`;
        const isCollapsed = collapsedSections.has(sectionId);
        const title = line.slice(2);

        const sectionContent: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('# ')) {
          sectionContent.push(lines[i]);
          i++;
        }

        elements.push(
          <div key={sectionId} className="mb-8">
            <button
              onClick={() => toggleSection(sectionId)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <span className={`transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}>
                <ChevronRight className={`w-6 h-6 transition-colors
                  ${isDarkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}
                `} />
              </span>
              <h1 className={`text-3xl font-bold transition-colors
                ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}
              `}>
                {title}
              </h1>
            </button>
            <div className={`ml-8 mt-4 overflow-hidden transition-all duration-300 ease-out
              ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100'}
            `}>
              {parseContent(sectionContent.join('\n'))}
            </div>
          </div>
        );
        continue;
      }

      if (line.startsWith('## ')) {
        const sectionId = `section-${sectionCounter++}`;
        const isCollapsed = collapsedSections.has(sectionId);
        const title = line.slice(3);

        const sectionContent: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('## ') && !lines[i].startsWith('# ')) {
          sectionContent.push(lines[i]);
          i++;
        }

        elements.push(
          <div key={sectionId} className="mb-6">
            <button
              onClick={() => toggleSection(sectionId)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <span className={`transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}>
                <ChevronRight className={`w-5 h-5 transition-colors
                  ${isDarkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}
                `} />
              </span>
              <h2 className={`text-2xl font-semibold transition-colors
                ${isDarkMode ? 'text-gray-100 group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'}
              `}>
                {title}
              </h2>
            </button>
            <div className={`ml-7 mt-3 overflow-hidden transition-all duration-300 ease-out
              ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100'}
            `}>
              {parseContent(sectionContent.join('\n'))}
            </div>
          </div>
        );
        continue;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className={`text-xl font-semibold mt-6 mb-3
            ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
          `}>
            {line.slice(4)}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith('---')) {
        elements.push(
          <hr key={`hr-${i}`} className={`my-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
        );
        i++;
        continue;
      }

      if (line.startsWith('|')) {
        const tableLines: string[] = [line];
        i++;
        while (i < lines.length && lines[i].startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }

        const rows = tableLines.filter(l => !l.includes('---')).map(l =>
          l.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
        );

        if (rows.length > 0) {
          elements.push(
            <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-xl">
              <table className={`min-w-full divide-y rounded-xl overflow-hidden
                ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}
              `}>
                <thead className={isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}>
                  <tr>
                    {rows[0].map((cell, j) => (
                      <th key={j} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider
                        ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                      `}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {rows.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx} className={`transition-colors
                      ${isDarkMode ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}
                    `}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className={`px-4 py-3 text-sm
                          ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                        `}>
                          {renderInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      if (line.match(/^- \[[ x]\]/)) {
        const checkId = `check-${checkCounter++}`;
        const isCheckedInContent = line.includes('[x]');
        const isChecked = checkedItems.has(checkId) !== isCheckedInContent;
        const text = line.replace(/^- \[[ x]\] /, '');

        elements.push(
          <button
            key={checkId}
            onClick={() => toggleCheck(checkId)}
            className="flex items-center gap-3 py-1.5 w-full text-left group"
          >
            <span className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
              ${isChecked
                ? 'bg-green-500 border-green-500'
                : isDarkMode
                  ? 'border-gray-600 group-hover:border-gray-500'
                  : 'border-gray-300 group-hover:border-gray-400'
              }
            `}>
              {isChecked && <Check className="w-3 h-3 text-white" />}
            </span>
            <span className={`transition-all ${
              isChecked
                ? 'line-through ' + (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                : isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {renderInlineMarkdown(text)}
            </span>
          </button>
        );
        i++;
        continue;
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems: string[] = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          listItems.push(lines[i].slice(2));
          i++;
        }

        elements.push(
          <ul key={`list-${i}`} className="my-4 space-y-2">
            {listItems.map((item, j) => (
              <li key={j} className={`flex items-start gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}
                `} />
                <span>{renderInlineMarkdown(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      if (line.match(/^\d+\. /)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^\d+\. /)) {
          listItems.push(lines[i].replace(/^\d+\. /, ''));
          i++;
        }

        elements.push(
          <ol key={`olist-${i}`} className="my-4 space-y-3">
            {listItems.map((item, j) => (
              <li key={j} className={`flex items-start gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full text-sm font-medium flex items-center justify-center
                  ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}
                `}>
                  {j + 1}
                </span>
                <span className="pt-0.5">{renderInlineMarkdown(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].slice(2));
          i++;
        }

        elements.push(
          <blockquote key={`quote-${i}`} className={`my-6 pl-4 border-l-4 py-4 pr-4 rounded-r-xl
            ${isDarkMode
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-blue-400 bg-blue-50'
            }
          `}>
            <p className={`italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {quoteLines.join(' ')}
            </p>
          </blockquote>
        );
        continue;
      }

      if (line.trim() === '') {
        i++;
        continue;
      }

      elements.push(
        <p key={`p-${i}`} className={`leading-relaxed my-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {renderInlineMarkdown(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  return (
    <div className="prose-custom">
      {parseContent(content)}
    </div>
  );
}
