"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useLogin } from "@/hooks/useAuth";

export default function LoginFormView() {
  const loginMutation = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const infoMessage = useMemo(() => {
    if (searchParams.get("registered"))
      return "Registration successful. Please login.";
    if (searchParams.get("verified")) return "OTP verified. Please login.";
    if (searchParams.get("reset"))
      return "Password changed successfully. Please login.";
    return null;
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setIsLoading(true);

    const result = await loginMutation.mutateAsync({ email, password });

    setIsLoading(false);

    if (!result?.success) {
      setMessage(result?.message || "Invalid email or password.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <AuthShell>
      <AuthCard title="Welcome back" subtitle="Login to your account.">
        {infoMessage ? (
          <p className="mb-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {infoMessage}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder:text-white text-white"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder:text-white text-white"
            required
            minLength={8}
          />

          {message ? <p className="text-sm text-red-600">{message}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="my-4 h-px bg-zinc-200" />
        <GoogleLoginButton />

        <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
          <Link href="/forgot-password" className="font-medium text-white">
            Forgot password?
          </Link>
          <Link href="/register" className="font-medium text-white">
            Create account
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
