import React, { useState, useCallback } from 'react';
import { Plus, Minus, Copy, Check } from 'lucide-react';
import { CodeDiff, DiffLine } from '../types/index';

interface DiffViewerProps {
  diff: CodeDiff;
  onLineComment?: (lineNumber: number) => void;
  onAcceptSuggestion?: (lineNumber: number) => void;
  selectedLines?: number[];
}

export function DiffViewer({
  diff,
  onLineComment,
  onAcceptSuggestion,
  selectedLines = [],
}: DiffViewerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [commentingLine, setCommentingLine] = useState<number | null>(null);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const stats = {
    additions: diff.additions,
    deletions: diff.deletions,
    total: diff.additions + diff.deletions,
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">{diff.path}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Plus className="w-4 h-4 text-green-600" />
              {stats.additions}
            </span>
            <span className="flex items-center gap-1">
              <Minus className="w-4 h-4 text-red-600" />
              {stats.deletions}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="h-1 bg-blue-500 rounded-full"
            style={{ width: `${Math.min((diff.additions / stats.total) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Diff content */}
      <div className="overflow-x-auto font-mono text-sm">
        <table className="w-full border-collapse">
          <tbody>
            {diff.changes.map((line, index) => (
              <DiffLine
                key={index}
                line={line}
                index={index}
                isSelected={selectedLines.includes(index)}
                onComment={() => {
                  onLineComment?.(line.lineNumber);
                  setCommentingLine(line.lineNumber);
                }}
                onCopy={() => copyToClipboard(line.content, `line-${index}`)}
                copiedId={copiedId}
                onAccept={() => onAcceptSuggestion?.(line.lineNumber)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface DiffLineProps {
  line: DiffLine;
  index: number;
  isSelected: boolean;
  onComment: () => void;
  onCopy: () => void;
  copiedId: string | null;
  onAccept: () => void;
}

function DiffLine({
  line,
  index,
  isSelected,
  onComment,
  onCopy,
  copiedId,
  onAccept,
}: DiffLineProps) {
  const bgColor =
    line.type === 'add'
      ? 'bg-green-50 hover:bg-green-100'
      : line.type === 'remove'
        ? 'bg-red-50 hover:bg-red-100'
        : 'bg-gray-50 hover:bg-gray-100';

  const lineNumberColor =
    line.type === 'add'
      ? 'bg-green-100 text-green-700'
      : line.type === 'remove'
        ? 'bg-red-100 text-red-700'
        : 'bg-gray-200 text-gray-600';

  const textColor =
    line.type === 'add'
      ? 'text-green-900'
      : line.type === 'remove'
        ? 'text-red-900'
        : 'text-gray-900';

  const indicator = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' ';
  const indicatorColor =
    line.type === 'add'
      ? 'text-green-600'
      : line.type === 'remove'
        ? 'text-red-600'
        : 'text-gray-400';

  return (
    <>
      <tr className={`${bgColor} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <td className={`${lineNumberColor} px-2 py-1 text-right text-xs font-mono w-12`}>
          {line.oldLineNumber || '-'}
        </td>

        <td className={`${lineNumberColor} px-2 py-1 text-right text-xs font-mono w-12`}>
          {line.lineNumber}
        </td>

        <td className={`px-1 py-1 text-xs font-mono text-center w-6 ${indicatorColor}`}>
          {indicator}
        </td>

        <td className={`px-3 py-1 flex-1 font-mono text-xs ${textColor} whitespace-pre-wrap break-words`}>
          {line.content}
        </td>

        <td className="px-2 py-1 text-right whitespace-nowrap">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onCopy}
              className="p-1 hover:bg-gray-300 rounded"
              title="Copy"
            >
              {copiedId === `line-${line.lineNumber}` ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-600" />
              )}
            </button>

            {line.type === 'add' && (
              <button
                onClick={onAccept}
                className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                title="Accept suggestion"
              >
                Accept
              </button>
            )}

            <button
              onClick={onComment}
              className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
              title="Add comment"
            >
              Comment
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
