export interface ContextItem {
  id: string;
  type: 'file' | 'image' | 'git' | 'voice' | 'custom';
  label: string;
  content: string | Buffer;
  metadata?: Record<string, unknown>;
  tokens?: number;
  pinned?: boolean;
}

export interface PromptContext {
  items: ContextItem[];
  totalTokens: number;
  maxTokens: number;
  isPinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileReference {
  path: string;
  name: string;
  extension: string;
  size: number;
  content?: string;
  language?: string;
}

export interface GitContext {
  branch: string;
  commit: string;
  diff?: string;
  commitMessage?: string;
  author?: string;
  timestamp?: Date;
}

export interface VoiceTranscription {
  id: string;
  text: string;
  language: string;
  confidence: number;
  duration: number;
  timestamp: Date;
}

export interface ImageAttachment {
  id: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedAt: Date;
}

export interface CodeEdit {
  fileId: string;
  path: string;
  originalContent: string;
  newContent: string;
  diff: string;
  timestamp: Date;
}

export interface FileVersion {
  id: string;
  path: string;
  version: number;
  content: string;
  timestamp: Date;
  author?: string;
  message?: string;
}

export interface LineComment {
  id: string;
  fileId: string;
  lineNumber: number;
  text: string;
  author: string;
  createdAt: Date;
  resolved: boolean;
  replies: LineComment[];
}

export interface CodeDiff {
  id: string;
  fileId: string;
  path: string;
  oldContent: string;
  newContent: string;
  additions: number;
  deletions: number;
  changes: DiffLine[];
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  lineNumber: number;
  content: string;
  oldLineNumber?: number;
}

export interface ReviewComment {
  id: string;
  diffId: string;
  lineNumber: number;
  text: string;
  author: string;
  status: 'pending' | 'resolved' | 'rejected';
  suggestions?: CodeSuggestion[];
  createdAt: Date;
}

export interface CodeSuggestion {
  id: string;
  fileId: string;
  lineNumber: number;
  originalCode: string;
  suggestedCode: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface AgentSession {
  id: string;
  name: string;
  messages: AgentMessage[];
  contextHistory: PromptContext[];
  fileChanges: CodeEdit[];
  reviewComments: ReviewComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  context?: PromptContext;
  codeChanges?: CodeEdit[];
  plan?: AgentPlan;
  timestamp: Date;
}

export interface AgentPlan {
  id: string;
  title: string;
  steps: PlanStep[];
  estimatedTokens: number;
  status: 'draft' | 'approved' | 'executing' | 'completed';
  createdAt: Date;
}

export interface PlanStep {
  id: string;
  index: number;
  title: string;
  description: string;
  inputs?: Record<string, unknown>;
  expectedOutput?: string;
  status: 'pending' | 'approved' | 'skipped' | 'executing' | 'completed' | 'failed';
  error?: string;
}

export interface ExecutionResult {
  stepId: string;
  status: 'success' | 'failure';
  output: string;
  error?: string;
  artifacts?: CodeEdit[];
  duration: number;
}

export interface SandboxExecution {
  id: string;
  code: string;
  language: string;
  environment?: Record<string, string>;
  timeout?: number;
  result?: ExecutionResult;
  logs: string[];
  errors: string[];
  startedAt: Date;
  completedAt?: Date;
}

export interface SecurityScan {
  id: string;
  codeId: string;
  vulnerabilities: Vulnerability[];
  score: number;
  timestamp: Date;
}

export interface Vulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  line: number;
  suggestion?: string;
  cve?: string;
}

export type ContentProcessor = (content: string) => Promise<ContextItem>;
export type TokenCounter = (content: string) => number;
export type EmbeddingGenerator = (text: string) => Promise<number[]>;
