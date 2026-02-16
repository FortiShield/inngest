# Inngest Next.js Migration - Implementation Checklist

## Phase 1: Design System Foundation ✅ COMPLETE

### Documentation & Analysis
- [x] Create comprehensive migration audit
- [x] Component library analysis (150+ components)
- [x] Design system assessment
- [x] Risk mitigation strategies
- [x] v0 refactoring guide (677 lines)
- [x] Next.js 16 migration guide (649 lines)
- [x] Phase 1 summary document
- [x] Implementation checklist (this document)

### Design System Foundation
- [x] Analyze existing Tailwind configuration
- [x] Document 90+ design tokens
- [x] Review dark mode implementation
- [x] Assess typography setup
- [x] Document custom utilities and animations
- [x] Plan design system enhancements

### Team Preparation
- [x] Create comprehensive documentation
- [x] Document technology decisions
- [x] Plan refactoring phases
- [x] Identify risks and mitigations
- [ ] Schedule team training session
- [ ] Distribute documentation to team

---

## Phase 2: Dashboard Migration to Next.js 16 - STARTING

### 2.1 Project Setup
- [ ] Create Next.js 16 project at `apps/ui/apps/dashboard-next/`
- [ ] Configure TypeScript (strict mode)
- [ ] Set up Tailwind CSS with shared base config
- [ ] Configure path aliases:
  - [ ] `@/*` → root
  - [ ] `@/components/*` → components
  - [ ] `@/lib/*` → lib
  - [ ] `@/hooks/*` → hooks
  - [ ] `@/types/*` → types
- [ ] Update `tsconfig.json` with proper settings
- [ ] Update `next.config.ts` with optimizations
- [ ] Create `.env.local` and `.env.local.example`
- [ ] Install all required dependencies
- [ ] Add package.json scripts (dev, build, start, lint)

### 2.2 Authentication Setup
- [ ] Install Clerk Next.js package
- [ ] Create `middleware.ts` with auth protection
- [ ] Configure route matchers for protected routes
- [ ] Create `ClerkProvider` in root layout
- [ ] Add Clerk environment variables
- [ ] Set up auth callback page
- [ ] Test authentication flow

### 2.3 Root Layout & Infrastructure
- [ ] Create `app/layout.tsx` (root layout)
- [ ] Add ClerkProvider wrapper
- [ ] Add theme provider (next-themes)
- [ ] Add QueryClientProvider (React Query)
- [ ] Set up global styles
- [ ] Configure metadata (title, description, icons)
- [ ] Add favicon
- [ ] Create `app/page.tsx` (home page)
- [ ] Create `app/error.tsx` (error boundary)
- [ ] Create `app/not-found.tsx` (404 page)
- [ ] Create `app/loading.tsx` (loading UI)

### 2.4 GraphQL Integration
- [ ] Install urql and dependencies
- [ ] Create `lib/graphql/client.ts`
- [ ] Set up GraphQL client with auth headers
- [ ] Create `lib/graphql/queries.ts` (common queries)
- [ ] Create `lib/graphql/mutations.ts` (common mutations)
- [ ] Configure GraphQL code generation
- [ ] Generate TypeScript types from GraphQL schema
- [ ] Set up error handling for GraphQL failures
- [ ] Test GraphQL queries in development

### 2.5 API Routes Setup
- [ ] Create `app/api/graphql/route.ts` (GraphQL proxy)
- [ ] Create `app/api/[...path]/route.ts` (catch-all proxy)
- [ ] Set up request forwarding to old API
- [ ] Add authentication to API routes
- [ ] Configure CORS if needed
- [ ] Test API route proxying

### 2.6 Layout Structure
- [ ] Create `app/(auth)/` layout group
  - [ ] Create `app/(auth)/layout.tsx`
  - [ ] Create `app/(auth)/sign-in/page.tsx`
  - [ ] Create `app/(auth)/sign-up/page.tsx`
  - [ ] Create `app/(auth)/callback/page.tsx`

- [ ] Create `app/(dashboard)/` layout group
  - [ ] Create `app/(dashboard)/layout.tsx` (main dashboard layout)
  - [ ] Create `app/(dashboard)/page.tsx` (dashboard home)

