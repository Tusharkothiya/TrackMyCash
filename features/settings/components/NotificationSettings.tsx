import React from "react";
import { Mail, BarChart3, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const ToggleRow: React.FC<{
  label: string;
  description: string;
  defaultChecked?: boolean;
}> = ({ label, description, defaultChecked = false }) => {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-2">
      <div className="max-w-md">
        <label className="text-sm font-semibold text-on-surface block">
          {label}
        </label>
        <p className="text-xs text-on-surface-variant mt-1">{description}</p>
      </div>
      <div
        onClick={() => setChecked(!checked)}
        className="relative inline-flex items-center cursor-pointer group"
      >
        <div
          className={`w-11 h-6 rounded-full transition-all ${checked ? "bg-primary-container" : "bg-surface-container-highest"}`}
        >
          <div
            className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-all shadow-sm ${checked ? "translate-x-5" : "translate-x-0"}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Communication Preferences */}
      <section className="bg-surface-container rounded-xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              Communication Preferences
            </h3>
            <p className="text-xs text-on-surface-variant">
              Control how and when we reach out to you.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <ToggleRow
            label="Email alerts"
            description="Receive critical account security and system maintenance updates via email."
            defaultChecked
          />
          <ToggleRow
            label="Budget warning alerts"
            description="Get notified when you reach 80% and 100% of your set monthly budgets."
            defaultChecked
          />
          <ToggleRow
            label="New transaction added"
            description="Real-time push notifications for every transaction recorded on your accounts."
          />
        </div>
      </section>

      {/* Data Summaries */}
      <section className="bg-surface-container rounded-xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-tertiary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              Data Summaries
            </h3>
            <p className="text-xs text-on-surface-variant">
              Manage your recurring financial digests.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <ToggleRow
            label="Weekly summary email"
            description="A comprehensive digest of your spending habits delivered every Monday morning."
            defaultChecked
          />
          <ToggleRow
            label="Monthly report ready"
            description="In-depth PDF analysis of your monthly net worth, cash flow, and tax-deductible items."
            defaultChecked
          />
        </div>
      </section>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button className="px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-bright transition-all">
          Discard Changes
        </button>
        <button className="px-8 py-2.5 rounded-lg text-sm font-bold text-white primary-gradient shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          Save Preferences
        </button>
      </div>

      {/* Pro Insight Floating Card */}
      <div className="fixed bottom-12 right-12 w-64 p-6 glass-panel rounded-2xl border border-white/5 shadow-2xl hidden lg:block">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
            Pro Insight
          </span>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <p className="text-sm font-medium text-on-surface leading-relaxed">
          Users with{" "}
          <span className="text-primary font-bold">Weekly Summaries</span>{" "}
          enabled are 34% more likely to reach their savings goals.
        </p>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
