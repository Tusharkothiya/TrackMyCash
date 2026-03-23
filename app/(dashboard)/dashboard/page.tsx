import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ReceiptText } from "lucide-react";
import StatCard from "@/features/dashboard/components/StatCard";
import { activities, dashboardStats, transactions } from "@/features/dashboard/services/dummy-data";

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
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CashflowTrendChart />
        </div>
        <ExpenseBreakdownChart />
      </section>

      <section>
        <WeeklyNetChart />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-blue-50">Recent Transactions</h2>
            <Link href="/transactions" className="inline-flex items-center gap-1 text-sm font-medium text-blue-300 hover:text-blue-200">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {latestTransactions.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-blue-900/30 bg-slate-950/40 p-3">
                <div>
                  <p className="text-sm font-medium text-blue-50">{item.title}</p>
                  <p className="text-xs text-blue-200/60">{item.category} • {item.date}</p>
                </div>
                <p className={`text-sm font-semibold ${item.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                  {item.type === "income" ? "+" : "-"}${item.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-5">
          <h2 className="mb-4 text-base font-semibold text-blue-50">Activity Feed</h2>
          <ul className="space-y-3">
            {activities.map((activity) => (
              <li key={activity} className="flex items-start gap-2 text-sm text-blue-200/80">
                <ReceiptText className="mt-0.5 h-4 w-4 text-blue-300/70" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
