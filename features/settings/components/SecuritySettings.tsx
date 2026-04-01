import React from "react";
import { ShieldCheck, Laptop, Smartphone, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const SecuritySettings: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Password Management Card */}
      <div className="bg-surface-container rounded-xl p-8 shadow-sm">
        <div className="max-w-2xl">
          <h3 className="text-xl font-semibold mb-2">Password Management</h3>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            Update your password regularly to ensure your financial data remains
            protected. Use at least 12 characters with a mix of letters,
            numbers, and symbols.
          </p>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                Current Password
              </label>
              <input
                className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                placeholder="••••••••••••"
                type="password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                  New Password
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                  placeholder="••••••••••••"
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                  Confirm New Password
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                  placeholder="••••••••••••"
                  type="password"
                />
              </div>
            </div>
            <div className="pt-4">
              <button className="primary-gradient cursor-pointer px-8 py-3 rounded-md font-semibold text-on-primary shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-surface-container rounded-xl p-8 border border-outline-variant/10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-tertiary/10 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-tertiary" />
              </div>
              <h3 className="text-xl font-semibold">
                Two-factor authentication
              </h3>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Add an extra layer of security to your account. In addition to
              your password, you'll need to enter a code from an authenticator
              app on your smartphone to log in.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border border-outline-variant/20">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
              Currently Disabled
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer group">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-1 after:bg-on-surface-variant after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container peer-checked:after:bg-on-primary-container"></div>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Laptop className="w-30 h-30" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-6">
          Recent Sessions
        </h3>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container/50 hover:bg-surface-container transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-bright rounded-lg">
                <Laptop className="w-5 h-5 text-on-surface" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  MacBook Pro 16" • San Francisco, US
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  Chrome Browser • Active now
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
              This Device
            </span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container/50 hover:bg-surface-container transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-surface-bright rounded-lg">
                <Smartphone className="w-5 h-5 text-on-surface" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  iPhone 15 Pro • San Francisco, US
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  Mobile App • 2 hours ago
                </p>
              </div>
            </div>
            <button className="text-[10px] cursor-pointer font-bold text-error hover:underline uppercase tracking-widest">
              Revoke
            </button>
          </div>
        </div>
        <button className="mt-8 text-xs cursor-pointer font-semibold text-primary flex items-center gap-2 hover:gap-3 transition-all">
          Log out of all other sessions
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default SecuritySettings;    
