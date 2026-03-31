import React from 'react';
import { Sparkles } from 'lucide-react';

export function InsightFooter() {
  return (
    <div className="mt-16 p-8 bg-surface-container-low rounded-3xl flex flex-col md:flex-row items-center gap-6 border border-outline-variant/5 shadow-inner">
      <div className="h-14 w-14 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/5">
        <Sparkles size={28} />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h4 className="text-on-surface font-bold text-lg mb-1">Smart Allocation Insight</h4>
        <p className="text-on-surface-variant text-sm max-w-2xl leading-relaxed">
          Based on your recent transactions, <span className="text-primary font-bold">Marketing</span> expenses have increased by 14% this month. Consider reviewing your ad spend to stay within the Q3 budget.
        </p>
      </div>
      <button className="px-6 py-3 bg-surface-container-high cursor-pointer text-on-surface rounded-xl text-sm font-bold hover:bg-surface-bright transition-all active:scale-95 shadow-sm">
        View Report
      </button>
    </div>
  );
}
