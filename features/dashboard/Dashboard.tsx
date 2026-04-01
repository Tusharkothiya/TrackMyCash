"use client";

import React from "react";
import {
  Wallet,
  Calendar as CalendarIcon,
  Plus,
  TrendingUp,
  TrendingDown,
  Cloud,
  Megaphone,
  CreditCard,
  Utensils,
  Plane,
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

// --- Types ---

interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  icon: React.ReactNode;
  categoryColor: string;
}

interface SpendingCategory {
  name: string;
  spent: number;
  limit: number;
  color: string;
}

// --- Mock Data ---

const CASHFLOW_DATA = [
  { month: "Jan", income: 4500, expense: 2800 },
  { month: "Feb", income: 5200, expense: 3500 },
  { month: "Mar", income: 4800, expense: 3200 },
  { month: "Apr", income: 6500, expense: 2500 },
  { month: "May", income: 7200, expense: 4200 },
  { month: "Jun", income: 8420, expense: 4980 },
];

const BREAKDOWN_DATA = [
  { name: "Infrastructure", value: 35, color: "#b4c5ff" },
  { name: "Marketing", value: 22, color: "#33467e" },
  { name: "Operations", value: 18, color: "#ffb596" },
  { name: "Travel", value: 12, color: "#8d90a0" },
  { name: "Other", value: 13, color: "#434655" },
];

const WEEKLY_MOVEMENT = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 70 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 85 },
  { day: "Fri", value: 30 },
  { day: "Sat", value: 95 },
  { day: "Sun", value: 50 },
];

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "AWS Cloud Services",
    category: "Infrastructure",
    date: "Jun 14, 2024",
    amount: -1240.0,
    icon: <Cloud size={16} />,
    categoryColor: "bg-primary/10 text-primary",
  },
  {
    id: "2",
    title: "Google Ads Campaign",
    category: "Marketing",
    date: "Jun 12, 2024",
    amount: -850.0,
    icon: <Megaphone size={16} />,
    categoryColor: "bg-secondary-container/30 text-secondary",
  },
  {
    id: "3",
    title: "Client Retainer - Acme Corp",
    category: "Income",
    date: "Jun 10, 2024",
    amount: 4500.0,
    icon: <CreditCard size={16} />,
    categoryColor: "bg-tertiary/10 text-tertiary",
  },
  {
    id: "4",
    title: "Ruth's Chris Steakhouse",
    category: "Operations",
    date: "Jun 08, 2024",
    amount: -245.5,
    icon: <Utensils size={16} />,
    categoryColor: "bg-surface-bright/30 text-on-surface-variant",
  },
  {
    id: "5",
    title: "United Airlines Booking",
    category: "Travel",
    date: "Jun 05, 2024",
    amount: -612.0,
    icon: <Plane size={16} />,
    categoryColor: "bg-outline-variant/20 text-on-surface-variant",
  },
];

