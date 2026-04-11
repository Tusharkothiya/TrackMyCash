import React from "react";
import { CreditCard, Download, ExternalLink, Plus } from "lucide-react";
import { motion } from "motion/react";

const BillingSettings: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Plan Overview */}
      <section className="bg-surface-container rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                Current Plan
              </span>
            </div>
            <h3 className="text-3xl font-black text-on-surface mb-2">
              Pro Finance Plan
            </h3>
            <p className="text-on-surface-variant max-w-md">
              You are currently on the Pro plan. Your next billing date is{" "}
              <span className="text-on-surface font-semibold">
                May 12, 2026
              </span>
              .
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button className="px-8 py-3 cursor-pointer rounded-xl primary-gradient text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Upgrade Plan
            </button>
            <button className="px-8 py-3 cursor-pointer rounded-xl bg-surface-container-high text-on-surface font-bold hover:bg-surface-bright transition-all">
              Cancel Subscription
            </button>
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <section className="bg-surface-container rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-lg font-bold text-on-surface">Payment Method</h4>
          <button className="text-xs font-bold cursor-pointer text-primary hover:underline underline-offset-4 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-surface-container-highest rounded flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-on-surface-variant" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">
                Visa ending in 4242
              </p>
              <p className="text-xs text-on-surface-variant">Expires 12/2028</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
              Default
            </span>
            <button className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-wider">
              Edit
            </button>
          </div>
        </div>
      </section>

      {/* Billing History */}
      <section className="bg-surface-container rounded-2xl p-8">
        <h4 className="text-lg font-bold text-on-surface mb-8">
          Billing History
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Invoice
                </th>
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Date
                </th>
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Amount
                </th>
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Status
                </th>
                <th className="pb-4 text-right text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {[
                {
                  id: "INV-2026-001",
                  date: "Apr 12, 2026",
                  amount: "₹29.00",
                  status: "Paid",
                },
                {
                  id: "INV-2026-002",
                  date: "Mar 12, 2026",
                  amount: "₹29.00",
                  status: "Paid",
                },
                {
                  id: "INV-2026-003",
                  date: "Feb 12, 2026",
                  amount: "₹29.00",
                  status: "Paid",
                },
              ].map((invoice) => (
                <tr
                  key={invoice.id}
                  className="group hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="py-4 text-sm font-medium text-on-surface">
                    {invoice.id}
                  </td>
                  <td className="py-4 text-sm text-on-surface-variant">
                    {invoice.date}
                  </td>
                  <td className="py-4 text-sm font-mono text-on-surface">
                    {invoice.amount}
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors cursor-pointer">
                      <Download className="w-4 h-4 text-on-surface-variant" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-8 text-xs font-semibold text-primary flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
          View all invoices
          <ExternalLink className="w-4 h-4" />
        </button>
      </section>
    </motion.div>
  );
};

export default BillingSettings;
