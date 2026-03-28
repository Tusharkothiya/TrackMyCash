"use client";

import React, { useState } from "react";
import Joi from "joi";
import { loginSchema } from "@/validations/auth.schema";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ChevronRight, Apple } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { SewingPinFilledIcon } from "@radix-ui/react-icons";
import { useLogin } from "@/hooks/useAuth";

function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      whileHover={{ backgroundColor: "var(--color-surface-bright)" }}
      className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-high rounded-xl transition-colors border-none text-on-surface text-sm font-medium"
    >
      {icon}
      {label}
    </motion.button>
  );
}

const WalletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    <path d="M15 13a2 2 0 0 0 0 4h3" />
  </svg>
);

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const loginMutation = useLogin();

  // Validate form fields using Joi schema
  const validate = () => {
    const { error } = loginSchema.validate({ email, password }, { abortEarly: false });
    if (!error) return null;
    return error.details.map((d) => d.message).join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    const result = await loginMutation.mutateAsync({ email, password });
    setLoading(false);
    if (result?.success) {
      router.replace("/dashboard");
      router.refresh();
    } else {
      setError(result?.message || "Invalid email or password.");
    }
  };

  return (
    <section className="flex flex-col justify-center p-8 md:p-16 bg-surface-container">
      {/* Mobile Logo (Visible only on small screens) */}
      <div className="md:hidden flex items-center gap-3 mb-10">
        <div className="w-8 h-8 login-gradient rounded-lg flex items-center justify-center shadow-lg shadow-primary-container/20">
          <div className="text-on-primary-container scale-75">
            <WalletIcon />
          </div>
        </div>
        <span className="text-xl font-black tracking-tighter text-on-surface">
          TrackMyCash
        </span>
      </div>

      <header className="mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-on-surface mb-2"
        >
          Welcome Back
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-on-surface-variant"
        >
          Sign in to your financial dashboard to continue.
        </motion.p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            </div>
            <input
              className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              id="email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              className="text-xs font-medium text-primary hover:text-surface-tint transition-colors"
              href="/forgot-password"
              prefetch={false}
              shallow={true}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            </div>
            <input
              className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3 py-1">
          <div className="relative flex items-center">
            <input
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-outline-variant bg-surface-container-highest checked:bg-primary-container checked:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              id="remember"
              type="checkbox"
            />
            <svg
              className="absolute h-3.5 w-3.5 pointer-events-none hidden peer-checked:block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <label
            className="text-sm text-on-surface-variant cursor-pointer select-none"
            htmlFor="remember"
          >
            Stay signed in for 30 days
          </label>
        </div>

        {/* Sign In Button */}
        {error && (
          <div className="text-red-500 text-sm font-medium text-center">{error}</div>
        )}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full login-gradient cursor-pointer! text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-container/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </form>

      {/* Social Login Separator */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant opacity-20"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="px-4 bg-surface-container text-on-surface-variant">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SocialButton
          icon={
            <img
              alt="Google"
              className="w-5 h-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVIZAgOORPAGCZBjzFVOtcVrCV4qeDA8D-kuaLxWgs2o7n2c4vH7yW958Q8mmHLvtZ3GkOwrhFR5Bzv7nlO-0776kqnecZOyQSY3AU4gTsRVhgXKQ6qWWAyJkNltBG7BOce-GDiFQFQMobuapL7ZKnYu93JxZDTENCY04W8WY3ed7b8IcAeb-d-iHAMhnOOpimBOlbGShBMMtkQJZ1coX1glTZ7fkTG5ZW3759EztnkV42WARhVyBU7BhL1KVmIaOxAHadXGtZwolo"
              referrerPolicy="no-referrer"
            />
          }
          label="Google"
        />
        <SocialButton icon={<Apple className="w-5 h-5" />} label="Apple" />
      </div>

      <footer className="mt-10 text-center">
        <p className="text-sm text-on-surface-variant">
          Don't have an account?
          <Link
            className="text-primary font-bold hover:underline ml-1 transition-all"
            href="/register"
            prefetch={false}
            shallow={true}
          >
            Register Now
          </Link>
        </p>
      </footer>
    </section>
  );
};

export default LoginForm;