const SPENDING_CATEGORIES: SpendingCategory[] = [
  { name: "Infrastructure", spent: 1743, limit: 2000, color: "bg-primary" },
  {
    name: "Marketing",
    spent: 1095,
    limit: 1500,
    color: "bg-secondary-container",
  },
  { name: "Operations", spent: 896, limit: 1200, color: "bg-tertiary" },
  { name: "Travel", spent: 597, limit: 1000, color: "bg-surface-bright" },
];

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
    <div className="bg-surface-container p-6 rounded-lg relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
        <Icon size={120} />
      </div>
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {title}
        </span>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-[10px] font-bold",
            trendUp ? "bg-primary/10 text-primary" : "bg-error/10 text-error",
          )}
        >
          {trend}
        </span>
      </div>
      <div className="text-3xl font-extrabold text-on-surface mb-1">
        {value}
      </div>
      <p className="text-[10px] text-on-surface-variant">{subtext}</p>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <main className=" max-w-7xl mx-auto">
        {/* Welcome Hero */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-primary tracking-[0.2em] mb-1 uppercase">
              Financial Summary
            </p>
            <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">
              Overview for June 2024
            </h3>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-lg bg-surface-container-high text-on-surface text-sm font-semibold hover:bg-surface-bright transition-colors flex items-center gap-2">
              <CalendarIcon size={18} />
              Last 30 Days
            </button>
            <button className="px-5 py-2.5 cursor-pointer bg-linear-to-br from-primary-container to-primary text-on-primary-fixed font-bold rounded-lg flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/10 active:scale-95">
              <Plus size={18} />
              New Entry
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value="$24,560.00"
            trend="+8.2%"
            subtext="Across 4 connected accounts"
            icon={Wallet}
            trendUp
          />
          <StatCard
            title="Monthly Income"
            value="$8,420.50"
            trend="+4.1%"
            subtext="Projected: $8,500.00"
            icon={TrendingUp}
            trendUp
          />
          <StatCard
            title="Monthly Expense"
            value="$4,980.20"
            trend="-2.4%"
            subtext="62% of monthly budget"
            icon={TrendingDown}
          />
          <div className="bg-surface-container p-6 rounded-lg relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Savings Rate
              </span>
              <span className="px-2 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold">
                -1.3%
              </span>
            </div>
            <div className="text-3xl font-extrabold text-on-surface mb-1">
              41%
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full mt-2">
              <div
                className="bg-tertiary h-1 rounded-full"
                style={{ width: "41%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Middle Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cashflow Trend */}
          <div className="lg:col-span-2 bg-surface-container p-8 rounded-lg">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-1">
                  Cashflow Trend
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Income vs Expenses over the last 6 months
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                    Income
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                    Expense
                  </span>
                </div>
              </div>
            </div>

            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CASHFLOW_DATA}
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
                  <Bar
                    dataKey="income"
                    fill="#b4c5ff"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#ffb596"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-surface-container p-8 rounded-lg flex flex-col">
            <h4 className="text-lg font-bold text-on-surface mb-6">
              Expense Breakdown
            </h4>
            <div className="flex-1 flex flex-col justify-center">
              <div className="relative w-48 h-48 mx-auto mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={BREAKDOWN_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {BREAKDOWN_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                    Total
                  </span>
                  <span className="text-xl font-black text-on-surface">
                    $4,980
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {BREAKDOWN_DATA.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-on-surface">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Net Movement */}
        <div className="bg-surface-container p-8 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-lg font-bold text-on-surface">
              Weekly Net Movement
            </h4>
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold text-on-surface uppercase">
                Live Sync
              </span>
            </div>
          </div>

          <div className="h-40 w-full flex items-end gap-3 lg:gap-6">
            {WEEKLY_MOVEMENT.map((item, idx) => (
              <div
                key={idx}
                className="flex-1 h-full flex flex-col justify-end gap-2 group"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  className={cn(
                    "w-full rounded-t-lg transition-all",
                    item.day === "Sat"
                      ? "bg-primary"
                      : "bg-surface-container-highest group-hover:bg-primary/40",
                  )}
                />
                <span
                  className={cn(
                    "text-[9px] text-center font-bold uppercase",
                    item.day === "Sat"
                      ? "text-on-surface"
                      : "text-on-surface-variant",
                  )}
                >
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-surface-container p-8 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-lg font-bold text-on-surface">
                Recent Transactions
              </h4>
              <button className="text-xs font-bold text-primary hover:underline cursor-pointer">
                View All History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-outline-variant/10">
                    <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Title
                    </th>
                    <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Category
                    </th>
                    <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Date
                    </th>
                    <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {TRANSACTIONS.map((tx) => (
                    <tr
                      key={tx.id}
                      className="group hover:bg-surface-container-low transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center">
                            {tx.icon}
                          </div>
                          <span className="text-sm font-semibold text-on-surface">
                            {tx.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold",
                            tx.categoryColor,
                          )}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-on-surface-variant">
                        {tx.date}
                      </td>
                      <td
                        className={cn(
                          "py-4 text-right text-sm font-bold",
                          tx.amount > 0 ? "text-primary" : "text-on-surface",
                        )}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Spending Categories */}
          <div className="bg-surface-container p-8 rounded-lg">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-lg font-bold text-on-surface">
                Top Spending Categories
              </h4>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                Monthly Limit
              </span>
            </div>

            <div className="space-y-8">
              {SPENDING_CATEGORIES.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-on-surface">
                      {cat.name}
                    </span>
                    <span className="text-sm font-bold text-on-surface">
                      ${cat.spent.toLocaleString()} / $
                      {cat.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.spent / cat.limit) * 100}%` }}
                      className={cn("h-full rounded-full", cat.color)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-xl bg-primary-container/10 border border-primary-container/20 flex gap-5 items-center">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <Lightbulb className="text-white fill-current" size={24} />
              </div>
              <div>
                <h5 className="text-sm font-bold text-on-surface mb-1">
                  Financial Insight
                </h5>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  You've reduced your infrastructure costs by{" "}
                  <span className="text-primary font-bold">12%</span> this
                  month. Keep it up to hit your Q3 savings goal!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
