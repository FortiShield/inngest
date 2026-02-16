import React, { useState, useCallback, useEffect } from 'react';
import { GitBranch, GitCommit, Copy, Check } from 'lucide-react';
import { usePromptStore } from '../hooks/usePromptStore';
import { useTokenCounter } from '../hooks/useTokenCounter';
import { GitContext } from '../types/index';

interface GitContextViewerProps {
  onContextAdded?: (context: GitContext) => void;
}

interface GitInfo {
  branch: string;
  commit: string;
  diff?: string;
  commits?: GitCommit[];
  status?: GitStatus;
  error?: string;
}

interface GitCommit {
  hash: string;
  author: string;
  message: string;
  date: Date;
}

interface GitStatus {
  modified: string[];
  untracked: string[];
  staged: string[];
}

export function GitContextViewer({ onContextAdded }: GitContextViewerProps) {
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'diff' | 'commits' | 'status'>('diff');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { addContext } = usePromptStore();
  const { estimateCodeTokens } = useTokenCounter();

  const loadGitInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call backend API to get git info
      const response = await fetch('/api/git/info');
      if (response.ok) {
        const data = await response.json();
        setGitInfo(data);
      } else {
        setGitInfo({
          branch: 'unknown',
          commit: 'unknown',
          error: 'Failed to load git information',
        });
      }
    } catch (error) {
      setGitInfo({
        branch: 'unknown',
        commit: 'unknown',
        error: 'Git information not available',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGitInfo();
  }, [loadGitInfo]);

  const addGitContext = useCallback(
    (type: 'diff' | 'commits' | 'status') => {
      if (!gitInfo) return;

      let content = '';
      let label = '';

      if (type === 'diff' && gitInfo.diff) {
        content = gitInfo.diff;
        label = `Git Diff (${gitInfo.branch})`;
      } else if (type === 'commits' && gitInfo.commits) {
        content = gitInfo.commits
          .map(
            (commit) =>
              `${commit.hash} - ${commit.author}\n${commit.message}\nDate: ${commit.date.toISOString()}`
          )
          .join('\n\n');
        label = `Git Commits (${gitInfo.branch})`;
      } else if (type === 'status' && gitInfo.status) {
        content = `Modified files:\n${gitInfo.status.modified.join('\n')}\n\nStaged files:\n${gitInfo.status.staged.join('\n')}\n\nUntracked files:\n${gitInfo.status.untracked.join('\n')}`;
        label = `Git Status (${gitInfo.branch})`;
      } else {
        return;
      }

      const tokens = estimateCodeTokens(content);
      const gitContext: GitContext = {
        branch: gitInfo.branch,
        commit: gitInfo.commit,
        diff: gitInfo.diff,
        commitMessage: gitInfo.commits?.[0]?.message,
        author: gitInfo.commits?.[0]?.author,
        timestamp: new Date(),
      };

      addContext({
        id: `git-${Date.now()}-${type}`,
        type: 'git',
        label,
        content,
        tokens,
        metadata: {
          branch: gitInfo.branch,
          commit: gitInfo.commit,
          contextType: type,
        },
      });

      onContextAdded?.(gitContext);
    },
    [gitInfo, addContext, estimateCodeTokens, onContextAdded]
  );

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-center gap-3">
        <div className="animate-spin">
          <GitBranch className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-sm text-green-700">Loading git information...</p>
      </div>
    );
  }

  if (!gitInfo) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-600">Git information not available</p>
      </div>
    );
  }

  if (gitInfo.error) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-700">{gitInfo.error}</p>
        <button
          onClick={loadGitInfo}
          className="mt-2 text-sm text-yellow-600 hover:text-yellow-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
            <GitBranch className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Git Context</p>
            <p className="text-xs text-green-600">
              {gitInfo.branch} @ {gitInfo.commit.slice(0, 7)}
            </p>
          </div>
        </div>
        <button
          onClick={loadGitInfo}
          className="text-xs px-2 py-1 rounded bg-white text-gray-700 hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          {(['diff', 'commits', 'status'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm px-3 py-1 rounded capitalize ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'diff' && gitInfo.diff && (
          <div className="bg-white rounded p-3 max-h-48 overflow-y-auto">
            <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words">
              {gitInfo.diff.slice(0, 1000)}
              {gitInfo.diff.length > 1000 && '...'}
            </pre>
            <button
              onClick={() => addGitContext('diff')}
              className="mt-2 text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 w-full"
            >
              Add diff to context
            </button>
          </div>
        )}

        {activeTab === 'commits' && gitInfo.commits && (
          <div className="bg-white rounded p-3 max-h-48 overflow-y-auto space-y-2">
            {gitInfo.commits.slice(0, 5).map((commit) => (
              <div key={commit.hash} className="pb-2 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-mono text-gray-500">
                      {commit.hash.slice(0, 7)}
                    </p>
                    <p className="text-sm text-gray-900">{commit.message}</p>
                    <p className="text-xs text-gray-600">
                      {commit.author} • {commit.date.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(commit.message, `commit-${commit.hash}`)
                    }
                    className="p-1"
                  >
                    {copiedId === `commit-${commit.hash}` ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => addGitContext('commits')}
              className="mt-2 text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 w-full"
            >
              Add commits to context
            </button>
          </div>
        )}

        {activeTab === 'status' && gitInfo.status && (
          <div className="bg-white rounded p-3 space-y-2">
            {gitInfo.status.modified.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700">Modified</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {gitInfo.status.modified.map((file) => (
                    <li key={file} className="truncate">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {gitInfo.status.staged.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700">Staged</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {gitInfo.status.staged.map((file) => (
                    <li key={file} className="truncate">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={() => addGitContext('status')}
              className="mt-2 text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 w-full"
            >
              Add status to context
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
