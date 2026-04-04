"use client"
import {
  Activity,
  Banknote,
  Briefcase,
  Edit2,
  GraduationCap,
  Home,
  Landmark,
  LayoutGrid,
  Lightbulb,
  Megaphone,
  MoreHorizontal,
  PawPrint,
  PiggyBank,
  Plane,
  ReceiptText,
  ShoppingCart,
  Theater,
  Trash2,
  Wallet,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils/helper";

import type { Budget, BudgetCategory } from "../types";

const ICON_MAP: Record<string, any> = {
  "shopping-cart": ShoppingCart,
  home: Home,
  plane: Plane,
  activity: Activity,
  "graduation-cap": GraduationCap,
  banknote: Banknote,
  clapperboard: Theater,
  "piggy-bank": PiggyBank,
  theater: Theater,
  "paw-print": PawPrint,
  "more-horizontal": MoreHorizontal,
  "layout-grid": LayoutGrid,
  receipt: ReceiptText,
  wallet: Wallet,
  "bar-chart": Lightbulb,
  settings: Wrench,
  "log-out": MoreHorizontal,
  search: MoreHorizontal,
  bell: MoreHorizontal,
  "plus-circle": LayoutGrid,
  edit: Edit2,
  "trash-2": Trash2,
  sparkles: Lightbulb,
  server: Landmark,
  megaphone: Megaphone,
  briefcase: Briefcase,
  lightbulb: Lightbulb,
};

function resolveCategory(budget: Budget): BudgetCategory {
  if (typeof budget.categoryId !== "string") {
    return budget.categoryId;
  }

  return {
    _id: budget.categoryId,
    name: "Unassigned category",
    icon: "more-horizontal",
    color: "#64748b",
    type: "expense",
  };
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

interface BudgetCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const category = resolveCategory(budget);
  const CategoryIcon = ICON_MAP[category.icon] || MoreHorizontal;
  const spentAmount = Math.max(0, budget.spentAmount || 0);
  const totalAmount = Math.max(0, budget.budgetLimit || 0);
  const percentage = totalAmount > 0 ? Math.min(100, Math.round((spentAmount / totalAmount) * 100)) : 0;
  const isCritical = percentage >= 80;

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={cn(
        "group flex items-center gap-8 rounded-xl border-l-4 border-transparent bg-surface-container p-6 transition-all hover:bg-surface-container-high",
        isCritical && "border-tertiary",
      )}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-highest"
        style={{ color: category.color }}
      >
        <CategoryIcon size={30} />
      </div>

      <div className="flex-1">
        <div className="mb-4 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-on-surface">{category.name}</h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-primary">
                {budget.frequency}
              </span>
              {isCritical && (
                <span className="rounded-full bg-tertiary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-tertiary">
                  Critical
                </span>
              )}
            </div>
            <p className="text-sm text-on-surface-variant">
              {category.type} budget in {budget.currency}
            </p>
          </div>
          <div className="text-right">
            <span className={cn("text-2xl font-bold", isCritical ? "text-tertiary" : "text-on-surface")}>
              {formatMoney(spentAmount, budget.currency)}
            </span>
            <span className="font-medium text-on-surface-variant">
              {" "}/ {formatMoney(totalAmount, budget.currency)}
            </span>
          </div>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-lowest">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full", isCritical ? "bg-tertiary" : "bg-primary")}
          />
        </div>
      </div>

      <div className="w-24 flex flex-col items-center gap-1">
        <span className={cn("text-xl font-black", isCritical ? "text-tertiary" : "text-primary")}>
          {percentage}%
        </span>
        <span className="text-[10px] font-bold uppercase text-on-surface-variant">Used</span>
      </div>

      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit?.(budget)}
          className="cursor-pointer rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-bright"
        >
          <Edit2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(budget._id)}
          className="cursor-pointer rounded-lg p-2 text-error transition-colors hover:bg-error/10"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default BudgetCard;