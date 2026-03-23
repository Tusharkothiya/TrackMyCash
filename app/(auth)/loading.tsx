import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";

export default function AuthLoading() {
  return (
    <AuthShell>
      <AuthCard title="Please wait" subtitle="Loading page..." />
    </AuthShell>
  );
}
