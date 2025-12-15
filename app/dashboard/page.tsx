import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { GoalsSection } from "@/components/dashboard/goals-section"; 
import { getCurrentUser } from "@/lib/auth/session";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-6 pb-20">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-sm mt-1 opacity-90">
              Welcome back, {user?.fullName?.split(" ")[0] || "User"}! Here's your financial overview.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg"
          >
            <Link href="/dashboard/settings">
              <Crown className="h-4 w-4 mr-1" />
              Go Pro
            </Link>
          </Button>
        </div>
      </div>

      {/* Existing Stats */}
      <DashboardStats userId={user?.userId || ""} />
      
      {/* NEW: Financial Goals Section */}
      <GoalsSection />

      {/* Existing Transactions */}
      <div className="mt-6">
        <RecentTransactions userId={user?.userId || ""} />
      </div>
    </div>
  );
}