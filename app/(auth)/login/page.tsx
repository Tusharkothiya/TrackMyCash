"use client";

import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import { LoginFormView } from "@/features/auth/components";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthShell><AuthCard title="Welcome back" subtitle="Loading..." /></AuthShell>}>
      <LoginFormView />
    </Suspense>
  );
}
