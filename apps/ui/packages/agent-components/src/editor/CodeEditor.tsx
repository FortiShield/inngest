import React, { useState, useCallback, useRef } from 'react';
import { Copy, Check, History, Save } from 'lucide-react';
import { FileVersion, CodeEdit } from '../types/index';

interface CodeEditorProps {
  filePath: string;
  language?: string;
  initialContent?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  readOnly?: boolean;
  showLineNumbers?: boolean;
}

export function CodeEditor({
  filePath,
  language = 'typescript',
  initialContent = '',
  onChange,
  onSave,
  readOnly = false,
  showLineNumbers = true,
}: CodeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      onChange?.(newContent);
    },
    [onChange]
  );

  const handleSave = useCallback(() => {
    // Create version history entry
    const newVersion: FileVersion = {
      id: `v-${Date.now()}`,
      path: filePath,
      version: versions.length + 1,
      content,
      timestamp: new Date(),
      author: 'Agent',
      message: 'Auto-save',
    };

    setVersions((prev) => [...prev, newVersion]);
    onSave?.(content);
  }, [content, filePath, versions.length, onSave]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  }, [content]);

  const restoreVersion = useCallback((version: FileVersion) => {
    setContent(version.content);
    onChange?.(version.content);
    setShowVersionHistory(false);
  }, [onChange]);

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      typescript: 'text-blue-600',
      javascript: 'text-yellow-600',
      python: 'text-blue-500',
      java: 'text-red-600',
      rust: 'text-orange-600',
      go: 'text-cyan-600',
      sql: 'text-purple-600',
      html: 'text-red-500',
      css: 'text-blue-400',
      json: 'text-gray-600',
    };
    return colors[lang] || 'text-gray-600';
  };

  const lineCount = content.split('\n').length;
  const charCount = content.length;

  return (
    <div className="flex flex-col h-full rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{filePath}</p>
            <p className={`text-xs ${getLanguageColor(language)}`}>{language}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <button
                onClick={handleSave}
                title="Save (Ctrl+S)"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
              >
                <Save className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                title="Version History"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
              >
                <History className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}

          <button
            onClick={copyToClipboard}
            title="Copy (Ctrl+C)"
            className="p-2 hover:bg-gray-200 rounded transition-colors"
          >
            {copiedContent ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Version History Panel */}
      {showVersionHistory && versions.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50 p-3 max-h-40 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-700 mb-2">Version History</p>
          <div className="space-y-2">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-gray-300"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">
                    v{version.version}
                  </p>
                  <p className="text-xs text-gray-600">
                    {version.timestamp.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => restoreVersion(version)}
                  className="ml-2 text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden flex">
        {showLineNumbers && (
          <div className="bg-gray-100 border-r border-gray-200 px-3 py-2 font-mono text-xs text-gray-600 overflow-hidden">
            {Array.from({ length: lineCount }, (_, i) => i + 1).map((line) => (
              <div key={line} className="h-6 leading-6">
                {line}
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              handleSave();
            }
          }}
          readOnly={readOnly}
          className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
            readOnly ? 'bg-gray-50 text-gray-600' : 'bg-white text-gray-900'
          }`}
          style={{ lineHeight: '1.5' }}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
        <div className="space-x-4">
          <span>{lineCount} lines</span>
          <span>{charCount} characters</span>
        </div>
        {versions.length > 0 && <span>{versions.length} saved versions</span>}
      </div>
    </div>
  );
}
