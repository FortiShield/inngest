import { User } from '@clerk/nextjs/server';

export async function DashboardHeader() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground-base">Dashboard</h1>
      <p className="text-foreground-subtle mt-2">
        Welcome to your Inngest dashboard. Here you can manage your workflows, functions, and
        events.
      </p>
    </div>
  );
}
