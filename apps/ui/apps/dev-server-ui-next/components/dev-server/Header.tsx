"use client";

import { ThemeToggle } from "@inngest/components";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">I</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Inngest Dev Server</h1>
            <p className="text-sm text-foreground/60">Local development environment</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
