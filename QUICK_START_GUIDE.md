# Quick Start Guide - Inngest Next.js Migration

Get started with the new Next.js 16 applications in 5 minutes.

## Prerequisites

- Node.js 18.17+ or 20+
- pnpm (recommended) or npm
- Git
- Clerk account (for Dashboard auth)

## Installation

### 1. Install Dependencies

```bash
# From root
pnpm install

# Or from specific app
cd apps/ui/apps/dashboard-next
pnpm install
```

### 2. Environment Setup

#### Dashboard (dashboard-next)
```bash
cd apps/ui/apps/dashboard-next
cp .env.local.example .env.local

# Edit .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:8000
CLERK_SECRET_KEY=your_clerk_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_public_key
```

#### Dev Server UI (dev-server-ui-next)
```bash
cd apps/ui/apps/dev-server-ui-next
cp .env.local.example .env.local

# Edit .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:8288
NEXT_PUBLIC_WS_URL=ws://localhost:8288
```

## Running Locally

### Dashboard Development Server
```bash
cd apps/ui/apps/dashboard-next
pnpm dev
# Runs on http://localhost:3000
```

### Dev Server UI Development Server
```bash
cd apps/ui/apps/dev-server-ui-next
pnpm dev
# Runs on http://localhost:3001 (or next available port)
```

### Both Simultaneously
```bash
# From root (with pnpm workspaces)
pnpm --filter=dashboard-next dev &
pnpm --filter=dev-server-ui-next dev &
```

## Project Structure

```
dashboard-next/
├── app/
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Redirect to /dashboard
│   ├── globals.css           # Global styles
│   ├── (auth)/               # Auth routes (no layout)
│   │   ├── sign-in/page.tsx
│   │   └── layout.tsx
│   └── (dashboard)/          # Protected routes
│       ├── page.tsx          # Dashboard home
│       └── layout.tsx        # Dashboard layout
├── components/
│   ├── layout/               # Layout components
│   └── dashboard/            # Dashboard-specific components
├── lib/
│   └── utils/                # Utility functions
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts

dev-server-ui-next/
├── app/
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles
│   └── providers/            # Provider components
├── components/
│   └── dev-server/           # Dev server components
├── lib/
│   └── utils/                # Utility functions
└── [similar config files]
```

## Key Files to Understand

### Theme System
- `app/globals.css` - Design tokens defined as CSS custom properties
- `tailwind.config.ts` - Extends Tailwind with custom colors
- `app/providers/theme-provider.tsx` - next-themes integration

### Authentication (Dashboard)
- `middleware.ts` - Route protection with Clerk
- `app/(auth)/` - Auth routes
- `app/(dashboard)/` - Protected routes

### Components
- `components/layout/Header.tsx` - Top navigation
- `components/layout/Sidebar.tsx` - Side navigation (dashboard)
- `components/dashboard/DashboardStats.tsx` - Stats cards
- `components/dev-server/DevServerDashboard.tsx` - Dev server main

## Common Tasks

### Create a New Page

```tsx
// app/(dashboard)/workflows/page.tsx
export default function WorkflowsPage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Workflows</h1>
      {/* Content */}
    </main>
  );
}
```

### Create a New Component

```tsx
// components/ui/Badge.tsx
export interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error";
  label: string;
}

export function Badge({ variant = "default", label }: BadgeProps) {
  const variantClass = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-600 text-white",
    error: "bg-red-600 text-white",
  }[variant];

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variantClass}`}>
      {label}
    </span>
  );
}
```

### Add a New API Route

```tsx
// app/api/functions/route.ts
export async function GET() {
  try {
    const functions = await fetchFunctionsFromAPI();
    return Response.json(functions);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch functions" },
      { status: 500 }
    );
  }
}
```

### Use React Query for Data Fetching

```tsx
"use client";

import useSWR from "swr";

export function FunctionsList() {
  const { data: functions, error } = useSWR("/api/functions");

  if (error) return <div>Failed to load</div>;
  if (!functions) return <div>Loading...</div>;

  return (
    <div>
      {functions.map((fn) => (
        <div key={fn.id}>{fn.name}</div>
      ))}
    </div>
  );
}
```

## Code Quality

### Run TypeScript Check
```bash
pnpm type-check
```

### Run Linting
```bash
pnpm lint
```

### Format Code
```bash
pnpm format
```

### Build for Production
```bash
pnpm build
pnpm start
```

## Debugging Tips

### Enable Debug Logging
```tsx
// In component
console.log("[v0] Debug message:", variable);
```

### Check TypeScript Errors
```bash
pnpm tsc --noEmit
```

### View Bundle Size
```bash
pnpm build:analyze
```

### Debug in Browser
1. Open DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in code
4. Reload page

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache
rm -rf .next
pnpm install
pnpm dev
```

### Environment Variables Not Loading
```bash
# Check .env.local exists
ls -la .env.local

# Verify variables are prefixed correctly:
# - NEXT_PUBLIC_* for client-side
# - No prefix for server-side
```

### TypeScript Errors
```bash
# Check config
cat tsconfig.json

# Run type check
pnpm type-check

# Clear cache
rm -rf node_modules/.cache
```

## Testing

### Run Unit Tests
```bash
pnpm test
```

### Run with Coverage
```bash
pnpm test:coverage
```

### Run E2E Tests
```bash
pnpm test:e2e
```

### Run Accessibility Tests
```bash
pnpm test:a11y
```

## Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Self-Hosted
```bash
# Build
pnpm build

# Start
NODE_ENV=production pnpm start
```

## Documentation

- **Main Guide**: See `COMPLETE_MIGRATION_SUMMARY.md`
- **Component Library**: See `apps/ui/TEMPLATES_V0.md`
- **Migration Details**: See `NEXTJS_MIGRATION_GUIDE.md`
- **Implementation Tasks**: See `IMPLEMENTATION_CHECKLIST.md`
- **Integration Plan**: See `PHASE_5_INTEGRATION_PLAN.md`

## Getting Help

### Check Documentation
1. Read the component template in `TEMPLATES_V0.md`
2. Check the implementation guide
3. Review example components in `components/`

### Debug Issues
1. Run `pnpm type-check` to catch TypeScript errors
2. Check browser console for client errors
3. Check terminal for server errors
4. Use DevTools debugger for step-through debugging

### Ask Questions
- Review existing components for patterns
- Check migration guides for architecture decisions
- Look at phase summaries for context

## Next Steps

1. Choose an app to start with (Dashboard or Dev Server UI)
2. Read the corresponding README.md
3. Set up environment variables
4. Run `pnpm dev`
5. Start making changes!

## Important Notes

- Always use TypeScript types for props
- Use Tailwind CSS classes for styling
- Follow component templates in `TEMPLATES_V0.md`
- Run tests before committing
- Use semantic HTML elements
- Add accessibility attributes (aria-*)

---

**Questions?** Check the COMPLETE_MIGRATION_SUMMARY.md or phase-specific guides.
