import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 space-y-4 lg:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </div>

      <DashboardStats userId={user?.userId || ""} />
      <RecentTransactions userId={user?.userId || ""} />
    </div>
  );
}
