export default function SettingsPage() {
  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-blue-900/40 bg-slate-900/70 p-5">
      <h2 className="text-base font-semibold text-blue-50">Profile Settings</h2>
      <p className="mt-1 text-sm text-blue-200/80">Dummy form for upcoming profile management flow.</p>

      <form className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input className="rounded-lg border border-blue-900/50 bg-slate-950/50 px-3 py-2.5 text-sm text-blue-100 placeholder:text-blue-300/60" placeholder="Full Name" defaultValue="Demo User" />
        <input className="rounded-lg border border-blue-900/50 bg-slate-950/50 px-3 py-2.5 text-sm text-blue-100 placeholder:text-blue-300/60" placeholder="Email" defaultValue="demo@trackmycash.com" />
        <input className="rounded-lg border border-blue-900/50 bg-slate-950/50 px-3 py-2.5 text-sm text-blue-100 placeholder:text-blue-300/60" placeholder="Company" defaultValue="TrackMyCash Labs" />
        <input className="rounded-lg border border-blue-900/50 bg-slate-950/50 px-3 py-2.5 text-sm text-blue-100 placeholder:text-blue-300/60" placeholder="Phone" defaultValue="+1 555 483 2201" />
        <div className="sm:col-span-2">
          <button type="button" className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 sm:w-auto">Save Changes</button>
        </div>
      </form>
    </section>
  );
}
