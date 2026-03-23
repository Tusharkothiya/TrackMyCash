import Link from "next/link";
import { notFound } from "next/navigation";
import { getReportById } from "@/features/dashboard/services/dummy-data";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = getReportById(id);

  if (!report) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">{report.title}</h2>
        <Link href="/reports" className="text-sm font-medium text-zinc-700 hover:underline">Back to reports</Link>
      </div>

      <article className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-sm text-zinc-600">Period: {report.period}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="text-xs text-emerald-700">Revenue</p>
            <p className="text-lg font-semibold text-emerald-800">${report.revenue.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-xs text-red-700">Expense</p>
            <p className="text-lg font-semibold text-red-800">${report.expense.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-zinc-100 p-3">
            <p className="text-xs text-zinc-600">Net</p>
            <p className="text-lg font-semibold text-zinc-900">${report.net.toLocaleString()}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-500">Last updated: {report.updatedAt}</p>
      </article>
    </section>
  );
}
