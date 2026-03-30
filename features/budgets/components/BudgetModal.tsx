import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, Clock, AlertTriangle } from "lucide-react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-modal w-full max-w-lg rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden bg-[#10141A] backdrop-blur-lg border border-outline-variant/20"
          >
            <div className="px-8 pt-8 pb-6 border-b border-outline-variant/10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase mb-1 block">
                    Configuration
                  </span>
                  <h2 className="text-2xl font-bold text-on-surface tracking-tight">
                    Create New Budget
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-bright rounded-lg transition-colors text-on-surface-variant cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="mt-2 text-on-surface-variant text-sm leading-relaxed">
                Set your spending limit and tracking frequency to maintain
                financial precision.
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant/80 tracking-wide uppercase">
                  Financial Category
                </label>
                <div className="relative">
                  <select className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 pl-4 pr-10 text-on-surface appearance-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer font-medium outline-none">
                    <option>Housing & Rent</option>
                    <option>Groceries</option>
                    <option>Entertainment</option>
                    <option>Transport</option>
                    <option>Healthcare</option>
                    <option>Personal Care</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                    size={20}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant/80 tracking-wide uppercase">
                  Budget Limit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">
                    $
                  </span>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 pl-9 pr-4 text-on-surface placeholder-on-surface-variant/30 focus:ring-1 focus:ring-primary/50 transition-all font-semibold text-lg outline-none"
                    placeholder="0.00"
                    type="number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant/80 tracking-wide uppercase">
                    Frequency Period
                  </label>
                  <div className="relative">
                    <select className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 pl-4 pr-10 text-on-surface appearance-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer font-medium outline-none">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Yearly</option>
                    </select>
                    <Clock
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                      size={20}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant/80 tracking-wide uppercase">
                    Activation Date
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 px-4 text-on-surface focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer font-medium outline-none scheme-dark]"
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary-container/10 flex gap-4 items-start">
                <AlertTriangle className="text-primary mt-0.5" size={20} />
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  This budget will automatically reset at the start of every
                  selected period. You can adjust these limits at any time
                  from your settings.
                </p>
              </div>
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-surface-container-high hover:bg-surface-bright text-on-surface py-3.5 rounded-xl font-bold transition-all text-sm tracking-wide cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="flex-2 bg-linear-to-br from-primary-container to-primary hover:opacity-90 text-on-primary-fixed py-3.5 rounded-xl font-bold transition-all text-sm tracking-wide shadow-lg shadow-primary-container/20 cursor-pointer"
              >
                Create Budget
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BudgetModal;