"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Calendar as CalendarIcon,
  Plus,
  TrendingUp,
  TrendingDown,
  ReceiptText,
  Lightbulb,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "motion/react";

import { cn } from "@/lib/utils/helper";
import { useDashboard } from "@/hooks/useDashboard";
import type {
  DashboardExpenseBreakdownItem,
  DashboardOverview,
  DashboardRecentTransaction,
  DashboardTopSpendingCategory,
  DashboardWeeklyNetItem,
} from "./types";

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 90 Days", value: 90 },
] as const;

function toCurrency(value: number): string {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatTrendLabel(value: number): string {
  const rounded = Math.abs(value).toFixed(1);
  return `${value >= 0 ? "+" : "-"}${rounded}%`;
}

function isTrendPositive(value: number): boolean {
  return value >= 0;
}

function getTransactionBadgeClass(transaction: DashboardRecentTransaction): string {
  if (transaction.type === "Income") {
    return "bg-tertiary/10 text-tertiary";
  }

  if (transaction.type === "Transfer") {
    return "bg-secondary/10 text-secondary";
  }

  return "bg-primary/10 text-primary";
}

function getWeeklyBarHeight(value: number, maxAbs: number): number {
  if (maxAbs <= 0) return 10;

  const percentage = (Math.abs(value) / maxAbs) * 100;
  return Math.max(10, Math.round(percentage));
}

const StatCard = ({
  title,
  value,
  trend,
  subtext,
  icon: Icon,
  trendUp,
}: {
  title: string;
  value: string;
  trend: string;
  subtext: string;
  icon: any;
  trendUp?: boolean;
}) => {
  return (
    <div className="bg-surface-container p-4 sm:p-6 rounded-lg relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
        <Icon size={100} className="sm:w-30 sm:h-30" />
      </div>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {title}
        </span>
        <span
          className={cn(
            "px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold",
            trendUp ? "bg-primary/10 text-primary" : "bg-error/10 text-error",
          )}
        >
          {trend}
        </span>
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-1">{value}</div>
      <p className="text-[9px] sm:text-[10px] text-on-surface-variant">{subtext}</p>
    </div>
  );
};

const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState<number>(30);

  const dashboardQuery = useDashboard(selectedRange);

  const dashboardData = useMemo<DashboardOverview | null>(() => {
    if (!dashboardQuery.data?.success || !dashboardQuery.data?.data) {
      return null;
    }

    return dashboardQuery.data.data as DashboardOverview;
  }, [dashboardQuery.data]);

  const weeklyMovement = dashboardData?.charts.weeklyNetMovement || [];
  const weeklyMaxAbs = Math.max(...weeklyMovement.map((item) => Math.abs(item.value)), 0);

  if (dashboardQuery.isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <main className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="h-8 w-80 rounded-lg bg-surface-container animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-40 rounded-lg bg-surface-container animate-pulse" />
              ))}
            </div>
            <div className="h-120 rounded-lg bg-surface-container animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background text-on-surface">
        <main className="max-w-7xl mx-auto">
          <div className="bg-surface-container p-8 rounded-lg text-center">
            <h4 className="text-xl font-bold mb-3">Unable to load dashboard</h4>
            <p className="text-on-surface-variant mb-6">
              {dashboardQuery.data?.message || "Something went wrong while loading dashboard data."}
            </p>
            <button
              onClick={() => dashboardQuery.refetch()}
              className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const summary = dashboardData.summary;

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
          <div>
            <p className="text-xs font-bold text-primary tracking-[0.2em] mb-1 uppercase">
              Financial Summary
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              {summary.periodLabel}
            </h3>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center">
            <div className="flex-1 px-3 sm:px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CalendarIcon size={16} className="sm:w-4.5 sm:h-4.5" />
              <select
                value={selectedRange}
                onChange={(event) => setSelectedRange(Number(event.target.value))}
                className="bg-transparent outline-none cursor-pointer text-xs sm:text-sm flex-1"
              >
                {RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="text-black">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href="/transactions"
              className="flex-1 px-3 sm:px-5 py-2.5 bg-linear-to-br from-primary-container to-primary text-on-primary-fixed font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/10 active:scale-95 text-xs sm:text-sm"
            >
              <Plus size={16} className="sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">New Entry</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Balance"
            value={toCurrency(summary.totalBalance)}
            trend={formatTrendLabel(summary.monthlyIncomeChange)}
            subtext={`Across ${summary.connectedAccounts} connected accounts`}
            icon={Wallet}
            trendUp={isTrendPositive(summary.monthlyIncomeChange)}
          />
          <StatCard
            title="Monthly Income"
            value={toCurrency(summary.monthlyIncome)}
            trend={formatTrendLabel(summary.monthlyIncomeChange)}
            subtext="Compared to previous month"
            icon={TrendingUp}
            trendUp={isTrendPositive(summary.monthlyIncomeChange)}
          />
          <StatCard
            title="Monthly Expense"
            value={toCurrency(summary.monthlyExpense)}
            trend={formatTrendLabel(summary.monthlyExpenseChange)}
            subtext={`${Math.round(summary.expenseBudgetUsage)}% of tracked budget`}
            icon={TrendingDown}
            trendUp={!isTrendPositive(summary.monthlyExpenseChange)}
          />
          <div className="bg-surface-container p-6 rounded-lg relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Savings Rate
              </span>
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-bold",
                  summary.savingsRateChange >= 0 ? "bg-primary/10 text-primary" : "bg-error/10 text-error",
                )}
              >
                {formatTrendLabel(summary.savingsRateChange)}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-on-surface mb-1">
              {Math.round(summary.savingsRate)}%
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full mt-2">
              <div
                className="bg-tertiary h-1 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, summary.savingsRate))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2 bg-surface-container p-4 sm:p-8 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-10">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-on-surface mb-1">Cashflow Trend</h4>
                <p className="text-xs text-on-surface-variant">Income vs expenses over the last 6 months</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Expense</span>
                </div>
              </div>
            </div>

            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.charts.cashflowTrend}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#434655"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#c3c6d7", fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#c3c6d7", fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#353940", opacity: 0.2 }}
                    contentStyle={{
                      backgroundColor: "#1c2026",
                      border: "none",
                      borderRadius: "8px",
                      color: "#dfe2eb",
                    }}
                  />
                  <Bar dataKey="income" fill="#b4c5ff" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="expense" fill="#ffb596" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-container p-4 sm:p-8 rounded-lg flex flex-col">
            <h4 className="text-base sm:text-lg font-bold text-on-surface mb-6">Expense Breakdown</h4>
            <div className="flex-1 flex flex-col justify-center">
              <div className="relative w-48 h-48 mx-auto mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.charts.expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData.charts.expenseBreakdown.map((entry, index) => (
                        <Cell key={`expense-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Total</span>
                  <span className="text-xl font-black text-on-surface">
                    {toCurrency(summary.monthlyExpense).replace(".00", "")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {dashboardData.charts.expenseBreakdown.map((item: DashboardExpenseBreakdownItem, idx: number) => (
                  <div
                    key={`breakdown-${idx}`}
                    className="flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-on-surface">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container p-4 sm:p-8 rounded-lg mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-6 sm:mb-8">
            <h4 className="text-base sm:text-lg font-bold text-on-surface">Weekly Net Movement</h4>
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-on-surface uppercase">Live Sync</span>
            </div>
          </div>

          <div className="h-40 w-full flex items-end gap-3 lg:gap-6">
            {weeklyMovement.map((item: DashboardWeeklyNetItem) => (
              <div key={item.day} className="flex-1 h-full flex flex-col justify-end gap-2 group">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${getWeeklyBarHeight(item.value, weeklyMaxAbs)}%` }}
                  className={cn(
                    "w-full rounded-t-lg transition-all",
                    item.value >= 0
                      ? "bg-primary"
                      : "bg-surface-container-highest group-hover:bg-error/40",
                  )}
                />
                <span
                  className={cn(
                    "text-[9px] text-center font-bold uppercase",
                    item.value >= 0 ? "text-on-surface" : "text-on-surface-variant",
                  )}
                >
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-surface-container p-4 sm:p-8 rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
              <h4 className="text-base sm:text-lg font-bold text-on-surface">Recent Transactions</h4>
              <Link href="/transactions" className="text-xs font-bold text-primary hover:underline cursor-pointer">
                View All History
              </Link>
            </div>

            <div className="overflow-x-auto -mx-4 sm:-mx-8 px-4 sm:px-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-outline-variant/10">
                    <th className="pb-3 sm:pb-4 text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Title</th>
                    <th className="pb-3 sm:pb-4 text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden sm:table-cell">Category</th>
                    <th className="pb-3 sm:pb-4 text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden sm:table-cell">Date</th>
                    <th className="pb-3 sm:pb-4 text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {dashboardData.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-surface-container-low transition-colors">
                      <td className="py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                            <ReceiptText size={14} className="sm:w-4 sm:h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs sm:text-sm font-semibold text-on-surface truncate">{tx.title}</span>
                            <span className={cn("text-[8px] sm:hidden font-bold rounded-full inline-block mt-1 px-1.5 py-0.5", getTransactionBadgeClass(tx))}>
                              {tx.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 hidden sm:table-cell">
                        <span className={cn("px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold", getTransactionBadgeClass(tx))}>
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 text-[8px] sm:text-xs text-on-surface-variant hidden sm:table-cell">{tx.date}</td>
                      <td className={cn("py-3 sm:py-4 text-right text-xs sm:text-sm font-bold", tx.type === "Income" ? "text-primary" : "text-on-surface")}>
                        <span className="hidden sm:inline">{tx.type === "Income" ? "+" : "-"}</span>
                        {toCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface-container p-4 sm:p-8 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-8 sm:mb-10">
              <h4 className="text-base sm:text-lg font-bold text-on-surface">Top Spending Categories</h4>
              <span className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Monthly Limit</span>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {dashboardData.topSpendingCategories.map((cat: DashboardTopSpendingCategory) => {
                const percentage = cat.limit > 0 ? Math.min(100, (cat.spent / cat.limit) * 100) : 0;

                return (
                  <div key={cat.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-2">
                      <span className="text-xs sm:text-sm font-bold text-on-surface">{cat.name}</span>
                      <span className="text-xs sm:text-sm font-bold text-on-surface text-right sm:text-left">
                        {toCurrency(cat.spent)} / {toCurrency(cat.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-xl bg-primary-container/10 border border-primary-container/20 flex gap-3 sm:gap-5 items-start sm:items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <Lightbulb className="text-white fill-current w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-on-surface mb-1">Financial Insight</h5>
                <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">{dashboardData.insight}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
