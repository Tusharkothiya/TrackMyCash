"use client";

import { cn } from "@/lib/utils/helper";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BellDot,
  Brain,
  CableCar,
  Check,
  ChevronDown,
  CirclePlay,
  Drum,
  EyeOff,
  FingerprintPattern,
  GlobeX,
  HatGlasses,
  House,
  Infinity,
  LayoutDashboard,
  Moon,
  Play,
  Podcast,
  Quote,
  Radar,
  RefreshCw,
  Rocket,
  Share2,
  Shredder,
  SquareTerminal,
  Star,
  UserPlus,
  VectorSquare,
  X,
} from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md shadow-2xl shadow-black/40">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <Link href={'/'} className="text-xl font-bold tracking-tight text-on-background flex items-center gap-2">
            <HatGlasses className="text-primary" />
            TrackMyCash
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            {["Features", "How it Works", "Pricing", "Testimonials"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-on-surface-variant hover:text-on-background transition-colors text-sm font-medium"
                >
                  {item}
                </a>
              ),
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href={'/login'} className="text-on-surface-variant hover:text-on-background transition-all px-4 py-2 text-sm font-medium active:scale-95">
              Login
            </Link>
            <Link href={'/register'} className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-container/90 active:scale-95 transition-transform shadow-lg shadow-primary-container/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-200 h-200 bg-primary/10 rounded-full blur-[160px] -z-10 opacity-60"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/50 border border-outline-variant/20 text-primary mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              Enterprise Grade Security
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.05]"
          >
            Master the Art of <br />
            <span className="hero-gradient">High-Fidelity Finance</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium opacity-80"
          >
            A surgical instrument for your wealth. Experience unified tracking
            and predictive budgeting designed for the high-performance
            individual.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
          >
            <button className="cta-gradient text-on-primary-container px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary-container/25">
              Begin Your Ledger
            </button>
            <button className="bg-surface-container-high/50 backdrop-blur text-on-surface px-8 py-4 rounded-xl font-bold text-lg border border-outline-variant/10 hover:bg-surface-bright active:scale-95 transition-all flex items-center justify-center gap-2">
              <CirclePlay /> Watch Simulation
            </button>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 via-transparent to-primary/10 rounded-[2.5rem] blur-2xl opacity-40"></div>
            <div className="border-8 border-surface-container rounded-4xl shadow-2xl bg-surface-container-lowest overflow-hidden group">
              <div className="w-full h-8 bg-surface-container flex items-center px-4 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-error/40"></div>
                <div className="w-2 h-2 rounded-full bg-tertiary/40"></div>
                <div className="w-2 h-2 rounded-full bg-primary/40"></div>
              </div>
              <div className="relative bg-surface-container-lowest aspect-16/10 flex items-center justify-center overflow-hidden">
                <img
                  alt="TrackMyCash High Fidelity Dashboard"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-[1.02]"
                  src="https://lh3.googleusercontent.com/aida/ADBb0uhVO-vt1Ul1xXou3ST4f6mTbZDYXgz2iWlLj5kRzyqG88GvSlrlVndWTpcg3AZSDIp_7p7fA5LtVJKCcupBGv7vc-rsOhC35ndNvXrxCUXX9zczo7xzbEh4f_sLNSctwqeGfQeNuCx2pShrbG2e4BFdRaYTyHqKSb39_wB90A_QJoibEBEtPdAk-c6qKn2H3WrlsECPs-CBEN9pG95lyJpilQZuhdpKVBb2T4Oeu_mEz7srLB2JZDAbTwbALDsx8wkqKkRHD04Lj2Q"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-transparent to-transparent opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                    <Play className="text-4xl text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 py-12 px-8 bg-surface-container/40 backdrop-blur border border-outline-variant/10 rounded-4xl">
            {[
              { label: "Verified Curators", value: "12,000+" },
              { label: "Assets Logged", value: "₹4.2Cr+" },
              { label: "Engine Uptime", value: "99.9%" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex flex-col items-center",
                  idx === 1 &&
                    "border-y md:border-y-0 md:border-x border-outline-variant/10 py-8 md:py-0",
                )}
              >
                <span className="text-4xl font-extrabold text-on-surface tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-2 opacity-60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 border-y border-outline-variant/10 bg-surface-container-lowest/30 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee gap-16">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex gap-16 items-center min-w-full justify-around"
            >
              <span className="text-sm font-bold text-outline/40 flex items-center gap-2 tracking-[0.3em]">
                <Drum className="text-lg" /> ACME CORP
              </span>
              <span className="text-sm font-bold text-outline/40 flex items-center gap-2 tracking-[0.3em]">
                <Shredder className="text-lg" /> NEXUS LABS
              </span>
              <span className="text-sm font-bold text-outline/40 flex items-center gap-2 tracking-[0.3em]">
                <Radar className="text-lg" /> ORBIT FINANCE
              </span>
              <span className="text-sm font-bold text-outline/40 flex items-center gap-2 tracking-[0.3em]">
                <Infinity className="text-lg" /> INFINITY SVCS
              </span>
              <span className="text-sm font-bold text-outline/40 flex items-center gap-2 tracking-[0.3em]">
                <Moon className="text-lg" /> TITAN SECURE
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
            Financial friction is <br /> a{" "}
            <span className="text-error">system failure</span>.
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto text-lg opacity-70">
            Legacy tools are built on friction. Spreadsheets break, bank apps
            lag, and manual entries fail when you need them most.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <SquareTerminal />,
              title: "Static Ledger Decay",
              desc: "Broken formulas and outdated rows. Spending hours troubleshooting sheets instead of building wealth.",
            },
            {
              icon: <EyeOff />,
              title: "Opaque Cashflows",
              desc: 'Ghost subscriptions and silent drains. The "where did it go?" syndrome is a symptom of poor tooling.',
            },
            {
              icon: <BellDot />,
              title: "Reactive Alerting",
              desc: "Notifications that arrive after the damage is done. Realizing overspending only once the statement closes.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-10 bg-surface-container/60 rounded-3xl border border-outline-variant/10 hover:border-error/30 transition-all duration-500 group"
            >
              <div className="w-14 h-14 bg-error-container/10 rounded-xl flex items-center justify-center mb-8 text-error border border-error/20 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                {item.title}
              </h3>
              <p className="text-on-surface-variant leading-relaxed font-medium opacity-80">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section
        id="features"
        className="py-32 px-8 max-w-7xl mx-auto bg-surface-container-lowest rounded-[4rem] border border-outline-variant/10"
      >
        <div className="text-center mb-24">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">
            Engineered for Fidelity
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight">
            The Core Financial OS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="md:col-span-4 bg-surface-container p-12 rounded-[2.5rem] relative overflow-hidden group border border-outline-variant/10 hover:border-primary/30 transition-colors">
            <div className="relative z-10 max-w-md">
              <LayoutDashboard className="text-5xl text-primary mb-8" />
              <h3 className="text-3xl font-bold mb-6 tracking-tight">
                Real-Time Core Dashboard
              </h3>
              <p className="text-on-surface-variant text-lg leading-relaxed opacity-80">
                A millisecond-accurate view of your entire financial universe.
                No refreshing, no waiting, just pure data.
              </p>
            </div>
          </div>
          <div className="md:col-span-2 bg-surface-container p-10 rounded-[2.5rem] border border-primary/10 hover:border-primary/30 transition-colors">
            <Brain className="text-4xl text-tertiary mb-6" />
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              AI Forecaster
            </h3>
            <p className="text-on-surface-variant font-medium opacity-70">
              Predictive algorithms that map your future spending based on
              current velocity and seasonal trends.
            </p>
          </div>
          <div className="md:col-span-2 bg-surface-container p-10 rounded-[2.5rem] border border-outline-variant/10 hover:border-primary/30 transition-colors">
            <FingerprintPattern className="text-4xl text-secondary mb-6" />
            <h3 className="text-xl font-bold mb-4 tracking-tight">
              Neural Classification
            </h3>
            <p className="text-on-surface-variant text-sm opacity-70">
              Autonomous merchant recognition that categorizes every rupee with
              99% accuracy.
            </p>
          </div>
          <div className="md:col-span-2 bg-surface-container p-10 rounded-[2.5rem] border border-outline-variant/10 hover:border-primary/30 transition-colors">
            <VectorSquare className="text-4xl text-primary mb-6" />
            <h3 className="text-xl font-bold mb-4 tracking-tight">
              Vector Reports
            </h3>
            <p className="text-on-surface-variant text-sm opacity-70">
              High-resolution visualizations of your habits, exportable as
              professional-grade financial dossiers.
            </p>
          </div>
          <div className="md:col-span-2 bg-surface-container p-10 rounded-[2.5rem] border border-outline-variant/10 hover:border-primary/30 transition-colors">
            <GlobeX name="hub" className="text-4xl text-tertiary mb-6" />
            <h3 className="text-xl font-bold mb-4 tracking-tight">
              Omni-Connect
            </h3>
            <p className="text-on-surface-variant text-sm opacity-70">
              Direct secure links to 15,000+ financial nodes. One conduit for
              all your data streams.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Dives */}
      <section className="py-32 space-y-48">
        {/* Row 1 */}
        <div className="px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 relative">
            <div className="absolute -inset-10 bg-primary/5 blur-[100px] -z-10"></div>
            <div className="border-8 border-surface-container rounded-4xl bg-surface-container-lowest p-4">
              <img
                alt="Dashboard Deep Dive"
                className="rounded-xl w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV4-1yxjYpgJmkHXPrFYJuTokXl8_d_B0WPu34KB-zWbDeb2f8qgYAw84pOclKijB2EF4ZI-tsfYuSYBzcOmwDzHj9mO0sLeFYePZrVkJ-q0jW37aY7yADUwPR6DvawkfOhWrFKVQpx2rJglaikTwiznz4nCSCivIPS2UuSvlGcN5cF1kTnRHpbXIrz8b6bXATl8D2rj8C5HCFKzWOcoMyqWFM1FCvTMdyGddn9XosVaQN0e3o4tll0GWtrj--MIZ0wI_zNTyZnjSF"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase">
              Telemetry
            </span>
            <h3 className="text-4xl font-extrabold tracking-tight">
              Command Center Protocol
            </h3>
            <p className="text-on-surface-variant text-lg leading-relaxed opacity-80">
              Stop fragmented tracking. TrackMyCash aggregates your entire
              financial ecosystem into a single, high-fidelity command center
              designed for rapid decision-making.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 bg-surface-container/40 rounded-2xl border border-outline-variant/10">
                <RefreshCw className="text-primary  " />
                <span className="font-bold text-sm tracking-tight">
                  Instant Balance Synchronization
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface-container/40 rounded-2xl border border-outline-variant/10">
                <GlobeX className="text-primary  " />
                <span className="font-bold text-sm tracking-tight">
                  Global Currency Localization
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="px-8 max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-20">
          <div className="flex-1 relative">
            <div className="absolute -inset-10 bg-tertiary/5 blur-[100px] -z-10"></div>
            <div className="border-8 border-surface-container rounded-4xl bg-surface-container-lowest p-4">
              <img
                alt="Budgeting Deep Dive"
                className="rounded-xl w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIQeLOd8hYLEtg5Jmhb7DsacY-MHWX82RvXAGA7r3rhwmGElGPHWB1bzh8oqOsK3BKxu10T_RFg3OsMxnZhZhuIXcBWgxabz32nkOfDM01Zsk7jpw32YF5FxwcqzY_tfBBV1YJLM1dn81a12fbLAAXOhZ5qswr8tB7gKKXcFUdsCXCnR4KjP13gPo10KCAO5Be93EVkosVfzMF1O9TDzTuMAQs3tukpW6pXtjQvoqAep-U3pnTjjewwu6POqMb0fZof4Y1BlE0VLtl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <span className="text-tertiary font-bold tracking-[0.2em] text-[10px] uppercase">
              Intelligence
            </span>
            <h3 className="text-4xl font-extrabold tracking-tight">
              Predictive Resource Allocation
            </h3>
            <p className="text-on-surface-variant text-lg leading-relaxed opacity-80">
              Budgeting redefined. Our engine maps your expenditure velocity to
              forecast month-end balances, alerting you to overages before they
              materialize.
            </p>
            <div className="p-8 bg-surface-container/40 rounded-3xl border-l-4 border-tertiary border-y border-r relative overflow-hidden">
              <Quote className="absolute top-4 right-4 text-tertiary/20 text-6xl" />
              <p className="text-lg italic font-medium leading-relaxed opacity-90 relative z-10">
                "The predictive alerts felt like having a personal CFO. I saved
                ₹1.2 Lakhs by trimming automated drains I didn't even notice."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-32 px-8 max-w-7xl mx-auto relative"
      >
        <div className="text-center mb-24">
          <h2 className="text-4xl font-extrabold tracking-tight">
            The Onboarding Sequence
          </h2>
          <p className="mt-4 text-on-surface-variant opacity-60">
            Zero to high-fidelity in four technical steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-15 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-outline-variant/20 to-transparent -z-10"></div>
          {[
            {
              icon: <UserPlus className="text-3xl" />,
              title: "01. Initialization",
              desc: "Establish your secure profile with enterprise-grade encryption.",
            },
            {
              icon: <House className="text-3xl" />,
              title: "02. Node Connection",
              desc: "Securely bridge your financial institutions via read-only APIs.",
            },
            {
              icon: <CableCar className="text-3xl" />,
              title: "03. Neural Sync",
              desc: "Automated ledger population with AI-driven categorization.",
            },
            {
              icon: <Rocket className="text-3xl" />,
              title: "04. Deep Insight",
              desc: "Unlock full-spectrum visibility and predictive growth tools.",
            },
          ].map((step, idx) => (
            <div key={idx} className="text-center space-y-6 group">
              <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mx-auto text-xl font-bold text-primary border border-outline-variant/20 shadow-xl group-hover:border-primary/50 transition-all duration-300">
                {step.icon}
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg">{step.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed opacity-70">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Priya Sharma",
              role: "Creative Director",
              text: '"The interface design is surgical. Finally, a finance application that treats data with the respect it deserves. It’s a joy to use."',
            },
            {
              name: "Rahul Mehta",
              role: "Fintech Analyst",
              text: '"As an analyst, I demand precision. This tool provides the depth of a terminal with the intuition of a flagship mobile OS."',
              featured: true,
            },
            {
              name: "Ananya Patel",
              role: "Software Engineer",
              text: '"It turned our chaotic family finances into a structured discipline. Worth every rupee for the peace of mind alone."',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className={cn(
                "p-10 rounded-4xl border border-outline-variant/10 flex flex-col justify-between",
                t.featured
                  ? "bg-surface-container-high border-primary/20 shadow-2xl shadow-primary/5 transform md:-translate-y-4"
                  : "bg-surface-container/40",
              )}
            >
              <div>
                <div className="flex gap-1 text-tertiary mb-8">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="text-sm fill-current" />
                  ))}
                </div>
                <p className="text-on-background mb-10 leading-relaxed font-medium opacity-90">
                  {t.text}
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-outline-variant/10 pt-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant/20"></div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight mb-8">
            Tiered Subscriptions
          </h2>
          <div className="inline-flex items-center gap-4 bg-surface-container p-1 rounded-full border border-outline-variant/10">
            <button className="px-6 py-2 rounded-full bg-surface-bright text-on-surface text-sm font-bold">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface text-sm font-bold">
              Yearly (-20%)
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {[
            {
              title: "Essential",
              desc: "Fundamental tracking.",
              price: "0",
              features: ["3 Account Connections", "Manual Data Entry"],
              missing: ["Predictive Insights"],
            },
            {
              title: "High-Fidelity",
              desc: "Full autonomous engine.",
              price: "499",
              features: [
                "Unlimited Account Nodes",
                "Autonomous Bank Sync",
                "Predictive Forecasting",
                "24/7 Priority Support",
              ],
              featured: true,
            },
            {
              title: "Institutional",
              desc: "Enterprise scale tools.",
              price: "1,299",
              features: [
                "Multi-User Permissions",
                "Tax Compliance Exports",
                "Direct API Access",
              ],
            },
          ].map((plan, idx) => (
            <div
              key={idx}
              className={cn(
                "p-12 rounded-[2.5rem] border transition-colors",
                plan.featured
                  ? "bg-surface-container-high border-primary relative shadow-2xl shadow-primary/10 rounded-[3rem]"
                  : "bg-surface-container border-outline-variant/10 hover:border-outline",
              )}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary-container text-[9px] font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-full">
                  Recommended
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
              <p className="text-on-surface-variant text-sm mb-6 font-medium">
                {plan.desc}
              </p>
              <p className="text-4xl font-extrabold mb-8 tracking-tighter">
                ₹{plan.price}{" "}
                <span className="text-sm font-normal text-on-surface-variant">
                  /mo
                </span>
              </p>
              <ul className="space-y-4 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm font-bold">
                    <Check
                      name="check_circle"
                      className="text-primary text-lg"
                    />{" "}
                    {f}
                  </li>
                ))}
                {plan.missing?.map((m) => (
                  <li
                    key={m}
                    className="flex gap-3 text-sm font-medium text-on-surface-variant/40"
                  >
                    <X name="cancel" className="text-lg" /> {m}
                  </li>
                ))}
              </ul>
              <button
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-sm transition-all",
                  plan.featured
                    ? "cta-gradient text-on-primary-container font-black shadow-lg shadow-primary/25 active:scale-[0.98]"
                    : "bg-surface-container-highest hover:bg-surface-bright border border-outline-variant/10",
                )}
              >
                {plan.featured ? "Initialize Pro" : "Begin Free Trial"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-8 max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight">
          Technical Support
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "Security Protocols & Encryption",
              a: "We employ bank-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Your credentials are never stored on our servers; we use tokenized OAuth sessions for read-only access.",
            },
            {
              q: "Institutional Compatibility",
              a: "TrackMyCash is compatible with 15,000+ global financial nodes, including all major tier-1 and tier-2 banks in India (HDFC, ICICI, SBI, Axis, etc.).",
            },
            {
              q: "Data Portability",
              a: "You maintain absolute sovereignty over your data. All transactions and reports can be exported in standardized CSV, JSON, or high-fidelity PDF formats instantly.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="group bg-surface-container/40 rounded-2xl border border-outline-variant/10 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 cursor-pointer font-bold text-sm tracking-tight hover:bg-surface-container/60 transition-colors"
              >
                {faq.q}
                <ChevronDown
                  name="expand_more"
                  className={cn(
                    "transition-transform text-primary",
                    activeFaq === idx && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-on-surface-variant text-xs leading-relaxed opacity-70">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-8 max-w-7xl mx-auto mb-32">
        <div className="cta-gradient p-12 md:p-24 rounded-[4rem] text-center text-on-primary-container relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-125 h-125bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">
              Establish your digital <br /> financial legacy.
            </h2>
            <p className="text-lg opacity-80 max-w-xl mx-auto mb-12 font-medium">
              Join 12,000+ high-fidelity curators managing their wealth with
              institutional precision.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="bg-white text-primary-container px-12 py-5 rounded-2xl font-black text-xl hover:bg-on-background active:scale-95 transition-all shadow-xl">
                Deploy My Ledger
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full pt-20 pb-12 border-t border-outline-variant/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold text-on-background mb-6 flex items-center gap-2">
              <HatGlasses name="account_balance" className="text-primary" />
              TrackMyCash
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed font-medium opacity-60">
              The digital ledger of high-fidelity financial management for the
              modern era.
            </p>
          </div>
          {[
            {
              title: "Protocol",
              links: [
                "System Features",
                "Institutional Pricing",
                "Mobile Nodes",
                "Security Core",
              ],
            },
            {
              title: "Organization",
              links: ["About the Lab", "Research Blog", "Open Roles"],
            },
            {
              title: "Governance",
              links: ["Privacy Directive", "Terms of Use", "Audit Security"],
            },
          ].map((col, idx) => (
            <div key={idx}>
              <p className="font-bold text-on-surface mb-8 text-sm uppercase tracking-widest">
                {col.title}
              </p>
              <ul className="space-y-4 text-sm font-medium text-on-surface-variant opacity-60">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="px-8 max-w-7xl mx-auto pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">
            © 2024 TrackMyCash. High Fidelity Financial Systems.
          </p>
          <div className="flex gap-6 opacity-40">
            <Share2
              name="share"
              className="text-xl hover:text-primary cursor-pointer transition-colors"
            />
            <Podcast
              name="podcasts"
              className="text-xl hover:text-primary cursor-pointer transition-colors"
            />
            <SquareTerminal
              name="terminal"
              className="text-xl hover:text-primary cursor-pointer transition-colors"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
