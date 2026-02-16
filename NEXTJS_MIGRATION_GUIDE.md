# Next.js 16 Migration Guide for Inngest Dashboard

## Quick Start

### 1. Create New Next.js 16 Project

```bash
# Create new Next.js 16 project with App Router
cd apps/ui/apps
npx create-next-app@latest dashboard-next \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir=false

cd dashboard-next
```

### 2. Install Dependencies

```bash
# Core
npm install react@latest next@latest

# GraphQL
npm install urql graphql@latest

# Data fetching
npm install @tanstack/react-query swr

# State management
npm install zustand

# Theme
npm install next-themes

# Icons
npm install lucide-react

# Shared components
npm install @inngest/components

# Form handling
npm install react-hook-form zod @hookform/resolvers
```

### 3. Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "jsxImportSource": "react",
    "strict": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/app/*": ["./app/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 4. Configure Tailwind

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';
import baseConfig from '@inngest/components/tailwind.config';

const config: Config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './node_modules/@inngest/components/**/*.{ts,tsx}',
  ],
  presets: [baseConfig],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

### 5. Configure Next.js

Create/Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    reactCompiler: true,
  },
  env: {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.inngest.com',
      },
    ],
  },
};

export default config;
```

---

## Project Structure

### Directory Layout

```
dashboard-next/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                 # 404 page
│   ├── loading.tsx                   # Loading UI
│   │
│   ├── (auth)/                       # Auth group
│   │   ├── layout.tsx                # Auth layout
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── callback/page.tsx         # OAuth callback
│   │
│   ├── (dashboard)/                  # Dashboard group
│   │   ├── layout.tsx                # Dashboard layout
│   │   ├── page.tsx                  # Dashboard home
│   │   │
│   │   ├── workflows/
│   │   │   ├── page.tsx              # Workflows list
│   │   │   ├── layout.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Workflow details
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── runs/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │
│   │   ├── runs/
│   │   │   ├── page.tsx              # Runs list
│   │   │   ├── [id]/page.tsx         # Run details
│   │   │
│   │   ├── functions/
│   │   │   ├── page.tsx              # Functions list
│   │   │   └── [id]/page.tsx         # Function details
│   │   │
│   │   ├── events/
│   │   │   ├── page.tsx              # Events list
│   │   │   └── [id]/page.tsx         # Event details
│   │   │
│   │   └── settings/page.tsx         # Settings
│   │
│   ├── api/
│   │   ├── graphql/route.ts          # GraphQL proxy
│   │   ├── auth/route.ts             # Auth endpoint
│   │   └── [path]/route.ts           # Catch-all API proxy
│   │
│   └── middleware.ts                 # Auth/route protection
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   │
│   ├── dashboard/
│   │   ├── WorkflowsList.tsx
│   │   ├── WorkflowsTable.tsx
│   │   ├── RunsList.tsx
│   │   ├── RunTimeline.tsx
│   │   └── ...
│   │
│   └── ui/                           # Shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ...
│
├── lib/
│   ├── graphql/
│   │   ├── client.ts                 # urql client
│   │   ├── queries.ts                # GraphQL queries
│   │   └── mutations.ts              # GraphQL mutations
│   │
│   ├── api/
│   │   ├── workflows.ts
│   │   ├── runs.ts
│   │   └── events.ts
│   │
│   ├── auth/
│   │   ├── clerk.ts
│   │   └── middleware.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                     # Classnames utility
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   └── hooks/
│       ├── useWorkflows.ts
│       ├── useRuns.ts
│       ├── useAuth.ts
│       └── useTheme.ts
│
├── types/
│   ├── index.ts
│   ├── workflows.ts
│   ├── runs.ts
│   └── events.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── logos/
│
├── styles/
│   └── globals.css
│
├── .env.local                        # Environment variables
├── .env.local.example                # Example env file
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Migration Patterns

### 1. Routing - Tanstack → Next.js

**Tanstack Start Router:**
```tsx
// Old Tanstack routing
import { RootRoute, Route, Router } from '@tanstack/react-router';

const rootRoute = new RootRoute({ component: Root });
const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});
const workflowRoute = new Route({
  getParentRoute: () => dashboardRoute,
  path: '/workflows/$id',
  component: WorkflowDetail,
});

const router = new Router({ routeTree: rootRoute.addChildren([dashboardRoute, workflowRoute]) });
```

**Next.js App Router:**
```tsx
// New Next.js App Router - file-based, no code needed
// app/
// ├── (dashboard)/
// │   └── workflows/
// │       └── [id]/
// │           └── page.tsx

// In app/(dashboard)/workflows/[id]/page.tsx:
export default function WorkflowDetail({ params }: { params: { id: string } }) {
  return <WorkflowDetail workflowId={params.id} />;
}
```

