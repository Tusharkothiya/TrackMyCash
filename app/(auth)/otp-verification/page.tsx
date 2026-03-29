
import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import OTPVerification from "@/features/auth/components/otpVerification/OTPVerification";

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<AuthShell><AuthCard title="OTP verification" subtitle="Loading..." /></AuthShell>}>
      <OTPVerification />
    </Suspense>
  );
}
