'use client';

import { GitBranch, Zap, Clock, CheckCircle } from 'lucide-react';

const stats = [
  {
    title: 'Total Workflows',
    value: '—',
    icon: GitBranch,
    color: 'primary',
  },
  {
    title: 'Active Functions',
    value: '—',
    icon: Zap,
    color: 'secondary',
  },
  {
    title: 'Pending Runs',
    value: '—',
    icon: Clock,
    color: 'accent',
  },
  {
    title: 'Completed Today',
    value: '—',
    icon: CheckCircle,
    color: 'primary',
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-background-surface-base border border-border-subtle rounded-lg p-6 space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground-subtle">{stat.title}</p>
              <Icon className="w-5 h-5 text-primary-intense" />
            </div>
            <p className="text-2xl font-bold text-foreground-base">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
