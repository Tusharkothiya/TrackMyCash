"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import AuthShell from "@/components/auth/AuthShell";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import CountrySelectField from "@/features/auth/components/CountrySelectField";
import { USER_ROLES } from "@/lib/constants/common.constants";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterFormView() {
  const registerMutation = useRegister();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!formData.country) {
      setMessage("Please select your country.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      country: formData.country,
      role: USER_ROLES.USER,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    registerMutation.mutate(payload, {
      onSuccess: (response: { success?: boolean; message?: string }) => {
        if (response?.success) {
          setMessage(response.message || "Registration successful!");
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            country: "",
          });
          router.push("/otp-verification?email=" + encodeURIComponent(formData.email.trim()));
        } else {
          setMessage(response?.message || "Registration failed.");
        }
      },
      onError: (error: { message?: string }) => {
        setMessage(error?.message || "Something went wrong while creating your account.");
      },
    });
  }

  const isLoading = registerMutation.isPending;

  return (
    <AuthShell>
      <AuthCard title="Create your account" subtitle="Register to get started.">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fullName"
            placeholder="Full Name"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder:text-white text-white"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder:text-white text-white"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder:text-white text-white"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm placeholder:text-white text-white"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
          <CountrySelectField value={formData.country} onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))} />

          {message ? <p className="text-sm text-red-600">{message}</p> : null}

          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-blue-600 cursor-pointer px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="my-4 h-px bg-zinc-200" />
        <GoogleLoginButton />

        <p className="mt-4 text-sm text-blue-200/80 text-center">
          Already have an account? <Link href="/login" className="font-medium text-white">Login</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
