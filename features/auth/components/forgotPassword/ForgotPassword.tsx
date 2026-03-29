"use client";

import { useState, FormEvent } from "react";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useForgotPassword } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const [message, setMessage] = useState<string | null>(null);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    const data = await forgotPasswordMutation.mutateAsync({ email });

    if (!data?.success) {
      setMessage(data?.message || "Unable to process forgot password request.");
      return;
    }

    const token = data?.data?.resetToken;
    const responseEmail = data?.data?.email || email;

    if (!token) {
      setMessage("Reset token not received. Please try again.");
      return;
    }

    router.push(
      `/change-password?email=${encodeURIComponent(responseEmail)}&token=${encodeURIComponent(token)}`,
    );
  }

  const isLoading = forgotPasswordMutation.isPending;

  return (
    <div className="min-h-screen bg-[#10141a] text-[#dfe2eb] font-sans flex items-center justify-center p-6 selection:bg-[#b4c5ff]/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#b4c5ff]/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-[120px]"></div>
      </div>

      <main className="relative w-full max-w-110 z-10">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-surface-container flex items-center justify-center rounded-xl mb-6 shadow-xl shadow-black/20 border border--outline-variant/10">
            <Wallet
              className="text-[#b4c5ff] w-8 h-8"
              fill="currentColor"
              fillOpacity={0.2}
            />
          </div>
          <h1 className="text-[#dfe2eb] font-bold text-2xl tracking-tight mb-2">
            TrackMyCash
          </h1>
          <p className="text-on-surface-variant text-sm uppercase tracking-widest font-medium">
            Finance Management
          </p>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface-container rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden border border-outline/10"
            >
              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-[#dfe2eb] font-semibold text-xl mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Enter the email address associated with your account and
                    we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="text-on-surface-variant w-5 h-5 group-focus-within:text-[#b4c5ff] transition-colors" />
                      </div>
                      <input
                        className="w-full bg-surface-container border border-outline text-[#dfe2eb] text-sm rounded-xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-[#b4c5ff]/50 placeholder:text-on-surface-variant/40 transition-all outline-none"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                  </div>

                  {message ? <p className="text-sm text-red-600">{message}</p> : null}

                  <button
                    type="submit"
                    className="w-full py-4 cursor-pointer rounded-xl text-on-primary font-bold text-sm shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #b4c5ff 100%)",
                    }}
                  >
                    {isLoading ? "Processing..." : "Continue"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="mt-10 pt-8 border-t border-outline-variant/10 text-center">
                  <button
                    onClick={() => {}}
                    className="inline-flex cursor-pointer items-center gap-2 text-on-surface-variant hover:text-on-surface text-xs font-medium uppercase tracking-widest transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </button>
                </div>
              </div>
            </motion.div>
          
        </AnimatePresence>

        {/* Footer / Support */}
        <p className="mt-8 text-center text-on-surface-variant text-xs">
          Having trouble?{" "}
          <a href="#" className="text-primary hover:underline">
            Contact financial support
          </a>
        </p>
      </main>

      {/* Visual Detail: Abstract Graphic element */}
      <div className="fixed bottom-0 right-0 p-12 opacity-10 hidden lg:block pointer-events-none">
        <div className="relative w-64 h-64 border border-outline rounded-full">
          <div className="absolute inset-8 border border-outline rounded-full opacity-50"></div>
          <div className="absolute inset-16 border border-outline rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
