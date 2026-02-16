# Inngest Dashboard - Next.js 16

A modern dashboard application for Inngest built with Next.js 16, React 19, and TypeScript.

## Features

- **Next.js 16 App Router**: File-based routing with Server Components
- **TypeScript**: Full type safety across the application
- **Authentication**: Clerk integration for secure authentication
- **GraphQL**: urql client for API integration
- **Tailwind CSS**: Utility-first styling with custom design system
- **Real-time Updates**: SWR for data fetching and caching
- **Dark Mode**: Full theme support with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20.x
- pnpm 10.x

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Update .env.local with your credentials
```

### Environment Variables

Required environment variables (see `.env.local.example`):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk authentication key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT`: GraphQL API endpoint
- `GRAPHQL_API_TOKEN`: GraphQL API token

### Development

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:3000
```

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
app/
├── (auth)/                 # Authentication routes (sign-in, sign-up)
├── (dashboard)/            # Protected dashboard routes
│   ├── layout.tsx         # Dashboard layout with sidebar
│   └── page.tsx           # Dashboard home
├── layout.tsx             # Root layout with providers
├── globals.css            # Global styles
└── providers/             # Context providers

components/
├── layout/                # Layout components (Header, Sidebar)
└── dashboard/             # Dashboard-specific components

lib/
├── utils/                 # Utility functions
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types

public/                    # Static assets
```

## Key Technologies

- **Framework**: [Next.js 16](https://nextjs.org)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **UI Components**: [Inngest Components](../../../packages/components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Authentication**: [Clerk](https://clerk.com)
- **API**: [urql GraphQL Client](https://formidable.com/open-source/urql/)
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## Migration Status

This is a **Next.js 16 migration** of the original Tanstack Start dashboard. See [NEXTJS_MIGRATION_GUIDE.md](../../../NEXTJS_MIGRATION_GUIDE.md) for migration details.

### Current Status
- ✅ Project scaffold complete
- ✅ Authentication setup
- ✅ Layout structure
- 🔄 Component migration in progress
- ⏳ Feature implementation pending

## Development Workflow

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Formatting

```bash
pnpm format
```

### Generate GraphQL Types

```bash
pnpm graphql-codegen
```

## Testing

Unit and integration tests coming soon.

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel
```

### Docker

```bash
# Build image
docker build -t inngest-dashboard-next .

# Run container
docker run -p 3000:3000 inngest-dashboard-next
```

## Troubleshooting

### Clerk Authentication Issues

If you encounter authentication issues:
1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are correctly set
2. Check Clerk dashboard for user status
3. Clear browser cookies and try signing in again

### GraphQL Query Errors

If GraphQL queries fail:
1. Verify `NEXT_PUBLIC_GRAPHQL_ENDPOINT` is correct
2. Check `GRAPHQL_API_TOKEN` is valid
3. Verify network connectivity in browser DevTools

### Performance Issues

To debug performance:
1. Use [Next.js DevTools](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)
2. Check React Profiler in DevTools
3. Review Core Web Vitals in Vercel Analytics

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for guidelines.

## Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [v0 Refactoring Guide](../../../V0_REFACTORING_GUIDE.md)
- [Next.js Migration Guide](../../../NEXTJS_MIGRATION_GUIDE.md)
- [Migration Audit](../../../MIGRATION_AUDIT.md)

## License

UNLICENSED

## Support

For support, please reach out to the Inngest team at support@inngest.com
