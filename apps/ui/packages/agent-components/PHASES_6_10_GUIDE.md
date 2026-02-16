# Phases 6-10 Implementation Guide

## Phase 6: Streaming Support and Sandbox Integration

### 6.1 Streaming API Implementation
- Create `/api/agents/execute?stream=true` endpoint
- Implement Server-Sent Events (SSE) for token streaming
- Create `useStreamingAgent` hook for consuming streams
- Add token streaming to CodeEditor component
- Implement progressive code reveal UI

### 6.2 Sandbox Integration
Files to create:
- `src/orchestration/SandboxExecutor.ts`
  - Interface with Docker/isolated runtime
  - Execute code with timeouts and resource limits
  - Capture stdout, stderr, exit codes
  - Return execution results

- `src/orchestration/hooks/useSandboxExecution.ts`
  - Hook for executing code in sandbox
  - Handle streaming output
  - Catch errors and timeouts

### 6.3 Streaming Components
- Create `StreamingCodeEditor` component that shows code as it's generated
- Add progress indicators
- Show execution results in real-time

---

## Phase 7: Dashboard Integration

### 7.1 Create `/dashboard/agents` Route
```
apps/ui/apps/dashboard-next/app/(dashboard)/agents/
├── page.tsx                    # Agent list page
├── [sessionId]/
│   └── page.tsx               # Individual session view
└── components/
    ├── AgentChat.tsx          # Main chat interface
    ├── ContextManager.tsx     # Manage context items
    └── AgentHistory.tsx       # Session history
```

### 7.2 Components to Build
- `AgentChatInterface` - Full chat with context panel
- `SessionManager` - Create/switch/manage sessions
- `ContextUploadArea` - Drag-drop for files/images
- `LiveExecutionViewer` - Show real-time plan execution

### 7.3 API Routes
```
/api/agents/
├── sessions          # Create, list, delete sessions
├── messages          # Send message, get history
├── execute           # Execute prompt (streaming)
├── plan              # Generate plan
└── git/info          # Get git context
```

---

## Phase 8: Dev Server UI Integration

### 8.1 Create New Tab: "AI Collaboration"
```
apps/ui/apps/dev-server-ui-next/app/(dashboard)/
└── ai-collaboration/
    ├── page.tsx
    └── components/
        ├── DevAgentChat.tsx
        ├── LocalFileImporter.tsx
        └── CodeGenPanel.tsx
```

### 8.2 Local File System Access
- Use `useFileSystem` hook for local file access
- Implement drag-drop from filesystem
- Git integration with local repo

### 8.3 Real-time Sync
- WebSocket connection to main dashboard
- Sync code changes bidirectionally
- Share context between dev server and cloud

---

## Phase 9: Standalone Agents Application

### 9.1 Create New App
```
apps/ui/apps/agents-app/
├── app/
│   ├── page.tsx              # Agents marketplace
│   ├── my-agents/           # User's agents
│   ├── chat/
│   │   └── [agentId]/page.tsx
│   └── templates/           # Prompt templates
├── components/
└── public/
```

### 9.2 Features
- Agent marketplace/discovery
- Prompt templates library
- Shared conversation history
- Favorites and ratings
- Export/import workflows

### 9.3 Database Schema (Supabase)
```sql
-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  config JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Agent templates
CREATE TABLE agent_templates (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  system_prompt TEXT,
  tools JSONB,
  tags TEXT[]
);

-- Conversation history
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID,
  agent_id UUID,
  messages JSONB,
  created_at TIMESTAMP
);
```

---

## Phase 10: Security Scanner and Differentiators

### 10.1 AI Security Scanner
File: `src/orchestration/SecurityScanner.ts`

```typescript
class SecurityScanner {
  async scanCode(code: string): Promise<Vulnerability[]>
  async scanForExploits(code: string): Promise<ExploitDetection[]>
  async generateSecurityReport(vulns: Vulnerability[]): Promise<Report>
}
```

Features:
- OWASP Top 10 detection
- Supply chain scanning
- Dependency vulnerability check
- Secrets detection (API keys, tokens)
- Code injection patterns

