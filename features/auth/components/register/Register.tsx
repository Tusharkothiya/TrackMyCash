"use client";

import { useRegister } from "@/hooks/useAuth";
import { USER_ROLES } from "@/lib/constants/common.constants";
import {
  Wallet,
  BarChart3,
  ShieldCheck,
  User,
  Mail,
  Lock,
  UserCheck,
  Check,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

const Register = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const registerMutation = useRegister();
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: USER_ROLES.USER,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    registerMutation.mutate(payload, {
      onSuccess: (response: { success?: boolean; message?: string }) => {
        if (response?.success) {
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          router.push(
            "/otp-verification?email=" +
              encodeURIComponent(formData.email.trim()),
          );
        } else {
          setMessage(response?.message || "Registration failed.");
        }
      },
      onError: (error: { message?: string }) => {
        setMessage(
          error?.message || "Something went wrong while creating your account.",
        );
      },
    });
  }

  const isLoading = registerMutation.isPending;

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left Side: Brand Panel */}
      <section className="relative hidden md:flex md:w-1/2 flex-col justify-between p-12 bg-surface-container-lowest overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Abstract digital network visualization"
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0cQ1AlUpadeJleepCXsudexOWByqtJmQ51wEiswyDEFraMMaThtEiC1NadUon639CFqMb5ZrWCTxnPFty5nN0a0bR7FkzF-TMmNm6sAHYX3ixow9mB_F4wC3GaYx3IhIhJM0-nPc00ovb1QFf8993mWWZKQvV2OzE9tVfKErNW_1oxVykwadlbkpRth8nAuEJnBqO5xWuAMCpX6_5tsezMN6L1_AYMydlYTrnXBYpYY-KEL7r0PAHXCXGhUlSbtpQYIcf_UX1pt6-"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-surface-container-lowest via-transparent to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3">
            <Wallet className="text-primary w-8 h-8 fill-primary/20" />
            <h1 className="text-xl font-black tracking-tight text-on-surface uppercase">
              TrackMyCash
            </h1>
          </div>
        </motion.div>

        <div className="relative z-10 max-w-lg">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs font-bold tracking-[0.2em] text-primary mb-4 block uppercase"
          >
            The Digital Ledger of High Fidelity
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl font-extrabold leading-tight text-on-surface mb-6"
          >
            Master your <span className="text-primary-fixed-dim">wealth</span>{" "}
            with surgical precision.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-on-surface-variant text-lg leading-relaxed mb-10"
          >
            Experience a premium financial management ecosystem designed for the
            modern architect of capital. Elegant, secure, and intuitive.
          </motion.p>

          {/* Feature Highlights */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-start gap-4 p-4 rounded-xl glass-effect border border-outline-variant/10"
            >
              <BarChart3 className="text-primary w-6 h-6" />
              <div>
                <h4 className="font-bold text-on-surface">
                  Advanced Data Intelligence
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Real-time analytics and predictive budget forecasting.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-start gap-4 p-4 rounded-xl glass-effect border border-outline-variant/10"
            >
              <ShieldCheck className="text-primary w-6 h-6" />
              <div>
                <h4 className="font-bold text-on-surface">
                  Encrypted Sovereignty
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Bank-grade security ensures your data remains yours alone.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="relative z-10 flex items-center gap-6"
        >
          <div className="flex -space-x-3">
            <img
              alt="User 1"
              className="w-10 h-10 rounded-full border-2 border-surface-container-lowest"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCyF-0shYK2mPIllvc7e5rdPDKr1SENbeW0mVxJL9vd_5W3KK3TjY0IvxTp8kDurTYFUSgxyIRLnk7mKakuo3bayfVDEly6nCChpvlRoiqFNaLyG5r6iWXbls8tyxo5g2eRLpceh3B2VYY4rHkQDJm6iy_nX9ohn78bo0ELI5TzqgtFEqNlKMYATEfh22EyWIgw8AgK7OuxzaSjY9UGY-gfliawquRTKB66SelPMvnPEwY6zltM7Q935zFCz1Ntg0vzqL0PKV_ZaHj"
              referrerPolicy="no-referrer"
            />
            <img
              alt="User 2"
              className="w-10 h-10 rounded-full border-2 border-surface-container-lowest"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP8xHw47P1vVXmNdQsCzfg1drzXFAoPAt_Q3HmfE1Th8I9ODdDNuOf9N4t390ikE7GjxdUD8xszSRK99G8JJuN_KXWniPKM4YOwpbdQtKrxBEzQoUmJtzjv23K9xqqSAs8JNJXjhefI2uiz1rw2BKjkSmYmKg6NxQ-lZVwBD4PfdJNLUY3sjOemnAnsuXJ66wBPzBQK1dGUmz6QbakD1ZjDp1ok9GLnwyy03qwPLAlY6LsufCcnFYv8SbJ7XoNk7XZjBxHPxu9RVob"
              referrerPolicy="no-referrer"
            />
            <img
              alt="User 3"
              className="w-10 h-10 rounded-full border-2 border-surface-container-lowest"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkpSJzxwepdeOYDLfmQdA2RdEPcDuWaNvqpsdNe5uKo-ofCHgs8GCi8e-TTdL-3xe8mpwsq0bj6hQHWYDw9wrs6E0zxm1_o_ZScQGMjKI6EzsSW-ECRiatKleFxYG3TqRIJnKi8GUY-3t5cje2NAQqu8EWBnnUOkPzyZ-nrGaPhIRZb7eIfpoOBXNYEDgC9JXf_0KW3ovqvfU9E7LykPJnIu6Mmwtri6igvBSQA_4ctPz6Wy7rYs4m6IZ5C97TJqewXpahLwETFMK4"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-sm text-on-surface-variant font-medium">
            Joined by 12,000+ financial leaders
          </p>
        </motion.div>
      </section>

      {/* Right Side: Registration Form */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-surface">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Branding */}
          <div className="md:hidden flex flex-col items-center mb-12">
            <Wallet className="text-primary w-12 h-12 mb-2 fill-primary/20" />
            <h1 className="text-2xl font-black tracking-tight text-on-surface">
              TrackMyCash
            </h1>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-bold tracking-tight text-on-surface">
              Create your account
            </h3>
            <p className="text-on-surface-variant">
              Begin your journey to financial clarity today.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-on-surface-variant group-focus-within:text-primary transition-colors w-5 h-5" />
                  </div>
                  <input
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    id="name"
                    name="fullName"
                    placeholder="Enter your full name"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-on-surface-variant group-focus-within:text-primary transition-colors w-5 h-5" />
                  </div>
                  <input
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="text-on-surface-variant group-focus-within:text-primary transition-colors w-5 h-5" />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1"
                    htmlFor="confirm-password"
                  >
                    Confirm
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserCheck className="text-on-surface-variant group-focus-within:text-primary transition-colors w-5 h-5" />
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                      id="confirm-password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                </div>
              </div>
            </div>

            {message ? <p className="text-sm text-red-600">{message}</p> : null}

            {/* Terms & Conditions */}
            <div className="flex items-center gap-3 py-2">
              <div className="relative flex items-center">
                <input
                  className="peer h-5 w-5 appearance-none border-2 border-outline-variant rounded bg-surface-container-highest checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <Check className="absolute text-on-primary pointer-events-none opacity-0 peer-checked:opacity-100 w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 stroke-[4px]" />
              </div>
              <label
                className="text-sm text-on-surface-variant leading-snug cursor-pointer select-none"
                htmlFor="terms"
              >
                I accept the{" "}
                <a
                  className="text-primary hover:underline font-semibold"
                  href="#"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="text-primary hover:underline font-semibold"
                  href="#"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full login-gradient cursor-pointer! text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-container/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
              type="submit"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          {/* Footer Link */}
          <div className="pt-6 text-center">
            <p className="text-on-surface-variant">
              Already have an account?
              <Link
                className="text-primary font-bold ml-1 hover:text-primary-fixed-dim transition-colors"
                href="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Register;