- [ ] Create layout components
  - [ ] `components/layout/Header.tsx`
  - [ ] `components/layout/Sidebar.tsx`
  - [ ] `components/layout/Navigation.tsx`
  - [ ] `components/layout/Footer.tsx`

### 2.7 Dashboard Routes
- [ ] `/workflows`
  - [ ] `app/(dashboard)/workflows/page.tsx`
  - [ ] `app/(dashboard)/workflows/[id]/page.tsx`
  - [ ] `app/(dashboard)/workflows/[id]/runs/page.tsx`
  - [ ] `app/(dashboard)/workflows/[id]/settings/page.tsx`

- [ ] `/runs`
  - [ ] `app/(dashboard)/runs/page.tsx`
  - [ ] `app/(dashboard)/runs/[id]/page.tsx`

- [ ] `/functions`
  - [ ] `app/(dashboard)/functions/page.tsx`
  - [ ] `app/(dashboard)/functions/[id]/page.tsx`

- [ ] `/events`
  - [ ] `app/(dashboard)/events/page.tsx`
  - [ ] `app/(dashboard)/events/[id]/page.tsx`

- [ ] `/settings`
  - [ ] `app/(dashboard)/settings/page.tsx`

### 2.8 Component Migration
**High Priority (Week 1)**:
- [ ] Migrate layout components
  - [ ] Header with navigation
  - [ ] Sidebar with menu
  - [ ] Breadcrumb navigation
  - [ ] Footer

- [ ] Migrate core UI components
  - [ ] Button variants
  - [ ] Input fields
  - [ ] Select/Dropdown
  - [ ] Tabs
  - [ ] Dialog/Modal

**Medium Priority (Week 2)**:
- [ ] Migrate dashboard components
  - [ ] WorkflowsList/Table
  - [ ] RunsList/Table
  - [ ] FunctionsList/Table
  - [ ] EventsList/Table

- [ ] Migrate feature components
  - [ ] StatusBadge components
  - [ ] Filter components
  - [ ] Search components
  - [ ] Pagination

**Lower Priority (Week 3+)**:
- [ ] Migrate specialized components
  - [ ] SchemaViewer
  - [ ] CodeEditor
  - [ ] TimelineViewer
  - [ ] LogViewer

### 2.9 Data Fetching & Hooks
- [ ] Create `lib/hooks/useWorkflows.ts`
- [ ] Create `lib/hooks/useRuns.ts`
- [ ] Create `lib/hooks/useFunctions.ts`
- [ ] Create `lib/hooks/useEvents.ts`
- [ ] Create `lib/hooks/useAuth.ts`
- [ ] Create `lib/hooks/useTheme.ts`
- [ ] Implement Server Components for initial data load
- [ ] Implement Client Components for real-time updates
- [ ] Set up error boundaries for each page
- [ ] Configure loading states with Suspense

### 2.10 State Management
- [ ] Create Context for global state:
  - [ ] `lib/contexts/AuthContext.tsx`
  - [ ] `lib/contexts/ThemeContext.tsx`
  - [ ] `lib/contexts/WorkflowContext.tsx` (if needed)

- [ ] Remove Redux dependencies gradually
- [ ] Test state management

### 2.11 Testing & Validation
- [ ] Set up Vitest configuration
- [ ] Create unit tests for utilities
- [ ] Create component tests for key components
- [ ] Create integration tests for main flows:
  - [ ] Sign in / Sign out
  - [ ] View workflows
  - [ ] View runs
  - [ ] Filter and search
  - [ ] Pagination

- [ ] Manual testing on mobile devices
- [ ] Test accessibility (keyboard navigation)
- [ ] Test dark mode toggle
- [ ] Test offline behavior

### 2.12 Performance Optimization
- [ ] Analyze bundle size with `next/bundle-analyzer`
- [ ] Implement code splitting
- [ ] Optimize images
- [ ] Lazy load heavy components
- [ ] Enable React Server Components fully
- [ ] Benchmark performance vs Tanstack version
- [ ] Profile with React DevTools
- [ ] Optimize database queries

### 2.13 Documentation & Knowledge Transfer
- [ ] Document migration decisions
- [ ] Create troubleshooting guide
- [ ] Document API integration
- [ ] Document authentication flow
- [ ] Create developer onboarding guide
- [ ] Record video walkthrough (optional)

