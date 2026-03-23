"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import OtpInputField from "@/components/auth/OtpInputField";
import { useResendOtp, useVerifyOtp } from "@/hooks/useAuth";

export default function OtpVerificationFormView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const email = searchParams.get("email") || "";
  const otpHint = searchParams.get("otpHint");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage("Email is missing. Please restart forgot password flow.");
      return;
    }

    const data = await verifyOtpMutation.mutateAsync({ email, otp });

    if (!data?.success) {
      setMessage(data?.message || "OTP verification failed.");
      return;
    }

    router.push("/login?verified=1");
  }

  async function handleResendOtp() {
    setMessage(null);

    if (!email) {
      setMessage("Email is missing. Please restart registration flow.");
      return;
    }

    const data = await resendOtpMutation.mutateAsync({ email });

    if (!data?.success) {
      setMessage(data?.message || "Unable to resend OTP.");
      return;
    }

    setMessage(data?.message || "A new OTP has been sent to your email.");
  }

  const isVerifying = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;

  return (
    <AuthShell>
      <AuthCard title="OTP verification" subtitle="Enter the 6-digit OTP sent to your email.">
        {otpHint ? <p className="mb-3 rounded-md bg-zinc-100 px-3 py-2 text-xs text-zinc-700">Dev OTP: {otpHint}</p> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" value={email} readOnly className="w-full rounded-lg border border-zinc-300 bg-[#0C1326] px-3 py-2.5 text-sm placeholder:text-white text-white" />

          <OtpInputField value={otp} onChange={setOtp} />

          {message ? <p className="text-sm text-red-600">{message}</p> : null}

          <button type="submit" disabled={isVerifying || isResending || otp.length !== 6} className="w-full rounded-lg bg-blue-600 cursor-pointer px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isVerifying || isResending}
            className="w-full rounded-lg border border-zinc-300 cursor-pointer px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {isResending ? "Resending OTP..." : "Resend OTP"}
          </button>
        </form>

        <p className="mt-4 text-sm text-blue-200/80 text-center">
          Back to <Link href="/login" className="font-medium text-white">Login</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
