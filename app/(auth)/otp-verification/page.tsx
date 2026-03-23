"use client";

import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import { OtpVerificationFormView } from "@/features/auth/components";

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<AuthShell><AuthCard title="OTP verification" subtitle="Loading..." /></AuthShell>}>
      <OtpVerificationFormView />
    </Suspense>
  );
}