### 10.2 Vulnerability Auto-Fix
File: `src/orchestration/VulnerabilityFixer.ts`

```typescript
class VulnerabilityFixer {
  async suggestFix(vulnerability: Vulnerability): Promise<CodeSuggestion>
  async applyFix(suggestion: CodeSuggestion): Promise<CodeEdit>
  async validateFix(code: string): Promise<boolean>
}
```

### 10.3 Security UI Components
- `VulnerabilityBadge` - Display issue severity
- `SecurityReport` - Full report viewer
- `AutoFixDialog` - Apply suggested fixes
- `SecurityInlineWarnings` - Show issues in editor

### 10.4 Integration with FortiShield Brand
- Use FortiShield threat-focused messaging
- Highlight security advantages
- Position as AI-powered secure coding
- Market differentiator vs Warp

---

## Implementation Checklist for Remaining Phases

### Phase 6
- [ ] Create `/api/agents/execute` endpoint with streaming
- [ ] Implement SSE responses
- [ ] Create `useStreamingAgent` hook
- [ ] Add streaming UI to CodeEditor
- [ ] Sandbox executor service
- [ ] Error handling for sandbox timeouts

### Phase 7
- [ ] Create dashboard agents route
- [ ] Build AgentChatInterface component
- [ ] SessionManager for multi-session support
- [ ] Context upload UI
- [ ] Connect to backend API
- [ ] Testing with mock data

### Phase 8
- [ ] Add "AI Collaboration" tab to dev server
- [ ] Local file system integration
- [ ] WebSocket sync implementation
- [ ] Test bidirectional code sync
- [ ] Local git context integration

### Phase 9
- [ ] Create standalone agents app
- [ ] Database schema setup
- [ ] Agent discovery/marketplace
- [ ] Prompt templates system
- [ ] Conversation history storage
- [ ] Import/export workflows

### Phase 10
- [ ] Build security scanner
- [ ] OWASP detection patterns
- [ ] Vulnerability database
- [ ] Auto-fix suggestions
- [ ] Security report UI
- [ ] Inline warnings in editor
- [ ] FortiShield branding

---

## Quick Start for Developers

### Setting Up Phase 6
```bash
# Install streaming dependencies
pnpm add eventsource

# Create API route
touch apps/ui/apps/dashboard-next/app/api/agents/execute/route.ts

# Add streaming hook
touch apps/ui/packages/agent-components/src/hooks/useStreamingAgent.ts
```

### Testing Streaming
```typescript
// Example streaming implementation
async function* streamAgentResponse(prompt: string) {
  const response = await fetch('/api/agents/execute?stream=true', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });

  const reader = response.body?.getReader();
  while (true) {
    const { done, value } = await reader?.read() || {};
    if (done) break;
    yield new TextDecoder().decode(value);
  }
}
```

---

## Architecture Continuation

### Streaming Architecture
```
Client                    Server                  Agent
  │                         │                        │
  ├──POST /agents/execute──>│                        │
  │                         ├─────Generate Plan────>│
  │                         │<─────Plan JSON────────│
  │<─SSE (token by token)───│                        │
  │                         ├─Execute Plan Steps───>│
  │<─Live Code Updates──────│                        │
  │                         │<─Artifacts + Results──│
```

### Security Integration
```
Code Generation
  ↓
Security Scanner
  ├─ OWASP Detection
  ├─ Supply Chain Check
  ├─ Secrets Detection
  └─ Exploit Pattern Match
  ↓
Auto-Fix Suggestions
  ├─ Vulnerability Fix
  ├─ Code Hardening
  └─ Best Practice Apply
  ↓
Sandbox Validation
  └─ Execute + Verify
```

---

## Success Metrics for Completion

- All 10 phases implemented
- 100% test coverage for security scanner
- <100ms latency for streaming
- Zero security vulnerabilities in agent output
- Support for 10+ languages
- 50+ vulnerability patterns detected
- <2s plan generation time
- Warp feature parity achieved
- FortiShield differentiation established
