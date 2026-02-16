# Inngest Dev Server UI (Next.js 16)

Modern, responsive dev server interface for local Inngest development with Next.js 16, built with v0.dev design system support.

## Overview

This is the Next.js 16 migration of the Inngest dev server UI. It provides a beautiful, interactive interface for monitoring functions and events during local development.

## Features

- ✨ Modern Next.js 16 App Router
- 🎨 Beautiful UI with Tailwind CSS
- 🌓 Dark/light theme support
- 📊 Functions monitoring dashboard
- 📡 Real-time events stream
- 🎯 AI-friendly component architecture (v0.dev ready)
- ⚡ Server Components and streaming
- 🔒 Type-safe with TypeScript
- 📦 Optimized bundle with Turbopack

## Quick Start

### Prerequisites

- Node.js 18.17+ or 20+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Run development server
pnpm dev
```

The dev server will be available at `http://localhost:3000`.

## Project Structure

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home page
├── globals.css             # Global styles
├── providers/              # Provider components
│   └── theme-provider.tsx  # Dark/light theme
└── api/                    # API routes (if needed)

components/
├── dev-server/             # Dev server specific components
│   ├── DevServerDashboard.tsx
│   ├── Header.tsx
│   ├── FunctionsList.tsx
│   └── EventsMonitor.tsx
└── ui/                     # Shared UI components

lib/
└── utils/                  # Utility functions
    └── cn.ts               # Tailwind class merger
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and update values:

```
NEXT_PUBLIC_API_URL=http://localhost:8288
NEXT_PUBLIC_WS_URL=ws://localhost:8288
NEXT_PUBLIC_DEBUG=false
```

## Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

## Architecture

### v0.dev Component Design

All components are designed to be easily generated and modified with v0.dev:

1. **Component structure**: Semantic HTML, clear props, self-contained styling
2. **Tailwind usage**: Design token system, no arbitrary values
3. **Type safety**: Full TypeScript with clear interfaces
4. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
5. **Responsiveness**: Mobile-first, Tailwind breakpoints

### Data Flow

Currently uses mock data for development. Integration with actual Inngest dev server:

1. **Functions List**: Connect to dev server API at `{API_URL}/api/functions`
2. **Events Stream**: Connect WebSocket at `{WS_URL}/ws/events`
3. **Real-time Updates**: Use Server Components with streaming

## Integration Checklist

- [ ] Connect to actual Inngest dev server API
- [ ] Implement WebSocket real-time event streaming
- [ ] Add TypeScript types for API responses
- [ ] Build API client utilities
- [ ] Add error handling and loading states
- [ ] Implement function details page
- [ ] Add event detail modal
- [ ] Implement search and filtering
- [ ] Add pagination for long lists
- [ ] Performance optimization

## Component Refactoring (v0.dev Ready)

Components follow v0.dev patterns:

- **Clear Props Interface**: All props are explicit and typed
- **Single Responsibility**: Each component does one thing well
- **Semantic HTML**: Using proper HTML elements
- **Design Tokens**: Using CSS custom properties for theming
- **Accessibility**: Full WCAG compliance planned
- **Responsiveness**: Mobile-first approach

### Example: Adding New Components

```tsx
// components/dev-server/FunctionDetail.tsx
"use client";

import { Card, Badge } from "@inngest/components";

interface FunctionDetailProps {
  id: string;
  name: string;
  slug: string;
}

export function FunctionDetail({ id, name, slug }: FunctionDetailProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-sm text-foreground/60">ID: {id}</p>
    </Card>
  );
}
```

## Performance

- Uses Next.js 16 optimizations
- Turbopack for fast builds
- Automatic code splitting
- Image optimization
- CSS-in-JS minimization
- Server Components by default

## Deployment

### Vercel (Recommended)

```bash
# Push to git
git push origin main

# Automatic deployment through Vercel
```

### Self-Hosted

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## Contributing

When adding new features:

1. Create components following v0.dev patterns
2. Add TypeScript types for all props
3. Use Tailwind CSS with design tokens
4. Test accessibility with keyboard and screen readers
5. Document component usage

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [v0.dev Component Guidelines](https://v0.dev)

## License

See LICENSE file in root repository.
