"use client";

import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import { ChangePasswordFormView } from "@/features/auth/components";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<AuthShell><AuthCard title="Change password" subtitle="Loading..." /></AuthShell>}>
      <ChangePasswordFormView />
    </Suspense>
  );
}
