import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryClientProvider } from './providers/query-provider';
import { ThemeProvider } from './providers/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Inngest Dashboard',
  description: 'Inngest - Serverless event orchestration',
  openGraph: {
    title: 'Inngest Dashboard',
    description: 'Inngest - Serverless event orchestration',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inngest Dashboard',
    description: 'Inngest - Serverless event orchestration',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background-canvas-base text-foreground-base">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryClientProvider>{children}</QueryClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