### 2. Data Fetching - React Query → Combinations

**Old Tanstack Query:**
```tsx
const { data, isPending } = useQuery({
  queryKey: ['workflows'],
  queryFn: async () => await fetchWorkflows(),
});
```

**New Next.js 16:**
```tsx
// Option 1: Server Component (initial load)
async function WorkflowsList() {
  const data = await fetch('http://localhost:3000/api/workflows', {
    cache: 'revalidate',
    next: { revalidate: 60 }
  }).then(r => r.json());
  
  return <WorkflowsClient initialData={data} />;
}

// Option 2: Client Component with SWR (real-time)
'use client'
import useSWR from 'swr';

export function WorkflowsClient({ initialData }: { initialData: Workflow[] }) {
  const { data = initialData, isLoading } = useSWR('/api/workflows', fetcher);
  return <div>{/* render */}</div>;
}
```

### 3. State Management - Redux → Context

**Old Redux:**
```tsx
const slice = createSlice({
  name: 'workflows',
  initialState: { items: [], loading: false },
  reducers: {
    setWorkflows: (state, action) => { state.items = action.payload; }
  }
});

export default useSelector(state => state.workflows.items);
```

**New Context:**
```tsx
// Create context
const WorkflowContext = createContext<{
  workflows: Workflow[];
  setWorkflows: (w: Workflow[]) => void;
} | null>(null);

// Provider component
'use client'
export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  return (
    <WorkflowContext.Provider value={{ workflows, setWorkflows }}>
      {children}
    </WorkflowContext.Provider>
  );
}

// Hook
export function useWorkflows() {
  const context = useContext(WorkflowContext);
  if (!context) throw new Error('useWorkflows must be used within WorkflowProvider');
  return context;
}
```

### 4. Authentication - Clerk Setup

**Install Clerk:**
```bash
npm install @clerk/nextjs
```

**Setup middleware:**
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/api/protected(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

**Setup provider:**
```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 5. API Routes - GraphQL Proxy

**Create GraphQL proxy:**
```typescript
// app/api/graphql/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  const response = await fetch(process.env.GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('Authorization') || '',
    },
    body: JSON.stringify(body),
  });

  return response;
}
```

---

## Environment Variables

Create `.env.local`:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# GraphQL
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.inngest.com/graphql
GRAPHQL_API_TOKEN=your_token_here

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here

# Dev server (local development)
DEV_SERVER_URL=http://localhost:8288
```

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

The app runs on `http://localhost:3000`

### 2. Build for Production

```bash
npm run build
npm run start
```

### 3. Generate GraphQL Types

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript

# In codegen.ts
export default {
  schema: process.env.GRAPHQL_ENDPOINT,
  documents: ['./lib/graphql/**/*.ts'],
  generates: {
    './types/generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

npm run generate
```

---

## Performance Optimizations

### 1. Use Server Components by Default

```tsx
// ✅ Default - Server Component
export default async function Dashboard() {
  const data = await fetchDashboardData();
  return <DashboardUI data={data} />;
}

// ❌ Only make Client Component if needed
'use client'
function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Image Optimization

```tsx
import Image from 'next/image';

export function Avatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-full"
      priority={false}
    />
  );
}
```

### 3. Dynamic Imports

```tsx
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  loading: () => <div>Loading editor...</div>,
  ssr: false,
});

export function CodeEditor() {
  return <MonacoEditor defaultLanguage="javascript" />;
}
```

### 4. Streaming with Suspense

```tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const data = await fetchDashboardData();
  return <div>{/* render data */}</div>;
}
```

---

## Common Pitfalls & Solutions

| Pitfall | Solution |
|---------|----------|
| Fetching in useEffect | Use Server Components for initial data |
| Mixing Server/Client | Clearly separate with 'use client' boundary |
| State in URL | Use useSearchParams() and URLSearchParams |
| Building dynamic metadata | Use generateMetadata() function |
| Performance regression | Use React DevTools Profiler |
| Hydration mismatch | Ensure same render in server & client |

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

```bash
vercel env add NEXT_PUBLIC_GRAPHQL_ENDPOINT
vercel env add GRAPHQL_API_TOKEN
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
```

---

## Testing

### Setup Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Example Test

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## Additional Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app/building-your-application/routing)
- [Clerk Authentication](https://clerk.com/docs/nextjs)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [urql GraphQL Client](https://formidable.com/open-source/urql/docs/)
- [SWR Data Fetching](https://swr.vercel.app)
