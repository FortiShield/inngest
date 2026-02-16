import { useState, useCallback } from 'react';
import { ContextItem, PromptContext } from '../types/index';

interface ProcessorConfig {
  maxTokens: number;
  deduplicateContent: boolean;
  enableEmbeddings: boolean;
}

const defaultConfig: ProcessorConfig = {
  maxTokens: 8000,
  deduplicateContent: true,
  enableEmbeddings: false,
};

export function useContextProcessor(config: Partial<ProcessorConfig> = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mergedConfig = { ...defaultConfig, ...config };

  const normalize = useCallback((items: ContextItem[]) => {
    return items.map((item) => ({
      ...item,
      content: typeof item.content === 'string' ? item.content : item.content.toString(),
    }));
  }, []);

  const deduplicate = useCallback((items: ContextItem[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = `${item.type}-${item.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  const optimizeForTokenBudget = useCallback(
    (items: ContextItem[], tokenCount: number) => {
      if (tokenCount <= mergedConfig.maxTokens) {
        return items;
      }

      // Sort by type priority: files > images > git > voice > custom
      const priorityOrder = { file: 0, image: 1, git: 2, voice: 3, custom: 4 };
      const sorted = [...items].sort(
        (a, b) => (priorityOrder[a.type as keyof typeof priorityOrder] || 5) -
                   (priorityOrder[b.type as keyof typeof priorityOrder] || 5)
      );

      let accumulated = 0;
      return sorted.filter((item) => {
        const itemTokens = item.tokens || 0;
        if (accumulated + itemTokens > mergedConfig.maxTokens) {
          return false;
        }
        accumulated += itemTokens;
        return true;
      });
    },
    [mergedConfig.maxTokens]
  );

  const process = useCallback(
    async (items: ContextItem[]): Promise<PromptContext> => {
      setIsProcessing(true);
      setError(null);

      try {
        // Step 1: Normalize content
        let processed = normalize(items);

        // Step 2: Deduplicate if enabled
        if (mergedConfig.deduplicateContent) {
          processed = deduplicate(processed);
        }

        // Step 3: Calculate total tokens
        const totalTokens = processed.reduce((sum, item) => sum + (item.tokens || 0), 0);

        // Step 4: Optimize for token budget
        processed = optimizeForTokenBudget(processed, totalTokens);

        // Step 5: Pin persistent items
        const withPinning = processed.map((item) =>
          item.pinned ? item : item
        );

        return {
          items: withPinning,
          totalTokens: withPinning.reduce((sum, item) => sum + (item.tokens || 0), 0),
          maxTokens: mergedConfig.maxTokens,
          isPinned: withPinning.some((item) => item.pinned),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [normalize, deduplicate, optimizeForTokenBudget, mergedConfig.deduplicateContent, mergedConfig.maxTokens]
  );

  return {
    process,
    isProcessing,
    error,
    normalize,
    deduplicate,
    optimizeForTokenBudget,
  };
}
