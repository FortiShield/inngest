# Inngest Next.js Migration - Detailed Audit

## Current State Analysis

### Design System Foundation (Existing)
- **Tailwind CSS**: ✅ Already configured with comprehensive custom theme
- **Color System**: ✅ Highly sophisticated with 90+ design tokens (primary, secondary, tertiary, quaternary, accent, status colors)
- **Dark Mode**: ✅ Fully implemented with CSS variables
- **Typography**: Custom fonts (CircularXX, CircularXXMono) integrated
- **Custom Utilities**: Extensive keyframes, animations, shadows, gradients
- **Plugin Support**: headlessui plugin already configured

### Component Library Status
- **Location**: `apps/ui/packages/components/src`
- **Framework**: React (headless/framework agnostic)
- **UI Patterns**: Custom components built on Tailwind utilities
- **Current Stack**: Tanstack Start (React Router) + Vite
- **Key Components Identified**:
  - Button (with variants: kind, appearance, size)
  - Tabs, DatePicker, CopyButton
  - Tooltip, Spinner, RefreshButton
  - InvokeButton, RerunButton
  - Alert, Modal, Dropdown
  - Table, Form components
  - 150+ total components

### Dashboard Application
- **Current**: Tanstack Start with Vite
- **Routing**: TanStack Router (file-based)
- **Data**: GraphQL with urql client
- **Auth**: Clerk
- **Styling**: Tailwind + custom components
- **State**: RTK Query (Redux Toolkit Query)
- **Location**: `apps/ui/apps/dashboard`

### Dev Server UI Application
- **Current**: Tanstack Start with Vite
- **API**: Proxied to Go dev server (port 8288)
- **State Management**: RTK Query + Redux
- **Routing**: TanStack Router
- **Location**: `apps/ui/apps/dev-server-ui`

### Monorepo Structure
```
inngest/
├── apps/
│   └── ui/
│       ├── apps/
│       │   ├── dashboard/          (Tanstack Start → Next.js)
│       │   ├── dev-server-ui/      (Tanstack Start → Next.js)
│       │   └── support/
│       └── packages/
│           ├── components/          (Shared UI library)
│           └── other-packages/
├── examples/                        (13+ example frameworks)
└── ...
```

---

## Migration Strategy

### Phase 1: Design System Foundation (No Breaking Changes)

#### 1.1 Audit & Enhance Tailwind Configuration
**Current State**: ✅ Excellent configuration already exists
**Actions**:
- Create v0-optimized preset configuration
- Add shadcn/ui compatibility layer
- Document all design tokens
- Create `design-system.md` documentation
- Set up CSS variable optimization for v0 generation

