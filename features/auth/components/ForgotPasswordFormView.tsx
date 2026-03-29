"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import { useForgotPassword } from "@/hooks/useAuth";

export default function ForgotPasswordFormView() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    const data = await forgotPasswordMutation.mutateAsync({ email });

    if (!data?.success) {
      setMessage(data?.message || "Unable to process forgot password request.");
      return;
    }

    const token = data?.data?.resetToken;
    const responseEmail = data?.data?.email || email;

    if (!token) {
      setMessage("Reset token not received. Please try again.");
      return;
    }

    router.push(
      `/change-password?email=${encodeURIComponent(responseEmail)}&token=${encodeURIComponent(token)}`,
    );
  }

  const isLoading = forgotPasswordMutation.isPending;

  return (
    <AuthShell>
      <AuthCard
        title="Forgot password"
        subtitle="Enter your email to continue with password reset."
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-white placeholder:text-white"
            required
          />

          {message ? <p className="text-sm text-red-600">{message}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 cursor-pointer px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
        </form>

        <p className="mt-4 text-sm text-blue-200/80 text-center">
          Back to{" "}
          <Link href="/login" className="font-medium text-white">
            Login
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
