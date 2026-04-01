import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ReceiptText } from "lucide-react";
import StatCard from "@/features/dashboard/components/StatCard";
import { activities, dashboardStats, transactions } from "@/features/dashboard/services/dummy-data";
import Dashboard from "@/features/dashboard/Dashboard";

const CashflowTrendChart = dynamic(
  () => import("@/features/dashboard/components/CashflowTrendChart"),
  {
    loading: () => <div className="h-72 w-full animate-pulse rounded-xl bg-slate-900/70" />,
  },
);

const ExpenseBreakdownChart = dynamic(
  () => import("@/features/dashboard/components/ExpenseBreakdownChart"),
  {
    loading: () => <div className="h-72 w-full animate-pulse rounded-xl bg-slate-900/70" />,
  },
);

const WeeklyNetChart = dynamic(
  () => import("@/features/dashboard/components/WeeklyNetChart"),
  {
    loading: () => <div className="h-72 w-full animate-pulse rounded-xl bg-slate-900/70" />,
  },
);

export default function DashboardPage() {
  const latestTransactions = transactions.slice(0, 4);

  return (
    <Dashboard />
  );
}
