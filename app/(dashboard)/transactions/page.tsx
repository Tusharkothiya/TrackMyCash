import Link from "next/link";
import { transactions } from "@/features/dashboard/services/dummy-data";

export default function TransactionsPage() {
  return (
    <section className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-blue-50">All Transactions</h2>
        <span className="text-xs text-blue-200/70">Dummy data for UI flow</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-blue-900/40 text-xs uppercase tracking-wide text-blue-200/70">
            <tr>
              <th className="px-2 py-3">Title</th>
              <th className="px-2 py-3">Category</th>
              <th className="px-2 py-3">Date</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-b border-blue-900/30">
                <td className="px-2 py-3 font-medium text-blue-50">
                  <Link href={`/transactions/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                </td>
                <td className="px-2 py-3 text-blue-200/80">{item.category}</td>
                <td className="px-2 py-3 text-blue-200/80">{item.date}</td>
                <td className="px-2 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${item.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.status}
                  </span>
                </td>
                <td className={`px-2 py-3 text-right font-semibold ${item.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                  {item.type === "income" ? "+" : "-"}${item.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
