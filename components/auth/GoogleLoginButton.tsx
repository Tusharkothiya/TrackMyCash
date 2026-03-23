"use client";

export default function GoogleLoginButton() {
  const googleEnabled = false;

  return (
    <button
      type="button"
      onClick={() => undefined}
      disabled={!googleEnabled}
      className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Continue with Google (coming soon)
    </button>
  );
}
