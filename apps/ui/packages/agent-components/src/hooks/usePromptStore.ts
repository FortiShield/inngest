import { create } from 'zustand';
import { PromptContext, ContextItem } from '../types/index';

interface PromptStore {
  context: PromptContext;
  isLoading: boolean;
  error: string | null;
  addContext: (item: ContextItem) => void;
  removeContext: (id: string) => void;
  pinContext: (id: string, pinned: boolean) => void;
  clearContext: () => void;
  updateTokens: (count: number) => void;
  setMaxTokens: (count: number) => void;
  getContextTokens: () => number;
}

const initialContext: PromptContext = {
  items: [],
  totalTokens: 0,
  maxTokens: 8000,
  isPinned: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const usePromptStore = create<PromptStore>((set, get) => ({
  context: initialContext,
  isLoading: false,
  error: null,

  addContext: (item: ContextItem) => {
    set((state) => {
      const newItems = [...state.context.items, item];
      const totalTokens = newItems.reduce((sum, i) => sum + (i.tokens || 0), 0);
      return {
        context: {
          ...state.context,
          items: newItems,
          totalTokens,
          updatedAt: new Date(),
        },
      };
    });
  },

  removeContext: (id: string) => {
    set((state) => {
      const newItems = state.context.items.filter((item) => item.id !== id);
      const totalTokens = newItems.reduce((sum, i) => sum + (i.tokens || 0), 0);
      return {
        context: {
          ...state.context,
          items: newItems,
          totalTokens,
          updatedAt: new Date(),
        },
      };
    });
  },

  pinContext: (id: string, pinned: boolean) => {
    set((state) => ({
      context: {
        ...state.context,
        items: state.context.items.map((item) =>
          item.id === id ? { ...item, pinned } : item
        ),
        updatedAt: new Date(),
      },
    }));
  },

  clearContext: () => {
    set({
      context: {
        ...initialContext,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },

  updateTokens: (count: number) => {
    set((state) => ({
      context: {
        ...state.context,
        totalTokens: Math.min(state.context.totalTokens + count, state.context.maxTokens),
        updatedAt: new Date(),
      },
    }));
  },

  setMaxTokens: (count: number) => {
    set((state) => ({
      context: {
        ...state.context,
        maxTokens: count,
        updatedAt: new Date(),
      },
    }));
  },

  getContextTokens: () => {
    const { context } = get();
    return context.items.reduce((sum, item) => sum + (item.tokens || 0), 0);
  },
}));