**Files to Modify**:
- `apps/ui/packages/components/tailwind.config.ts` (enhance, don't replace)
- Create: `apps/ui/packages/components/src/styles/design-tokens.ts`
- Create: `apps/ui/design-system.md`

#### 1.2 Component Library Analysis & Mapping
**Goal**: Identify which components can be replaced with shadcn/ui equivalents

**Actions**:
- Audit all 150+ components for shadcn/ui compatibility
- Create component migration mapping
- Identify business-specific vs generic components
- Document component categories:
  - **Keep as-is**: Business logic components, specialized Inngest UI
  - **Refactor to shadcn/ui**: Generic components (Button, Input, Dialog, etc.)
  - **Enhance**: Add v0 metadata and documentation
  - **Create new**: Missing shadcn/ui components

**Output Files**:
- `apps/ui/COMPONENT_AUDIT.md` (detailed mapping)
- `apps/ui/packages/components/REFACTORING_PLAN.md`

#### 1.3 Component AI-Friendliness Enhancement
**Goal**: Make components generatable and maintainable by v0

**Actions for Each Component**:
- ✅ Add TypeScript interfaces with JSDoc comments
- ✅ Separate presentational from business logic
- ✅ Use compound component patterns where appropriate
- ✅ Export standalone utilities
- ✅ Create .stories.tsx files for visual reference
- ✅ Document prop variations and usage patterns

**Pattern Template**:
```
Component/
├── Component.tsx (main export, ~50-100 lines)
├── Component.stories.tsx (Storybook stories)
├── types.ts (TypeScript interfaces)
├── constants.ts (enum/const values)
├── utils.ts (helper functions)
└── Component.test.tsx (unit tests)
```

**Files to Create/Modify**:
- Refactor ~50 most-used components first
- Add Storybook configuration
- Create component index file

---

### Phase 2: Dashboard Migration to Next.js 16

#### 2.1 Project Scaffold (New Next.js 16 App)
**Location**: `apps/ui/apps/dashboard-next/`

**Configuration**:
- Next.js 16 with App Router
- TypeScript strict mode
- Path aliases: `@/*`, `@/components/*`, `@/lib/*`
- Turbopack as bundler (default in Next.js 16)
- React Compiler (optional but recommended)

**Initial Setup**:
```
dashboard-next/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── workflows/
│   │   ├── runs/
│   │   └── settings/
│   └── api/
│       └── graphql/ (proxy endpoint)
├── components/
├── lib/
│   ├── graphql/
│   ├── utils/
│   └── hooks/
├── public/
├── .env.local (environment variables)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

#### 2.2 Routing Migration
**Map Tanstack routes → Next.js App Router**:

Current Tanstack routes → Next.js equivalent:
- `/` → `app/page.tsx`
- `/auth/*` → `app/(auth)/*`
- `/dashboard` → `app/(dashboard)/page.tsx`
- `/dashboard/workflows` → `app/(dashboard)/workflows/page.tsx`
- `/dashboard/workflows/:id` → `app/(dashboard)/workflows/[id]/page.tsx`
- `/dashboard/runs/:id` → `app/(dashboard)/runs/[id]/page.tsx`

#### 2.3 Data Fetching Migration
**GraphQL Integration**:
- Keep urql GraphQL client (compatible with Next.js)
- Implement Server Components for initial data load
- Use React Query for client-side caching
- SWR for real-time updates where needed

**Pattern**:
```typescript
// Server Component (initial fetch)
async function WorkflowsList() {
  const data = await fetchWorkflows();
  return <WorkflowsClient initialData={data} />
}

// Client Component (interactive, real-time)
'use client'
function WorkflowsClient({ initialData }) {
  const { data } = useSWR('/api/workflows', fetcher, { fallbackData: initialData })
  return <List data={data} />
}
```

#### 2.4 State Management
**Strategy**:
- Remove Redux/RTK Query where possible
- Use React Context for app-wide state (auth, theme)
- Use React Query for server state
- Use local state for component state

#### 2.5 Authentication
**Clerk Integration**:
- Update `middleware.ts` for App Router protection
- Migrate Clerk hooks to Next.js equivalents
- Update environment variables

---

### Phase 3: Dev Server UI Migration to Next.js 16

#### 3.1 Similar to Dashboard but with Specific Needs
**Key Differences**:
- Dev server API proxying (port 8288 → Next.js API routes)
- Local-only application (may not need Clerk)
- Real-time WebSocket connection to dev server
- Complex state for event flows and logs

#### 3.2 API Route Proxy
```typescript
// app/api/[...path]/route.ts
export async function GET(request: Request) {
  const { pathname, search } = new URL(request.url);
  const path = pathname.replace('/api/', '');
  
  const response = await fetch(`http://localhost:8288/${path}${search}`, {
    method: 'GET',
    headers: request.headers,
  });
  
  return response;
}
```

---

### Phase 4: Component Library Optimization

#### 4.1 shadcn/ui Integration
**Steps**:
1. Initialize shadcn/ui in Dashboard and Dev Server UI apps
2. Import shadcn components directly in apps (not from shared lib yet)
3. Create wrapper components for project-specific customizations
4. Document shadcn component usage across apps

#### 4.2 Shared Component Updates
**Goal**: Export both custom AND shadcn/ui components from shared lib

**New Structure**:
```
@inngest/components/
├── src/
│   ├── custom/          (Inngest-specific)
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── ...
│   ├── ui/              (Re-exports shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── index.ts         (main export)
│   └── styles/
└── ...
```

#### 4.3 v0 Metadata & Documentation
**Add to Components**:
- Component category tags
- Usage examples
- Prop documentation
- Variant showcase
- Accessibility notes

---

## Risk Assessment & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Large migration scope** | High | Modular phases, parallel development, safety valve (keep old apps) |
| **GraphQL compatibility** | Medium | Extensive testing, urql remains compatible |
| **State management complexity** | High | Phased migration from Redux → React Context/Query |
| **Performance regression** | Medium | Detailed benchmarking, Server Components optimization |
| **Component API changes** | Medium | Wrapper components maintain backward compatibility |
| **Clerk integration issues** | Low | Well-documented, proven in Next.js ecosystem |

---

## Success Criteria Checklist

- [ ] Tailwind configuration v0-optimized
- [ ] All 150+ components audited and categorized
- [ ] 50+ most-used components refactored for v0
- [ ] Dashboard fully migrated to Next.js 16
- [ ] 100% feature parity with Tanstack version
- [ ] Dev Server UI fully migrated
- [ ] GraphQL working seamlessly
- [ ] Authentication maintained
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Documentation complete
- [ ] v0 can generate/modify components successfully

---

## Implementation Notes

### Key Files to Monitor
- `apps/ui/packages/components/tailwind.config.ts` - Design system source of truth
- `apps/ui/packages/components/src/` - Component library
- `apps/ui/apps/dashboard/` - Current dashboard (reference)
- `apps/ui/apps/dashboard-next/` - New Next.js dashboard (target)
- Root `package.json` - Monorepo dependencies

### Migration Command Reference
(Will be documented separately)

### Rollback Plan
- Keep both Tanstack and Next.js apps running
- Gradual DNS switchover
- Easy rollback if issues discovered
