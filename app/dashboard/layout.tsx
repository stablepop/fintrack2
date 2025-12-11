import { redirect } from 'next/navigation';
import { getCurrentUser } from "@/lib/auth/session";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Dashboard - Finance Tracker",
  description: "Manage your personal finances",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex-col lg:flex-row">
      <DashboardNav />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