### 2.14 Deployment & Launch
- [ ] Configure Vercel deployment
- [ ] Set up environment variables on Vercel
- [ ] Create preview deployments for testing
- [ ] Set up monitoring and error tracking
- [ ] Create deployment runbook
- [ ] Plan gradual rollout/canary deployment
- [ ] Prepare rollback plan

---

## Phase 3: Dev Server UI Migration - PLANNING

### 3.1 Project Setup
- [ ] Create Next.js 16 project at `apps/ui/apps/dev-server-ui-next/`
- [ ] Follow same setup as Dashboard (Phases 2.1-2.4)
- [ ] Configure dev server API proxy to port 8288

### 3.2 Specific Considerations
- [ ] Set up WebSocket connection to dev server
- [ ] Configure real-time updates
- [ ] Handle local-only scenarios
- [ ] Set up file watching/hot reload

### 3.3 Route Structure
- [ ] `/flows` - Event flows list/viewer
- [ ] `/events` - Real-time events
- [ ] `/runs` - Dev server runs
- [ ] `/logs` - Log viewer
- [ ] `/schema` - Schema viewer
- [ ] `/invoke` - Invoke modal/page

### 3.4 Component Migration
- [ ] Same process as Dashboard migration
- [ ] Focus on real-time components
- [ ] Migrate code editor integration
- [ ] Migrate log viewer

### 3.5 Testing & Validation
- [ ] Test against local dev server
- [ ] Test real-time updates
- [ ] Test file watching
- [ ] Performance with large datasets

---

## Phase 4: Component Library Optimization - PLANNING

### 4.1 Component Refactoring
- [ ] Refactor Phase 1 Primitives (HIGH PRIORITY)
  - [ ] Button (structure already good, enhance v0 docs)
  - [ ] Input
  - [ ] Label, Checkbox, Radio
  - [ ] Select/Dropdown
  - [ ] Textarea

- [ ] Refactor Phase 2 Composite Components (HIGH PRIORITY)
  - [ ] Tabs
  - [ ] Accordion
  - [ ] Dialog/Modal
  - [ ] Dropdown Menu
  - [ ] Tooltip
  - [ ] Popover

- [ ] Refactor Phase 3 Feature Components (MEDIUM PRIORITY)
  - [ ] Table (core)
  - [ ] Pagination
  - [ ] StatusBadge
  - [ ] Filter components

- [ ] Refactor Phase 4 Specialized Components (LOWER PRIORITY)
  - [ ] SchemaViewer
  - [ ] CodeEditor
  - [ ] TimelineViewer

### 4.2 shadcn/ui Integration
- [ ] Initialize shadcn/ui in Dashboard
- [ ] Initialize shadcn/ui in Dev Server UI
- [ ] Create compatibility layer in shared components library
- [ ] Update shared components package.json
- [ ] Re-export shadcn/ui components

### 4.3 Component Documentation
- [ ] Add JSDoc comments to all components
- [ ] Create/update Component.stories.tsx files
- [ ] Set up Storybook
- [ ] Document all variants
- [ ] Document accessibility features
- [ ] Create usage examples

### 4.4 Testing
- [ ] Add unit tests for all utilities
- [ ] Add component snapshot tests
- [ ] Add accessibility tests
- [ ] Add visual regression tests (optional)

### 4.5 v0 Metadata
- [ ] Add component categories
- [ ] Add usage examples
- [ ] Add variant documentation
- [ ] Create v0-specific metadata file

---

## Phase 5: Integration & Polish - PLANNING

### 5.1 Monorepo Updates
- [ ] Update root package.json workspace config
- [ ] Configure pnpm workspace
- [ ] Update build scripts
- [ ] Update dev scripts
- [ ] Update CI/CD pipeline

### 5.2 Cross-App Consistency
- [ ] Review design system consistency
- [ ] Test shared components across apps
- [ ] Verify GraphQL codegen works everywhere
- [ ] Test authentication across apps

### 5.3 Comprehensive Testing
- [ ] E2E testing with Playwright
- [ ] Load testing
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Browser compatibility testing
- [ ] Mobile responsiveness testing

### 5.4 Performance Optimization
- [ ] Core Web Vitals optimization
- [ ] Database query optimization
- [ ] Cache strategy optimization
- [ ] Image optimization
- [ ] Bundle size reduction

