import React, { useState, useCallback } from 'react';
import { usePromptStore } from '../hooks/usePromptStore';
import { useTokenCounter } from '../hooks/useTokenCounter';

interface PromptEditorProps {
  onSubmit?: (prompt: string) => void;
  placeholder?: string;
  maxLength?: number;
  showTokenCount?: boolean;
  showCharCount?: boolean;
}

export function PromptEditor({
  onSubmit,
  placeholder = 'Enter your prompt for the agent...',
  maxLength = 5000,
  showTokenCount = true,
  showCharCount = true,
}: PromptEditorProps) {
  const [prompt, setPrompt] = useState('');
  const context = usePromptStore((state) => state.context);
  const { estimateTokens } = useTokenCounter();

  const promptTokens = estimateTokens(prompt);
  const contextTokens = context.totalTokens;
  const totalTokens = promptTokens + contextTokens;
  const charCount = prompt.length;
  const percentFilled = (totalTokens / context.maxTokens) * 100;

  const handleSubmit = useCallback(() => {
    if (prompt.trim() && onSubmit) {
      onSubmit(prompt);
      setPrompt('');
    }
  }, [prompt, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full resize-none border-0 bg-transparent text-sm focus:outline-none"
          rows={6}
          disabled={totalTokens >= context.maxTokens}
        />
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {showCharCount && (
              <span>
                {charCount} / {maxLength} chars
              </span>
            )}

            {showTokenCount && (
              <>
                <span>
                  Prompt: {promptTokens} tokens
                </span>
                <span>
                  Context: {contextTokens} tokens
                </span>
                <span className={totalTokens >= context.maxTokens ? 'text-red-600' : ''}>
                  Total: {totalTokens} / {context.maxTokens} tokens
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || totalTokens >= context.maxTokens}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send to Agent
          </button>
        </div>

        {showTokenCount && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                percentFilled >= 100 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(percentFilled, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
