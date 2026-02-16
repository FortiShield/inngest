import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';

export const metadata = {
  title: 'Dashboard - Inngest',
};

export default async function DashboardPage() {
  return (
    <div className="space-y-8 p-6 md:p-8">
      <DashboardHeader />
      <DashboardStats />
    </div>
  );
}
