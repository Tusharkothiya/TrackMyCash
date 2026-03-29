"use client";

import { useState, useRef, KeyboardEvent, FormEvent } from "react";
import { Wallet, ShieldCheck, ArrowLeft, Shield, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResendOtp, useVerifyOtp } from "@/hooks/useAuth";

const OTPVerification = () => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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

    const data = await verifyOtpMutation.mutateAsync({
      email,
      otp: otp.join(""),
    });

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
    <motion.div
      key="verification"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <div className="w-full max-w-120">
        {/* Brand Identity */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 primary-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary-container/20">
              <Wallet className="text-on-primary w-7 h-7" />
            </div>
            <span className="text-3xl font-extrabold tracking-tighter text-on-surface">
              TrackMyCash
            </span>
          </div>
          <p className="text-on-surface-variant text-sm tracking-[0.2em] font-label uppercase">
            Premium Financial Ledger
          </p>
        </div>

        {/* Verification Card */}
        <div className="glass-card rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-outline-variant/10">
          {/* Asymmetric Decor Element */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-on-surface mb-3 tracking-tight">
                Verify your email
              </h1>
              <p className="text-on-surface-variant leading-relaxed">
                We've sent a 6-digit code to your email. Please enter it below
                to verify your account.
              </p>
            </header>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* OTP Input Group */}
              <div className="flex justify-between gap-2 md:gap-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder="0"
                    className="w-full aspect-square text-center text-2xl font-bold bg-surface-container-highest border-none rounded-xl text-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 outline-none placeholder:opacity-20"
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-6">
                <button
                  className="w-full login-gradient cursor-pointer! text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-container/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                  type="submit"
                  disabled={isVerifying}
                >
                  <span>{isVerifying ? "Verifying..." : "Verify Code"}</span>
                  <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                </button>

                <div className="text-center">
                  <p className="text-on-surface-variant text-sm mb-6">
                    Didn't receive the code?
                    <button
                      type="button"
                      className="text-primary font-medium hover:underline ml-1 cursor-pointer"
                      onClick={handleResendOtp}
                      disabled={isResending}
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium cursor-pointer"
                    onClick={() => router.push("/login")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Context */}
        <div className="mt-12 flex justify-center items-center space-x-10 opacity-30 grayscale pointer-events-none">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-label uppercase tracking-widest">
              Secure Ledger
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-label uppercase tracking-widest">
              AES-256 Auth
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OTPVerification;
