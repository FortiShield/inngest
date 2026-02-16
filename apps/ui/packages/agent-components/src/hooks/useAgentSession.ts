import { create } from 'zustand';
import { AgentSession, AgentMessage, CodeEdit, ReviewComment, PromptContext } from '../types/index';

interface AgentSessionStore {
  sessions: Map<string, AgentSession>;
  activeSessionId: string | null;
  createSession: (name: string) => string;
  deleteSession: (id: string) => void;
  switchSession: (id: string) => void;
  getActiveSession: () => AgentSession | null;
  addMessage: (sessionId: string, message: AgentMessage) => void;
  addContextHistory: (sessionId: string, context: PromptContext) => void;
  addFileChange: (sessionId: string, change: CodeEdit) => void;
  addReviewComment: (sessionId: string, comment: ReviewComment) => void;
  getSessionMessages: (sessionId: string) => AgentMessage[];
  clearSession: (sessionId: string) => void;
}

export const useAgentSession = create<AgentSessionStore>((set, get) => ({
  sessions: new Map(),
  activeSessionId: null,

  createSession: (name: string) => {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSession: AgentSession = {
      id,
      name,
      messages: [],
      contextHistory: [],
      fileChanges: [],
      reviewComments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => {
      const newSessions = new Map(state.sessions);
      newSessions.set(id, newSession);
      return {
        sessions: newSessions,
        activeSessionId: state.activeSessionId || id,
      };
    });

    return id;
  },

  deleteSession: (id: string) => {
    set((state) => {
      const newSessions = new Map(state.sessions);
      newSessions.delete(id);
      const activeId = state.activeSessionId === id ? null : state.activeSessionId;
      return {
        sessions: newSessions,
        activeSessionId: activeId,
      };
    });
  },

  switchSession: (id: string) => {
    set((state) => {
      if (state.sessions.has(id)) {
        return { activeSessionId: id };
      }
      return state;
    });
  },

  getActiveSession: () => {
    const { sessions, activeSessionId } = get();
    if (!activeSessionId) return null;
    return sessions.get(activeSessionId) || null;
  },

  addMessage: (sessionId: string, message: AgentMessage) => {
    set((state) => {
      const session = state.sessions.get(sessionId);
      if (!session) return state;

      const newSessions = new Map(state.sessions);
      newSessions.set(sessionId, {
        ...session,
        messages: [...session.messages, message],
        updatedAt: new Date(),
      });

      return { sessions: newSessions };
    });
  },

  addContextHistory: (sessionId: string, context: PromptContext) => {
    set((state) => {
      const session = state.sessions.get(sessionId);
      if (!session) return state;

      const newSessions = new Map(state.sessions);
      newSessions.set(sessionId, {
        ...session,
        contextHistory: [...session.contextHistory, context],
        updatedAt: new Date(),
      });

      return { sessions: newSessions };
    });
  },

  addFileChange: (sessionId: string, change: CodeEdit) => {
    set((state) => {
      const session = state.sessions.get(sessionId);
      if (!session) return state;

      const newSessions = new Map(state.sessions);
      newSessions.set(sessionId, {
        ...session,
        fileChanges: [...session.fileChanges, change],
        updatedAt: new Date(),
      });

      return { sessions: newSessions };
    });
  },

  addReviewComment: (sessionId: string, comment: ReviewComment) => {
    set((state) => {
      const session = state.sessions.get(sessionId);
      if (!session) return state;

      const newSessions = new Map(state.sessions);
      newSessions.set(sessionId, {
        ...session,
        reviewComments: [...session.reviewComments, comment],
        updatedAt: new Date(),
      });

      return { sessions: newSessions };
    });
  },

  getSessionMessages: (sessionId: string) => {
    const { sessions } = get();
    const session = sessions.get(sessionId);
    return session?.messages || [];
  },

  clearSession: (sessionId: string) => {
    set((state) => {
      const session = state.sessions.get(sessionId);
      if (!session) return state;

      const newSessions = new Map(state.sessions);
      newSessions.set(sessionId, {
        ...session,
        messages: [],
        contextHistory: [],
        fileChanges: [],
        reviewComments: [],
        updatedAt: new Date(),
      });

      return { sessions: newSessions };
    });
  },
}));
