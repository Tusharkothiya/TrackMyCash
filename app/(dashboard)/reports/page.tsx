import Link from "next/link";
import { FileChartColumnIncreasing } from "lucide-react";
import { reports } from "@/features/dashboard/services/dummy-data";

export default function ReportsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {reports.map((report) => (
        <article key={report.id} className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-5">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-blue-50">{report.title}</h2>
              <p className="text-xs text-blue-200/70">{report.period}</p>
            </div>
            <FileChartColumnIncreasing className="h-5 w-5 text-blue-300/70" />
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg bg-slate-950/50 p-3 text-sm">
            <div>
              <p className="text-xs text-blue-200/70">Revenue</p>
              <p className="font-semibold text-emerald-600">${report.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-blue-200/70">Expense</p>
              <p className="font-semibold text-red-600">${report.expense.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-blue-200/70">Net</p>
              <p className="font-semibold text-blue-50">${report.net.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-blue-200/70">Updated {report.updatedAt}</p>
            <Link href={`/reports/${report.id}`} className="text-sm font-medium text-blue-300 hover:underline">Open report</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
