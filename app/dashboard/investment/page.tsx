"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2 } from "lucide-react";

interface Investment {
  _id: string;
  type: "oneTime" | "recurring";
  category: string;
  amount: number;
  description: string;
  date: string;
  expectedReturnRate: number;
  expectedEndDate: string;
}

const TYPES = ["Stocks", "Mutual Funds", "Gold", "Real Estate", "Crypto", "Other"];

const RecurringDisplay = ({ amount, date }: { amount: number; date: string }) => {
  const months = (() => {
    const s = new Date(date);
    const e = new Date();
    return (e.getFullYear() * 12 + e.getMonth()) - (s.getFullYear() * 12 + s.getMonth()) + 1;
  })();

  const total = amount * months;

  return (
    <p className="text-[11px] text-blue-400 mt-1">
      ₹{amount}/mo • {months} months • ₹{total.toLocaleString()} total
    </p>
  );
};


export default function InvestmentPage() {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "oneTime",
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    expectedReturnRate: "",
    expectedEndDate: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const res = await fetch("/api/investments");
      if (!res.ok) {
        if (res.status === 401) router.push("/auth/login");
        return;
      }
      const data = await res.json();
      setInvestments(data);
    } catch (err) {
      setError("Failed to fetch investments");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.category || !formData.amount) {
      setError("Please fill all required fields");
      return;
    }

    try {
      console.log("posting data", formData)
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          expectedReturnRate: parseFloat(formData.expectedReturnRate) || 0,
          expectedEndDate: formData.expectedEndDate || null,
        }),
      });

      if (!res.ok) throw new Error();

      setIsOpen(false);
      setFormData({
        type: "oneTime",
        category: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        expectedReturnRate: "",
        expectedEndDate: ""
      });

      fetchInvestments();
    } catch {
      setError("Failed to add investment");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/investments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchInvestments();
    } catch {
      setError("Failed to delete");
    }
  };

  // ---- SUMMARY CALCULATIONS ----

  // Calculate future value for ONE-TIME investment
  const calculateOneTimeFV = (amount: number, rate: number, months: number) => {
    const r = rate / 100 / 12; // monthly rate
    return amount * Math.pow(1 + r, months);
  };

  // Calculate future value for SIP / RECURRING
  const calculateRecurringFV = (amount: number, rate: number, months: number) => {
    const r = rate / 100 / 12; // monthly rate
    if (r === 0) return amount * months;
    return amount * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
  };

  const monthDiff = (start: Date, end: Date) => {
    return (
      end.getFullYear() * 12 +
      end.getMonth() -
      (start.getFullYear() * 12 + start.getMonth())
    ) + 1;
  };

  // Helper: Calculate months between two dates
  const getMonthDifference = (start: Date, end: Date) => {
    return (
      end.getFullYear() * 12 +
      end.getMonth() -
      (start.getFullYear() * 12 + start.getMonth())
    ) + 1; // +1 to include current month
  };

  const totalOneTime = investments
    .filter((i) => i.type === "oneTime")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalRecurringMonthly = investments
    .filter((i) => i.type === "recurring")
    .reduce((sum, i) => {
      const months = getMonthDifference(new Date(i.date), new Date());
      return sum + i.amount * months;
    }, 0);

  const totalOverall = totalOneTime + totalRecurringMonthly;

  const totalEstimatedCurrent = investments.reduce((sum, inv) => {
    if (!inv.expectedReturnRate) return sum;

    const start = new Date(inv.date);
    const today = new Date();

    const months = getMonthDifference(start, today);
    const rate = inv.expectedReturnRate;

    const currentValue =
      inv.type === "oneTime"
        ? calculateOneTimeFV(inv.amount, rate, months)
        : calculateRecurringFV(inv.amount, rate, months);

    return sum + currentValue;
  }, 0);

  // TOTAL ESTIMATED END VALUE
  const totalEstimatedEnd = investments.reduce((sum, inv) => {
    if (!inv.expectedReturnRate || !inv.expectedEndDate) return sum;

    const start = new Date(inv.date);
    const end = new Date(inv.expectedEndDate);

    const months = getMonthDifference(start, end);
    const rate = inv.expectedReturnRate;

    const futureValue =
      inv.type === "oneTime"
        ? calculateOneTimeFV(inv.amount, rate, months)
        : calculateRecurringFV(inv.amount, rate, months);

    return sum + futureValue;
  }, 0);


  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedInvestments = [...investments].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    let valA: any;
    let valB: any;

    // --- FIELD HANDLING ---
    switch (key) {
      case "name":
        valA = (a.description || a.category).toLowerCase();
        valB = (b.description || b.category).toLowerCase();
        break;

      case "type":
        valA = a.type === "oneTime" ? "One-Time" : "Recurring";
        valB = b.type === "oneTime" ? "One-Time" : "Recurring";
        break;

      case "category":
        valA = a.category.toLowerCase();
        valB = b.category.toLowerCase();
        break;

      case "amount":
        valA = a.amount;
        valB = b.amount;
        break;

      case "invested":
        valA =
          a.type === "recurring"
            ? a.amount * monthDiff(new Date(a.date), new Date())
            : a.amount;

        valB =
          b.type === "recurring"
            ? b.amount * monthDiff(new Date(b.date), new Date())
            : b.amount;
        break;

      case "current":
        valA =
          a.expectedReturnRate > 0
            ? (a.type === "oneTime"
              ? calculateOneTimeFV(a.amount, a.expectedReturnRate, monthDiff(new Date(a.date), new Date()))
              : calculateRecurringFV(a.amount, a.expectedReturnRate, monthDiff(new Date(a.date), new Date())))
            : a.amount;

        valB =
          b.expectedReturnRate > 0
            ? (b.type === "oneTime"
              ? calculateOneTimeFV(b.amount, b.expectedReturnRate, monthDiff(new Date(b.date), new Date()))
              : calculateRecurringFV(b.amount, b.expectedReturnRate, monthDiff(new Date(b.date), new Date())))
            : b.amount;
        break;

      case "endValue":
        valA =
          a.expectedEndDate && a.expectedReturnRate > 0
            ? (a.type === "oneTime"
              ? calculateOneTimeFV(a.amount, a.expectedReturnRate, monthDiff(new Date(a.date), new Date(a.expectedEndDate)))
              : calculateRecurringFV(a.amount, a.expectedReturnRate, monthDiff(new Date(a.date), new Date(a.expectedEndDate))))
            : 0;

        valB =
          b.expectedEndDate && b.expectedReturnRate > 0
            ? (b.type === "oneTime"
              ? calculateOneTimeFV(b.amount, b.expectedReturnRate, monthDiff(new Date(b.date), new Date(b.expectedEndDate)))
              : calculateRecurringFV(b.amount, b.expectedReturnRate, monthDiff(new Date(b.date), new Date(b.expectedEndDate))))
            : 0;
        break;

      case "roi":
        valA = a.expectedReturnRate || 0;
        valB = b.expectedReturnRate || 0;
        break;

      default:
        return 0;
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });


  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white mb-4">
        <h1 className="text-3xl font-bold">Investments</h1>
        <p className="text-sm mt-1 opacity-90">Track and visualise your investments in one place</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-4 sm:overflow-visible sm:snap-none">

        {/* CARD */}
        <div className="min-w-[220px] snap-start backdrop-blur-md bg-white/10 dark:bg-gray-900/20 rounded-2xl p-5 shadow-lg border border-white/20 sm:min-w-0">
          <p className="text-sm font-medium text-gray-300">Total One-Time</p>
          <p className="text-2xl font-bold mt-1 text-white whitespace-nowrap">
            ₹ {totalOneTime.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* CARD */}
        <div className="min-w-[220px] snap-start backdrop-blur-md bg-white/10 dark:bg-gray-900/20 rounded-2xl p-5 shadow-lg border border-white/20 sm:min-w-0">
          <p className="text-sm font-medium text-gray-300">Monthly Recurring</p>
          <p className="text-2xl font-bold mt-1 text-white whitespace-nowrap">
            ₹ {totalRecurringMonthly.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* CARD */}
        <div className="min-w-[220px] snap-start backdrop-blur-md bg-white/10 dark:bg-gray-900/20 rounded-2xl p-5 shadow-lg border border-white/20 sm:min-w-0">
          <p className="text-sm font-medium text-gray-300">Total Invested</p>
          <p className="text-2xl font-bold mt-1 text-white whitespace-nowrap">
            ₹ {totalOverall.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* CARD */}
        <div className="min-w-[220px] snap-start backdrop-blur-md bg-white/10 dark:bg-gray-900/20 rounded-2xl p-5 shadow-lg border border-white/20 sm:min-w-0">
          <p className="text-sm font-medium text-gray-300">Current Estimated ROI</p>
          <p className="text-2xl font-bold mt-1 text-white whitespace-nowrap">
            ₹ {totalEstimatedCurrent.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

      </div>


      {/* ADD BUTTON */}
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-xl font-semibold">Investment History</h2>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Investment
        </Button>
      </div>

      {/* ADD MODAL */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl shadow-2xl border border-white/20 bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Investment</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Enter details for your one-time or recurring investment
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdd} className="space-y-5 mt-2">

            {/* ERROR */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* TYPE */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oneTime">One-Time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CATEGORY */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={formData.category || undefined}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Description (optional)</Label>
              <Input
                className="rounded-xl h-11"
                placeholder="Example: Monthly SIP in Axis Mutual Fund"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* AMOUNT */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Amount</Label>
              <Input
                type="number"
                className="rounded-xl h-11"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            {/* EXPECTED RETURN RATE */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Expected Annual Return (%)</Label>
              <Input
                type="number"
                className="rounded-xl h-11"
                placeholder="Example: 12"
                value={formData.expectedReturnRate}
                onChange={(e) =>
                  setFormData({ ...formData, expectedReturnRate: e.target.value })
                }
              />
            </div>

            {/* DATE */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                {formData.type === "recurring" ? "Start Date" : "Date"}
              </Label>
              <Input
                type="date"
                className="rounded-xl h-11"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* EXPECTED END DATE */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Expected End Date</Label>
              <Input
                type="date"
                className="rounded-xl h-11"
                value={formData.expectedEndDate}
                onChange={(e) =>
                  setFormData({ ...formData, expectedEndDate: e.target.value })
                }
              />
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full rounded-xl h-11 text-base text-white font-semibold bg-blue-600 hover:bg-blue-700"
            >
              Add Investment
            </Button>
          </form>
        </DialogContent>
      </Dialog>


      {/* LIST */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-white/5 dark:bg-gray-900/20 backdrop-blur">

        <table className="min-w-full text-sm">

          {/* HEADER */}
          <thead className="bg-white/10 text-gray-300">
            <tr>
              <th onClick={() => handleSort("name")} className="px-4 py-3 cursor-pointer">
                Investment {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>

              <th onClick={() => handleSort("type")} className="px-4 py-3 cursor-pointer">
                Type {sortConfig?.key === "type" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>

              <th onClick={() => handleSort("category")} className="px-4 py-3 cursor-pointer">
                Category {sortConfig?.key === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>

              <th onClick={() => handleSort("amount")} className="px-4 py-3 cursor-pointer text-right">
                Amount {sortConfig?.key === "amount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>

              <th onClick={() => handleSort("invested")} className="px-4 py-3 cursor-pointer text-right">
                Invested {sortConfig?.key === "invested" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>

              <th onClick={() => handleSort("current")} className="px-4 py-3 cursor-pointer text-right">
                Current ROI {sortConfig?.key === "current" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>

              <th onClick={() => handleSort("endValue")} className="px-4 py-3 cursor-pointer text-right">
                Estimated ROI {sortConfig?.key === "endValue" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>

              <th onClick={() => handleSort("roi")} className="px-4 py-3 cursor-pointer text-right">
                ROI% {sortConfig?.key === "roi" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-left">Details</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {sortedInvestments.map((inv) => {

              // --- Calculations ---
              const start = new Date(inv.date);
              const today = new Date();

              const months = monthDiff(start, today);
              const invested =
                inv.type === "recurring"
                  ? inv.amount * months
                  : inv.amount;

              const rate = inv.expectedReturnRate || 0;
              const endDate = inv.expectedEndDate ? new Date(inv.expectedEndDate) : null;

              const currentValue =
                rate && rate > 0
                  ? (inv.type === "oneTime"
                    ? calculateOneTimeFV(inv.amount, rate, months)
                    : calculateRecurringFV(inv.amount, rate, months))
                  : invested;

              const endValue =
                endDate && rate > 0
                  ? (inv.type === "oneTime"
                    ? calculateOneTimeFV(inv.amount, rate, monthDiff(start, endDate))
                    : calculateRecurringFV(inv.amount, rate, monthDiff(start, endDate)))
                  : null;

              return (
                <tr key={inv._id} className="hover:bg-white/10 transition">

                  {/* Investment Name */}
                  <td className="px-4 py-3 font-medium text-white">
                    {inv.description || inv.category}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3 text-gray-300">
                    {inv.type === "recurring" ? "Recurring" : "One-Time"}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-gray-300">{inv.category}</td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-right font-semibold text-blue-400">
                    {inv.type === "recurring"
                      ? `₹${inv.amount.toLocaleString()}/mo`
                      : `₹${inv.amount.toLocaleString()}`}
                  </td>

                  {/* Total Invested */}
                  <td className="px-4 py-3 text-right text-gray-200">
                    ₹{invested.toLocaleString()}
                  </td>

                  {/* Current Value */}
                  <td className="px-4 py-3 text-right text-green-300">
                    ₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>

                  {/* End Value */}
                  <td className="px-4 py-3 text-right text-green-400">
                    {endValue
                      ? `₹${endValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : ""}
                  </td>

                  {/* ROI% */}
                  <td className="px-4 py-3 text-right text-gray-300">
                    {rate ? `${rate}%` : "--"}
                  </td>

                  <td className="px-4 py-3 text-left text-gray-300 whitespace-nowrap">
                    <div className="space-y-[2px] text-[11px] leading-tight">

                      {/* Start Date */}
                      <p>
                        <span className="text-gray-400">Start:</span>{" "}
                        {formatDate(inv.date)}
                      </p>

                      {/* Expected End Date */}
                      <p>
                        <span className="text-gray-400">End:</span>{" "}
                        {inv.expectedEndDate ? formatDate(inv.expectedEndDate) : "--"}
                      </p>

                      {/* Duration */}
                      <p>
                        <span className="text-gray-400">Duration:</span>{" "}
                        {inv.expectedEndDate
                          ? `${monthDiff(new Date(inv.date), new Date(inv.expectedEndDate))} months`
                          : "--"}
                      </p>
                    </div>
                  </td>


                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                      onClick={() => handleDelete(inv._id)}
                    >
                      <Trash2 className="text-red-500 w-4 h-4" />
                    </Button>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
