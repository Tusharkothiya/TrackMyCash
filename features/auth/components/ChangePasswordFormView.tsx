"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import { useChangePassword } from "@/hooks/useAuth";

export default function ChangePasswordFormView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const changePasswordMutation = useChangePassword();

  const [message, setMessage] = useState<string | null>(null);

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!email || !token) {
      setMessage("Reset details are missing. Please restart forgot password flow.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    const data = await changePasswordMutation.mutateAsync({
      email,
      password,
      token,
    });

    if (!data?.success) {
      setMessage(data?.message || "Unable to change password.");
      return;
    }

    router.push("/login?reset=1");
  }

  const isLoading = changePasswordMutation.isPending;

  return (
    <AuthShell>
      <AuthCard title="Change password" subtitle="Set a new password for your account.">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="email"
            value={email}
            readOnly
            className="w-full rounded-lg border border-zinc-300 bg-[#0C1326] px-3 py-2.5 text-sm placeholder:text-white text-white"
          />

          <input
            name="password"
            type="password"
            placeholder="New Password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder:text-white text-white"
            required
            minLength={6}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder:text-white text-white"
            required
            minLength={6}
          />

          {message ? <p className="text-sm text-red-600">{message}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 cursor-pointer px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Updating password..." : "Change Password"}
          </button>
        </form>

        <p className="mt-4 text-sm text-blue-200/80 text-center">
          Back to <Link href="/login" className="font-medium text-white">Login</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
