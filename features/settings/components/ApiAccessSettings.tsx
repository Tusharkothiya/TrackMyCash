import React from "react";
import { Code2, Copy, Key, Plus, Trash2, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const ApiAccessSettings: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* API Overview */}
      <section className="bg-surface-container rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">API Access</h3>
            <p className="text-xs text-on-surface-variant">
              Manage your API keys and webhook configurations.
            </p>
          </div>
        </div>
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
            Use our robust API to integrate TrackMyCash with your own tools and
            workflows. Check our{" "}
            <span className="text-primary font-semibold cursor-pointer hover:underline">
              API Documentation
            </span>{" "}
            for detailed guides.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-surface-container-highest rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Monthly Requests
              </p>
              <p className="text-2xl font-black text-on-surface">
                12,402{" "}
                <span className="text-xs font-normal text-on-surface-variant">
                  / 50k
                </span>
              </p>
            </div>
            <div className="p-4 bg-surface-container-highest rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Active Keys
              </p>
              <p className="text-2xl font-black text-on-surface">2</p>
            </div>
            <div className="p-4 bg-surface-container-highest rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                Success Rate
              </p>
              <p className="text-2xl font-black text-primary">99.9%</p>
            </div>
          </div>
        </div>
      </section>

      {/* API Keys Management */}
      <section className="bg-surface-container rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-lg font-bold text-on-surface">API Keys</h4>
          <button className="px-4 py-2 cursor-pointer rounded-xl primary-gradient text-on-primary text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create New Key
          </button>
        </div>
        <div className="space-y-4">
          {[
            {
              name: "Production Dashboard",
              key: "tmc_live_••••••••••••42a1",
              status: "Active",
              lastUsed: "2 mins ago",
            },
            {
              name: "Staging Environment",
              key: "tmc_test_••••••••••••9b32",
              status: "Active",
              lastUsed: "1 day ago",
            },
          ].map((apiKey, i) => (
            <div
              key={i}
              className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <Key className="w-5 h-5 text-on-surface-variant" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {apiKey.name}
                  </p>
                  <p className="text-xs font-mono text-on-surface-variant">
                    {apiKey.key}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold text-primary uppercase">
                    {apiKey.status}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    Last used {apiKey.lastUsed}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 cursor-pointer hover:bg-surface-container-highest rounded-lg transition-colors"
                    title="Copy Key"
                  >
                    <Copy className="w-4 h-4 text-on-surface-variant" />
                  </button>
                  <button
                    className="p-2 cursor-pointer hover:bg-error/10 rounded-lg transition-colors group"
                    title="Delete Key"
                  >
                    <Trash2 className="w-4 h-4 text-on-surface-variant group-hover:text-error" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Webhooks Section */}
      <section className="bg-surface-container rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-lg font-bold text-on-surface">Webhooks</h4>
          <button className="text-xs font-bold text-primary hover:underline underline-offset-4 uppercase tracking-wider cursor-pointer">
            Configure
          </button>
        </div>
        <div className="p-8 border-2 border-dashed border-outline-variant/20 rounded-2xl text-center">
          <div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-6 h-6 text-on-surface-variant" />
          </div>
          <p className="text-sm font-semibold text-on-surface mb-1">
            No webhooks configured
          </p>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
            Receive real-time notifications for account events directly to your
            server.
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default ApiAccessSettings;
