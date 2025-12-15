import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { GoalsSection } from "@/components/dashboard/goals-section"; 
import { getCurrentUser } from "@/lib/auth/session";
import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-6 pb-20">
      {/* Pro Upgrade Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Crown className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Upgrade to Pro
                  <Sparkles className="h-5 w-5 text-yellow-200 animate-pulse" />
                </h2>
                <p className="text-sm opacity-90">
                  Unlock unlimited categories, advanced analytics, and priority support
                </p>
              </div>
            </div>
            <Link href="/dashboard/settings">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105">
                <Crown className="mr-2 h-4 w-4" />
                Go Pro Now
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm mt-1 opacity-90">
          Welcome back, {user?.fullName?.split(" ")[0] || "User"}! Here's your financial overview.
        </p>
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