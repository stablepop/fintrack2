"use client";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { GoalsSection } from "@/components/dashboard/goals-section"; 
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProUpgrade } from "@/hooks/useProUpgrade";
import { useEffect, useState } from "react";

interface User {
  userId: string;
  fullName: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { handleProUpgrade, paymentLoading } = useProUpgrade();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

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
          {/* Pro Upgrade Button */}
          {/* Triggers the Razorpay payment process for upgrading to FinTrack Pro */}
          {/* Uses the handleProUpgrade function from useProUpgrade hook */}
          <Button
            onClick={handleProUpgrade}
            disabled={paymentLoading}
            size="sm"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg"
          >
            {paymentLoading ? (
              <>Processing...</>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-1" />
                Go Pro
              </>
            )}
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