"use client";

import { useState } from "react";
import {
  Plus,
  AlertTriangle,
  Pencil,
  Trash2,
  Plane,
  Cpu,
  Megaphone,
  Wrench,
  TrendingUp,
  Sparkles,
  X,
  ChevronDown,
  Clock,
  Monitor,
  BrainCircuit,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/helper";
import BudgetCard from "./components/BudgetCard";
import InsightCard from "./components/InsightCard";
import BudgetModal from "./components/BudgetModal";

interface Budget {
  id: string;
  title: string;
  subtitle: string;
  spent: number;
  total: number;
  icon: any;
  color: string;
  critical?: boolean;
}

const INITIAL_BUDGETS: Budget[] = [
  {
    id: "1",
    title: "Infrastructure",
    subtitle: "Cloud services & Hosting",
    spent: 940,
    total: 1500,
    icon: Cpu,
    color: "text-primary",
  },
  {
    id: "2",
    title: "Marketing",
    subtitle: "Paid Ads & Social Media",
    spent: 1460,
    total: 2200,
    icon: Megaphone,
    color: "text-primary",
  },
  {
    id: "3",
    title: "Operations",
    subtitle: "Office supplies & Rent",
    spent: 1240,
    total: 1800,
    icon: Wrench,
    color: "text-primary",
  },
  {
    id: "4",
    title: "Travel",
    subtitle: "Flights & Accommodations",
    spent: 720,
    total: 900,
    icon: Plane,
    color: "text-tertiary",
    critical: true,
  },
];

const Budget = () => {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAllocation = budgets.reduce((acc, b) => acc + b.total, 0);

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Main Content */}
      <main className=" max-w-7xl w-full mx-auto flex-1 flex flex-col min-h-screen">
        {/* Content Area */}
        <div className="w-full mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div>
              <span className="text-primary text-xs uppercase font-bold tracking-widest">
                Financial Planning
              </span>
              <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mt-1">
                Budget Overview
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-linear-to-br cursor-pointer from-primary-container to-primary text-on-primary-fixed px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary-container/20"
            >
              <Plus size={20} />
              <span>Create Budget</span>
            </button>
          </div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-tertiary-container/10 border-l-4 border-tertiary p-5 rounded-xl flex items-center gap-4"
          >
            <AlertTriangle className="text-tertiary" size={28} />
            <p className="text-on-surface font-medium">
              Warning: Travel budget has reached 80% of its limit.
            </p>
          </motion.div>

          {/* Budget List */}
          <div className="grid grid-cols-1 gap-6">
            {budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div>

          {/* Analysis Section */}
          <div className="mt-12 grid grid-cols-12 gap-8">
            {/* Total Allocation */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
              <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-4">
                Total Allocation
              </span>
              <div className="space-y-2">
                <span className="text-5xl font-extrabold text-on-surface">
                  ${totalAllocation.toLocaleString()}
                </span>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Across all active budget categories for the current fiscal
                  period.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/20">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface-variant">
                    Budget Efficiency
                  </span>
                  <span className="text-on-surface font-bold">92%</span>
                </div>
                <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row gap-6">
              <InsightCard
                icon={TrendingUp}
                title="Smart Forecasting"
                description="Based on current trends, Infrastructure will exceed limit by the 24th."
                bgIcon={Monitor}
              />
              <InsightCard
                icon={Sparkles}
                title="Auto-Optimization"
                description="Suggested: Move $200 from Marketing to Travel to avoid overages."
                bgIcon={BrainCircuit}
                iconColor="text-tertiary"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <BudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Budget;
