import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, CircleDollarSign, Landmark, ReceiptText, Tag } from "lucide-react";
import { getTransactionById } from "@/features/dashboard/services/dummy-data";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = getTransactionById(id);

  if (!transaction) {
    notFound();
  }

  const statusStyles = transaction.status === "completed"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  const typeStyles = transaction.type === "income"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-200/70">Transaction Details</p>
          <h2 className="mt-1 text-2xl font-semibold text-blue-50">{transaction.title}</h2>
        </div>
        <Link
          href="/transactions"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-blue-900/50 bg-slate-900/70 px-3 py-2 text-sm font-medium text-blue-200 hover:bg-blue-900/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to transactions
        </Link>
      </div>

      <article className="rounded-2xl border border-blue-900/40 bg-slate-900/70 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-blue-200/70">Transaction ID</p>
            <p className="mt-1 font-medium text-blue-50">{transaction.id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles}`}>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> {transaction.status}
            </span>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${typeStyles}`}>
              <Tag className="mr-1 h-3.5 w-3.5" /> {transaction.type}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-blue-900/40 bg-slate-950/50 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-wide text-blue-200/70">Amount</p>
          <p className={`mt-1 text-3xl font-semibold ${transaction.type === "income" ? "text-emerald-700" : "text-rose-700"}`}>
            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-blue-900/40 p-4">
            <p className="mb-3 text-sm font-semibold text-blue-50">Core Details</p>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <ReceiptText className="mt-0.5 h-4 w-4 text-blue-300/70" />
                <div>
                  <dt className="text-xs text-blue-200/70">Category</dt>
                  <dd className="font-medium text-blue-50">{transaction.category}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Landmark className="mt-0.5 h-4 w-4 text-blue-300/70" />
                <div>
                  <dt className="text-xs text-blue-200/70">Account</dt>
                  <dd className="font-medium text-blue-50">{transaction.account}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 text-blue-300/70" />
                <div>
                  <dt className="text-xs text-blue-200/70">Date</dt>
                  <dd className="font-medium text-blue-50">{transaction.date}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-blue-900/40 p-4">
            <p className="mb-3 text-sm font-semibold text-blue-50">Summary</p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-blue-200/70">Transaction Title</p>
                <p className="font-medium text-blue-50">{transaction.title}</p>
              </div>
              <div>
                <p className="text-xs text-blue-200/70">Note</p>
                <p className="rounded-lg bg-slate-950/50 p-3 text-blue-100/90">{transaction.note}</p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-blue-200/70">
                <CircleDollarSign className="h-4 w-4" />
                Auto-generated dummy transaction for dashboard UI flow
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
