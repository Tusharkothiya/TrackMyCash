import { budgets } from "@/features/dashboard/services/dummy-data";

export default function BudgetsPage() {
  return (
    <section className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-5">
      <h2 className="mb-4 text-base font-semibold text-blue-50">Budget Tracking</h2>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
          return (
            <div key={budget.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <p className="font-medium text-blue-100">{budget.category}</p>
                <p className="text-blue-200/80">${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}</p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-blue-900/40">
                <div
                  className={`h-full ${percentage > 85 ? "bg-red-500" : percentage > 65 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
