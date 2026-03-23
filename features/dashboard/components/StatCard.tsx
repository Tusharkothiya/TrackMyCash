type StatCardProps = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
};

export default function StatCard({ label, value, change, positive }: StatCardProps) {
  return (
    <article className="rounded-xl border border-blue-900/40 bg-slate-900/70 p-4 sm:p-5">
      <p className="text-sm text-blue-200/70">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-blue-50">{value}</p>
      <p className={`mt-1 text-xs font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>{change}</p>
    </article>
  );
}
