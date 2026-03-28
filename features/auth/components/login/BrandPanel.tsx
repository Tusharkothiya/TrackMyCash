import React from "react";
import { motion } from "motion/react";

const WalletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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

const InsightsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const SecurityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const AutoAwesomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-start gap-4 group"
    >
      <div className="p-2 bg-surface-container rounded-lg group-hover:bg-surface-bright transition-colors text-primary">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-on-surface">{title}</p>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

const BrandPanel = () => {
  return (
    <section className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden bg-surface-container-lowest">
      {/* Decorative Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-24 -left-24 w-64 h-64 bg-primary-container rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-tertiary rounded-full blur-3xl"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 login-gradient rounded-lg flex items-center justify-center shadow-lg shadow-primary-container/20">
            <div className="text-on-primary-container">
              <WalletIcon />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tighter text-on-surface">
            TrackMyCash
          </span>
        </div>

        <div className="space-y-2 mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-primary">
            Intelligence & Control
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-on-surface">
            Take control of your finances
          </h1>
          <p className="text-on-surface-variant text-lg max-w-sm">
            Manage your wealth with the precision of a digital ledger and the
            soul of an atelier.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-8">
          <FeatureItem
            icon={<InsightsIcon />}
            title="Real-time Analytics"
            description="Track every penny with live transaction updates and beautiful trend visualizations."
          />
          <FeatureItem
            icon={<SecurityIcon />}
            title="Military-Grade Security"
            description="Your financial data is encrypted and protected with industry-leading standards."
          />
          <FeatureItem
            icon={<AutoAwesomeIcon />}
            title="Smart Categorization"
            description="AI-driven tagging helps you understand your spending habits automatically."
          />
        </div>
      </div>

      <div className="relative z-10 pt-12">
        <p className="text-xs text-on-surface-variant opacity-50">
          © 2024 TrackMyCash. All rights reserved. Secured by Obsidian Logic.
        </p>
      </div>
    </section>
  );
};

export default BrandPanel;
