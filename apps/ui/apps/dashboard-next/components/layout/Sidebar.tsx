'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitBranch,
  Zap,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/workflows', label: 'Workflows', icon: GitBranch },
  { href: '/dashboard/functions', label: 'Functions', icon: Zap },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background-surface-base border-r border-border-subtle">
      {/* Header */}
      <div className="p-6 border-b border-border-subtle">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-primary-intense rounded-md flex items-center justify-center text-white text-sm font-bold">
            IN
          </div>
          <span>Inngest</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-md transition-colors
                ${
                  isActive
                    ? 'bg-primary-subtle text-primary-intense font-medium'
                    : 'text-foreground-subtle hover:bg-background-canvas-subtle'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-subtle">
        <SignOutButton>
          <button className="flex items-center gap-3 w-full px-4 py-2 text-foreground-subtle hover:bg-background-canvas-subtle rounded-md transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