### 5.5 Documentation
- [ ] Migrate old app README files
- [ ] Create new Next.js setup guide
- [ ] Document component API
- [ ] Create troubleshooting guide
- [ ] Create v0 usage guide

### 5.6 Deployment & Cutover
- [ ] Set up DNS switching plan
- [ ] Create rollback procedures
- [ ] Monitor error rates post-deployment
- [ ] Gather user feedback
- [ ] Decommission old Tanstack apps (after stabilization)

### 5.7 Final Validation
- [ ] Verify all features working
- [ ] Performance benchmarks met
- [ ] Security review complete
- [ ] Accessibility audit passed
- [ ] Documentation complete

---

## Success Criteria Checklist

### Project Completion
- [ ] Phase 1: Design System Foundation - DONE ✅
- [ ] Phase 2: Dashboard Migration - IN PROGRESS
- [ ] Phase 3: Dev Server UI Migration - PENDING
- [ ] Phase 4: Component Library Optimization - PENDING
- [ ] Phase 5: Integration & Polish - PENDING

### Feature Parity
- [ ] 100% of Tanstack Dashboard features working
- [ ] 100% of Tanstack Dev Server UI features working
- [ ] All API integrations working
- [ ] GraphQL queries working
- [ ] Authentication working
- [ ] Routing working

### Code Quality
- [ ] TypeScript strict mode passing
- [ ] ESLint rules passing
- [ ] 0 console errors in production build
- [ ] All tests passing
- [ ] Code coverage >80%

### Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size maintained or reduced
- [ ] Zero performance regression vs Tanstack

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation working
- [ ] Screen reader compatible
- [ ] Color contrast ratios met
- [ ] Form labels properly associated

### Documentation
- [ ] v0 component refactoring guide complete
- [ ] Next.js migration guide complete
- [ ] API documentation updated
- [ ] Developer onboarding guide created
- [ ] Troubleshooting guide created

### Deployment
- [ ] Vercel deployment configured
- [ ] Environment variables set
- [ ] Monitoring and alerting set up
- [ ] CI/CD pipeline updated
- [ ] Rollback plan documented

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Design System Foundation | 3 days | ✅ COMPLETE |
| Phase 2: Dashboard Migration | 7 days | 🔄 IN PROGRESS |
| Phase 3: Dev Server UI Migration | 6 days | ⏳ PENDING |
| Phase 4: Component Optimization | 4 days | ⏳ PENDING |
| Phase 5: Integration & Polish | 4 days | ⏳ PENDING |
| **Total** | **24 days** | - |

---

## Team Assignments

| Task | Assigned To | Status |
|------|------------|--------|
| Documentation review | Product Lead | Pending |
| Next.js setup | Senior Frontend Dev | Pending |
| Component migration | Frontend Dev (2x) | Pending |
| GraphQL integration | Backend/Frontend Dev | Pending |
| Testing & QA | QA Engineer | Pending |
| Deployment | DevOps/Platform | Pending |

---

## Blockers & Dependencies

### Current Blockers
- None identified

### Dependencies
- [ ] GraphQL schema finalized
- [ ] Clerk authentication configured
- [ ] Environment variables documented
- [ ] Design tokens finalized

### External Dependencies
- [ ] Vercel project created
- [ ] GitHub repository access
- [ ] CI/CD pipeline configured
- [ ] Monitoring tools set up

---

## Notes for Team

1. **Keep both apps running**: During migration, keep Tanstack apps running as safety valve
2. **Component-first approach**: Migrate components before pages for better reusability
3. **Test thoroughly**: Each phase should have comprehensive testing
4. **Document decisions**: Keep track of why we made each decision for future reference
5. **Get user feedback**: Early and often during development

---

## Contact & Support

For questions or issues:
- **Technical Lead**: [Name/Contact]
- **Documentation**: See `/MIGRATION_AUDIT.md` and `/NEXTJS_MIGRATION_GUIDE.md`
- **Slack Channel**: #inngest-nextjs-migration

---

**Last Updated**: 2/16/2026
**Status**: Phase 1 Complete - Ready for Phase 2
**Next Review**: When Phase 2 is 50% complete
