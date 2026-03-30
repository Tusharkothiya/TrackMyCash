"use client"

import { cn } from "@/lib/utils/helper";
import { Cpu, Megaphone, Pencil, Plane, Trash2, Wrench } from "lucide-react";
import { motion } from "motion/react";

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



const BudgetCard = ({ budget }: { budget: Budget; key?: string }) => {
    const percentage = Math.round((budget.spent / budget.total) * 100);


  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={cn(
        "bg-surface-container hover:bg-surface-container-high transition-all p-6 rounded-xl flex items-center gap-8 group border-l-4 border-transparent",
        budget.critical && "border-tertiary",
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center",
          budget.color,
        )}
      >
        <budget.icon size={32} />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-on-surface">
                {budget.title}
              </h3>
              {budget.critical && (
                <span className="bg-tertiary/20 text-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Critical
                </span>
              )}
            </div>
            <p className="text-sm text-on-surface-variant">{budget.subtitle}</p>
          </div>
          <div className="text-right">
            <span
              className={cn(
                "text-2xl font-bold",
                budget.critical ? "text-tertiary" : "text-on-surface",
              )}
            >
              ${budget.spent.toLocaleString()}
            </span>
            <span className="text-on-surface-variant font-medium">
              {" "}
              / ${budget.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="h-2.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              budget.critical ? "bg-tertiary" : "bg-primary",
            )}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 w-24">
        <span
          className={cn(
            "font-black text-xl",
            budget.critical ? "text-tertiary" : "text-primary",
          )}
        >
          {percentage}%
        </span>
        <span className="text-[10px] uppercase font-bold text-on-surface-variant">
          Used
        </span>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-surface-bright rounded-lg text-on-surface-variant transition-colors cursor-pointer">
          <Pencil size={18} />
        </button>
        <button className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors cursor-pointer">
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  )
}

export default BudgetCard