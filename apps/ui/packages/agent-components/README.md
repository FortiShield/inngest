# @inngest/agent-components

Shared component library for Inngest agent collaboration features. This package provides reusable UI components, hooks, and utilities for building agent-powered workflows with rich context, code editing, and review capabilities.

## Features

### Prompt & Rich Context
- **PromptEditor** - Rich text editor with token counting and context awareness
- **ContextPanel** - Display and manage context items (files, images, git, voice)
- Context processor with chunking, deduplication, and token optimization
- Voice transcription support (Wispr Flow)
- Git context viewer (diffs, commits, branches)
- File and image attachments with metadata

### Hooks
- `usePromptStore` - Global state for prompt context
- `useAgentSession` - Session management with message history
- `useContextProcessor` - Process and optimize context before sending to agent
- `useInlineAgentActions` - Right-click context menu for code actions
- `useTokenCounter` - Estimate tokens for various content types

### Types
Complete TypeScript types for all agent features:
- `ContextItem`, `PromptContext`
- `AgentSession`, `AgentMessage`
- `CodeEdit`, `FileVersion`
- `CodeDiff`, `ReviewComment`
- `AgentPlan`, `PlanStep`
- `SecurityScan`, `Vulnerability`

## Installation

```bash
pnpm add @inngest/agent-components
```

## Usage

### Basic Setup

```tsx
import { PromptEditor, ContextPanel, usePromptStore, useAgentSession } from '@inngest/agent-components';

function AgentChat() {
  const { createSession } = useAgentSession();
  
  // Create a new session
  const sessionId = createSession('My Agent Session');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Context Panel */}
      <div className="lg:col-span-1">
        <ContextPanel />
      </div>

      {/* Prompt Editor */}
      <div className="lg:col-span-2">
        <PromptEditor 
          onSubmit={(prompt) => {
            console.log('Send to agent:', prompt);
          }}
        />
      </div>
    </div>
  );
}
```

### Adding Context Items

```tsx
import { usePromptStore } from '@inngest/agent-components';

function FileUpload() {
  const { addContext } = usePromptStore();

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      addContext({
        id: crypto.randomUUID(),
        type: 'file',
        label: file.name,
        content: e.target?.result as string,
        metadata: { size: file.size, type: file.type },
        tokens: 500,
      });
    };
    reader.readAsText(file);
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
    />
  );
}
```

### Processing Context

```tsx
import { useContextProcessor } from '@inngest/agent-components';

function AgentPrompt() {
  const { process } = useContextProcessor({ maxTokens: 8000 });
  const items = usePromptStore((state) => state.context.items);

  const handleProcess = async () => {
    const processed = await process(items);
    console.log('Processed context:', processed);
    // Send to agent...
  };

  return <button onClick={handleProcess}>Process & Send</button>;
}
```

### Inline Agent Actions

```tsx
import { useInlineAgentActions } from '@inngest/agent-components';

function CodeEditor() {
  const { selectedCode, isActionMenuOpen, handleContextMenu, handleAction } = 
    useInlineAgentActions({
      onAction: (action, code) => {
        console.log(`${action.label}:`, code);
      },
    });

  return (
    <div onContextMenu={handleContextMenu} className="p-4 bg-gray-50">
      {/* Show context menu when right-clicking */}
      {isActionMenuOpen && (
        <div className="absolute bg-white border rounded shadow">
          {/* Menu items rendered here */}
        </div>
      )}
    </div>
  );
}
```

## Architecture

### Zustand Stores
- **usePromptStore** - Manages context items, token counts, pinned items
- **useAgentSession** - Manages agent sessions, messages, and history

### Context Processing Pipeline
1. **Normalize** - Handle different content formats (files, images, git, voice)
2. **Deduplicate** - Remove redundant context items
3. **Token Budget** - Optimize to fit within token limits
4. **Embeddings** - Generate semantic embeddings for search (optional)

### Token Counting
- Text: ~1 token per 4 characters
- Code: ~1 token per 3 characters
- Images: ~750 tokens (approximate)
- Voice: Same as text

## Types Reference

See `src/types/index.ts` for complete type definitions.

## Development

```bash
# Build
pnpm run build

# Type check
pnpm run type-check

# Test
pnpm run test

# Watch mode
pnpm run dev
```

## Roadmap

- Phase 2: Voice transcription (Wispr Flow), Git context viewer
- Phase 3: Monaco editor integration, LSP support, file version history
- Phase 4: Diff viewer, line comments, code suggestions
- Phase 5: Agent orchestration, plan mode, streaming
- Phase 6: Sandbox integration, security scanning

## License

Same as Inngest main project
