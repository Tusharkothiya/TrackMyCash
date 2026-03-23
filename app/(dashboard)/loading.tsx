export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-900/70" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="h-72 animate-pulse rounded-xl bg-slate-900/70 xl:col-span-2" />
        <div className="h-72 animate-pulse rounded-xl bg-slate-900/70" />
      </div>

      <div className="h-72 animate-pulse rounded-xl bg-slate-900/70" />
    </div>
  );
}
