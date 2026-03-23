import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <section className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-black">TrackMyCash</h1>
        <p className="mt-2 text-zinc-600">Professional authentication flow is now integrated.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white">
            Login
          </Link>
          <Link href="/register" className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700">
            Register
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700">
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
