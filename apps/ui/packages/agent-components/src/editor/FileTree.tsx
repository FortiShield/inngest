import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { FileReference } from '../types/index';

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  isOpen?: boolean;
}

interface FileTreeProps {
  nodes: FileTreeNode[];
  onFileSelect?: (file: FileReference) => void;
  selectedPath?: string;
  onFolderToggle?: (path: string) => void;
}

export function FileTree({
  nodes,
  onFileSelect,
  selectedPath,
  onFolderToggle,
}: FileTreeProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const toggleFolder = useCallback(
    (path: string) => {
      const newExpanded = new Set(expandedPaths);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setExpandedPaths(newExpanded);
      onFolderToggle?.(path);
    },
    [expandedPaths, onFolderToggle]
  );

  const handleFileClick = useCallback(
    (node: FileTreeNode) => {
      if (node.type === 'file') {
        onFileSelect?.({
          path: node.path,
          name: node.name,
          extension: node.name.split('.').pop() || '',
          size: 0,
          language: getLanguageFromExtension(node.name),
        });
      }
    },
    [onFileSelect]
  );

  return (
    <div className="flex flex-col h-full rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm font-semibold text-gray-900">Files</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <FileTreeNodeComponent
          nodes={nodes}
          expandedPaths={expandedPaths}
          selectedPath={selectedPath}
          onToggle={toggleFolder}
          onFileClick={handleFileClick}
        />
      </div>
    </div>
  );
}

interface FileTreeNodeComponentProps {
  nodes: FileTreeNode[];
  expandedPaths: Set<string>;
  selectedPath?: string;
  onToggle: (path: string) => void;
  onFileClick: (node: FileTreeNode) => void;
  level?: number;
}

function FileTreeNodeComponent({
  nodes,
  expandedPaths,
  selectedPath,
  onToggle,
  onFileClick,
  level = 0,
}: FileTreeNodeComponentProps) {
  return (
    <div>
      {nodes.map((node) => (
        <div key={node.id}>
          <div
            className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-100 ${
              selectedPath === node.path ? 'bg-blue-50' : ''
            }`}
            style={{ paddingLeft: `${8 + level * 16}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                onToggle(node.path);
              } else {
                onFileClick(node);
              }
            }}
          >
            {node.type === 'folder' ? (
              <>
                {expandedPaths.has(node.path) ? (
                  <>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <Folder className="w-4 h-4 text-blue-600" />
                  </>
                )}
              </>
            ) : (
              <>
                <div className="w-4" />
                <File className="w-4 h-4 text-gray-600" />
              </>
            )}

            <span
              className={`text-sm truncate ${
                selectedPath === node.path ? 'font-semibold text-blue-600' : 'text-gray-700'
              }`}
            >
              {node.name}
            </span>
          </div>

          {node.type === 'folder' && expandedPaths.has(node.path) && node.children && (
            <FileTreeNodeComponent
              nodes={node.children}
              expandedPaths={expandedPaths}
              selectedPath={selectedPath}
              onToggle={onToggle}
              onFileClick={onFileClick}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    java: 'java',
    rs: 'rust',
    go: 'go',
    sql: 'sql',
    html: 'html',
    css: 'css',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    sh: 'shell',
    bash: 'shell',
  };
  return languageMap[ext] || ext;
}
