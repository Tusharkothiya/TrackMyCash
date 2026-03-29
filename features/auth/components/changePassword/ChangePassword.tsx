"use client";

import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import {
  Wallet,
  Eye,
  EyeOff,
  Shield,
  Lock,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useChangePassword } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

const ChangePassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const changePasswordMutation = useChangePassword();

  const [message, setMessage] = useState<string | null>(null);

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!email || !token) {
      setMessage(
        "Reset details are missing. Please restart forgot password flow.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    const data = await changePasswordMutation.mutateAsync({
      email,
      password,
      token,
    });

    if (!data?.success) {
      setMessage(data?.message || "Unable to change password.");
      return;
    }

    router.push("/login?reset=1");
  }

  const isLoading = changePasswordMutation.isPending;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 bg-[#0D1117] relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full" />

      <div className="w-full max-w-120 z-10">
        {/* Brand Identity */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 primary-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="text-on-primary-container w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-on-surface uppercase">
              TrackMyCash
            </span>
          </div>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#161B22] border border-[#21262D] rounded-xl p-8 sm:p-10 shadow-2xl relative"
        >
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Change Password
            </h1>
            <p className="text-[#8B949E] text-sm leading-relaxed">
              Enter your new password below to secure your account. Ensure it's
              unique and strong.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="space-y-2">
              <label
                className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-1"
                htmlFor="new_password"
              >
                New Password
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-highest text-on-surface border-none rounded-lg py-4 pl-4 pr-12 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-outline-variant outline-none"
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  name="password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-1"
                htmlFor="confirm_password"
              >
                Confirm New Password
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-highest text-on-surface border-none rounded-lg py-4 pl-4 pr-12 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-outline-variant outline-none"
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  name="confirmPassword"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-surface-container-low rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-medium text-on-surface-variant uppercase tracking-tighter">
                <CheckCircle2 size={14} className="text-primary" />
                Security Protocol
              </div>
              <p className="text-[12px] text-[#8B949E]">
                At least 12 characters, including numbers and symbols.
              </p>
            </div>

            {message ? <p className="text-sm text-red-600">{message}</p> : null}

            {/* Update Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full login-gradient cursor-pointer! text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-container/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
              type="submit"
            >
               {isLoading ? "Updating password..." : "Change Password"}
              <ArrowRight size={20} />
            </motion.button>
          </form>
        </motion.div>

        {/* Security Footer */}
        <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
          <div className="flex items-center gap-1.5">
            <Lock size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              End-to-End Encrypted
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Atelier Protected
            </span>
          </div>
        </div>
      </div>

      {/* Contextual Visual Element (Pro Tip) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden lg:block fixed bottom-12 left-12 max-w-xs space-y-4"
      >
        <div className="bg-surface-container glass-effect p-6 rounded-xl border border-outline-variant/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Info size={18} className="text-tertiary" />
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
              Pro Tip
            </span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Rotating your password every 90 days significantly reduces the risk
            of unauthorized ledger access. Enable 2FA in settings for maximum
            security.
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default ChangePassword;
