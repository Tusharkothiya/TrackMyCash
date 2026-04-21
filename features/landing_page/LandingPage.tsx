"use client";

import { cn } from "@/lib/utils/helper";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Check,
  ChevronDown,
  CirclePlay,
  FingerprintPattern,
  LayoutDashboard,
  RefreshCw,
  Rocket,
  ShieldCheck,
  SquareTerminal,
  Star,
  UserPlus,
  VectorSquare,
} from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const coreFeatures = [
    {
      icon: <LayoutDashboard className="text-4xl text-primary" />,
      title: "Unified dashboard",
      desc: "See balances, recent transactions, goals, and budget progress in one calm view.",
    },
    {
      icon: <FingerprintPattern className="text-4xl text-secondary" />,
      title: "Smart categorization",
      desc: "Keep spending organized automatically so your reports stay clean without manual work.",
    },
    {
      icon: <Brain className="text-4xl text-tertiary" />,
      title: "Budget alerts",
      desc: "Get early warnings before spending crosses your limit, not after the month is over.",
    },
    {
      icon: <VectorSquare className="text-4xl text-primary" />,
      title: "Clear reports",
      desc: "Turn raw transactions into simple summaries you can actually use to decide faster.",
    },
  ];

  const benefits = [
    "Track accounts and transactions in one place",
    "Build budgets that match real spending habits",
    "Review reports without spreadsheet cleanup",
  ];

  const steps = [
    {
      icon: <UserPlus className="text-3xl" />,
      title: "Create your account",
      desc: "Register in a minute and set up your workspace.",
    },
    {
      icon: <ShieldCheck className="text-3xl" />,
      title: "Connect safely",
      desc: "Link your financial data with a security-first flow.",
    },
    {
      icon: <RefreshCw className="text-3xl" />,
      title: "Sync automatically",
      desc: "Let TrackMyCash organize transactions and balances for you.",
    },
    {
      icon: <Rocket className="text-3xl" />,
      title: "Act on insights",
      desc: "Use budgets, alerts, and reports to stay ahead of spending.",
    },
  ];

  const testimonials = [
    {
      name: "Aarav Mehta",
      role: "Freelance Designer",
      text: "TrackMyCash made it easy to see where money was going without juggling separate apps.",
      featured: true,
    },
    {
      name: "Priya Sharma",
      role: "Operations Manager",
      text: "The budget alerts are practical. We catch overspending before it becomes a problem.",
    },
    {
      name: "Nikhil Rao",
      role: "Founder",
      text: "The dashboard feels clean and useful, which is exactly what a finance tool should be.",
    },
  ];

  const faqs = [
    {
      q: "Can I track multiple accounts?",
      a: "Yes. TrackMyCash is designed to bring accounts, transactions, and budgets into one place so you do not need to switch tools.",
    },
    {
      q: "Does it help with monthly budgeting?",
      a: "Yes. You can create budgets, monitor progress, and review spending patterns before the month closes.",
    },
    {
      q: "Is the data easy to export?",
      a: "Yes. Reports and transaction summaries are built to be practical for sharing, reviewing, and archiving.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_35%),radial-gradient(circle_at_right,rgba(255,181,150,0.10),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_25%)]" />

      <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/10 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-on-background">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-container/20 text-primary shadow-lg shadow-primary/10">
              <SquareTerminal className="h-5 w-5" />
            </div>
            TrackMyCash
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "How it Works", "Reviews", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-background"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-background"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary-container shadow-lg shadow-primary-container/20 transition-transform hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-20 pt-32 lg:px-8 lg:pt-40">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface-container/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
              >
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Finance tracking that stays clear
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="max-w-2xl text-5xl font-black tracking-tight text-on-background md:text-6xl lg:text-7xl"
              >
                One dashboard for your money, budgets, and decisions.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant"
              >
                TrackMyCash brings accounts, transactions, budgets, and reports together so you can understand spending faster and act sooner.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  href="/register"
                  className="cta-gradient inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold text-on-primary-container shadow-xl shadow-primary-container/25 transition-transform hover:scale-[1.01]"
                >
                  Start free
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-outline-variant/15 bg-surface-container/70 px-7 py-4 text-base font-bold text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  <CirclePlay className="h-5 w-5" />
                  Explore features
                </a>
              </motion.div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-on-surface-variant">
                {benefits.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-outline-variant/10 bg-surface-container/40 px-4 py-2">
                    <Check className="h-4 w-4 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-4xl border border-outline-variant/10 bg-surface-container-lowest shadow-2xl shadow-black/30">
                <div className="flex items-center gap-2 border-b border-outline-variant/10 bg-surface-container px-5 py-4">
                  <span className="h-3 w-3 rounded-full bg-error/70" />
                  <span className="h-3 w-3 rounded-full bg-tertiary/70" />
                  <span className="h-3 w-3 rounded-full bg-primary/70" />
                  <span className="ml-3 text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                    Live overview
                  </span>
                </div>
                <div className="grid gap-4 p-5 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container">
                    <img
                      alt="TrackMyCash dashboard preview"
                      className="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida/ADBb0uhVO-vt1Ul1xXou3ST4f6mTbZDYXgz2iWlLj5kRzyqG88GvSlrlVndWTpcg3AZSDIp_7p7fA5LtVJKCcupBGv7vc-rsOhC35ndNvXrxCUXX9zczo7xzbEh4f_sLNSctwqeGfQeNuCx2pShrbG2e4BFdRaYTyHqKSb39_wB90A_QJoibEBEtPdAk-c6qKn2H3WrlsECPs-CBEN9pG95lyJpilQZuhdpKVBb2T4Oeu_mEz7srLB2JZDAbTwbALDsx8wkqKkRHD04Lj2Q"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="grid gap-4">
                    {[
                      { label: "Monthly budget used", value: "68%" },
                      { label: "Transactions reviewed", value: "1,284" },
                      { label: "Alerts this week", value: "07" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-3xl border border-outline-variant/10 bg-surface-container p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                          {item.label}
                        </p>
                        <p className="mt-3 text-3xl font-black tracking-tight text-on-background">
                          {item.value}
                        </p>
                      </div>
                    ))}
                    <div className="rounded-3xl border border-primary/15 bg-primary/5 p-5">
                      <p className="text-sm font-semibold text-on-background">
                        Budget insight
                      </p>
                      <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                        Your dining spend is trending 12% above last month. Adjust the limit before the next cycle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 rounded-4xl border border-outline-variant/10 bg-surface-container/50 p-5 shadow-2xl shadow-black/10 md:grid-cols-3 md:p-8">
            {[
              { label: "Connected accounts", value: "12+" },
              { label: "Categories tracked", value: "32" },
              { label: "Reports generated", value: "100%" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-2xl bg-surface-container-low px-6 py-6 text-center",
                  idx === 1 && "md:border-x md:border-outline-variant/10",
                )}
              >
                <p className="text-4xl font-black tracking-tight text-on-background">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-outline-variant/10 bg-surface-container-lowest/40 py-10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-on-surface-variant/70 lg:px-8">
            <span>Accounts</span>
            <span>Budgets</span>
            <span>Transactions</span>
            <span>Reports</span>
            <span>Alerts</span>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Features</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-on-background md:text-4xl">
              Everything the landing page should explain, in plain language.
            </h2>
            <p className="mt-4 text-lg leading-8 text-on-surface-variant">
              The product is strongest when it shows immediate value. This version focuses on clarity, not jargon.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {coreFeatures.map((feature) => (
              <div key={feature.title} className="group rounded-4xl border border-outline-variant/10 bg-surface-container p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-surface-container-high">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-on-background">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-tertiary">
                How it works
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-on-background md:text-4xl">
                A simple flow from setup to useful insight.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-on-surface-variant">
                The goal is not to overwhelm users. It is to help them connect data, understand trends, and make better money decisions quickly.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-[1.75rem] border border-outline-variant/10 bg-surface-container/70 p-6">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high text-primary">
                    {step.icon}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-on-background">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className={cn(
                  "rounded-4xl border p-8",
                  testimonial.featured
                    ? "border-primary/20 bg-surface-container-high shadow-2xl shadow-primary/5"
                    : "border-outline-variant/10 bg-surface-container/70",
                )}
              >
                <div className="mb-6 flex gap-1 text-tertiary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg leading-8 text-on-background">
                  {testimonial.text}
                </p>
                <div className="mt-8 flex items-center gap-4 border-t border-outline-variant/10 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-highest font-bold text-primary">
                    {testimonial.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-bold text-on-background">
                      {testimonial.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-4xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-on-background md:text-4xl">
              Questions users will ask before they sign up.
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container/60">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-on-background transition-colors hover:bg-surface-container/80"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-primary transition-transform", activeFaq === index && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm leading-7 text-on-surface-variant">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:pb-32 lg:pt-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-primary-container via-primary-container to-tertiary-container p-8 text-on-primary-container shadow-2xl shadow-primary/20 md:p-14">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                Start with a cleaner view of your money today.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 opacity-90 md:text-lg">
                If the goal is better spending visibility, the landing page should say that clearly and let users move straight into the product.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/register" className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-black text-primary-container shadow-xl transition-transform hover:scale-[1.01]">
                  Create account
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant/10 bg-surface-container-lowest/70 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-lg font-bold text-on-background">TrackMyCash</p>
            <p className="mt-2 max-w-md text-sm leading-7 text-on-surface-variant">
              A clearer way to track accounts, budgets, transactions, and reports.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-on-surface-variant">
            <a href="#features" className="transition-colors hover:text-on-background">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-on-background">
              How it works
            </a>
            <a href="#faq" className="transition-colors hover:text-on-background">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;