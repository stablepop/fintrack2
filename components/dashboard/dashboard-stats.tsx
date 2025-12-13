"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryData: Array<{ name: string; value: number }>;
}

export function DashboardStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState<Stats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/transactions');

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const transactions = await response.json();

        const totalIncome = transactions
          .filter((t: any) => t.type === "income")
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const totalExpense = transactions
          .filter((t: any) => t.type === "expense")
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        // Group by category
        const categoryMap: Record<string, number> = {};
        transactions.forEach((t: any) => {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });

        const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value,
        }));

        setStats({
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          categoryData,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  if (loading) {
    return <div className="p-4 text-sm sm:text-base">Loading stats...</div>;
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              ₹ {stats.totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              ₹ {stats.totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${stats.balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
              ₹ {stats.balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-sm sm:text-base">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.categoryData.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {stats.categoryData.map((item, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-1 text-xs sm:text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                </div>

                {/* Pie chart without labels to prevent overflow */}
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                      label={false}
                    >
                      {stats.categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Category details list */}
                <div className="mt-4 space-y-1 text-xs sm:text-sm">
                  {stats.categoryData.map((item, index) => (
                    <div key={`detail-${index}`} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-semibold">₹ {item.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-sm sm:text-base">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { month: "This Month", income: stats.totalIncome, expense: stats.totalExpense },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                  }}
                  cursor={false}
                  formatter={(value) => `₹ ${Number(value).toLocaleString("en-IN")}`}
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" />
                <Bar dataKey="expense" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}