import { useCallback } from 'react';

export function useTokenCounter() {
  // Rough estimation: ~4 characters = 1 token for English text
  // This is a simplified approximation
  const estimateTokens = useCallback((text: string): number => {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }, []);

  // More accurate counting for code
  const estimateCodeTokens = useCallback((code: string): number => {
    if (!code) return 0;
    
    // Code tends to have more tokens per character due to symbols
    // Rough estimate: 1 token per 3 characters
    return Math.ceil(code.length / 3);
  }, []);

  // Count tokens for a file based on size and type
  const estimateFileTokens = useCallback((content: string, language?: string): number => {
    if (!content) return 0;

    // Use different ratios based on language
    const isCode = language && ['ts', 'tsx', 'js', 'jsx', 'py', 'java', 'rust', 'go'].includes(language);
    
    if (isCode) {
      return estimateCodeTokens(content);
    }

    return estimateTokens(content);
  }, [estimateTokens, estimateCodeTokens]);

  // Estimate for various content types
  const estimateContextTokens = useCallback((content: string, type: 'file' | 'image' | 'git' | 'voice'): number => {
    switch (type) {
      case 'file':
        return estimateFileTokens(content);
      case 'image':
        // Images: rough estimate 500-1000 tokens depending on complexity
        return 750;
      case 'git':
        // Git diffs and commit info
        return estimateCodeTokens(content);
      case 'voice':
        // Voice transcriptions are usually cheaper
        return estimateTokens(content);
      default:
        return estimateTokens(content);
    }
  }, [estimateFileTokens, estimateCodeTokens, estimateTokens]);

  // Batch process multiple contents
  const countTokens = useCallback((contents: Array<{ text: string; type?: string }>): { total: number; breakdown: number[] } => {
    const breakdown = contents.map(({ text, type }) => {
      if (!type) return estimateTokens(text);
      return estimateContextTokens(text, type as 'file' | 'image' | 'git' | 'voice');
    });

    return {
      total: breakdown.reduce((sum, count) => sum + count, 0),
      breakdown,
    };
  }, [estimateTokens, estimateContextTokens]);

  return {
    estimateTokens,
    estimateCodeTokens,
    estimateFileTokens,
    estimateContextTokens,
    countTokens,
  };
}
