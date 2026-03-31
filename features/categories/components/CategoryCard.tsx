import React from "react";
import {
  Server,
  Megaphone,
  Briefcase,
  Plane,
  Banknote,
  Lightbulb,
  MoreHorizontal,
  Edit2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils/helper";

export type CategoryIcon =
  | "layout-grid"
  | "receipt"
  | "wallet"
  | "bar-chart"
  | "settings"
  | "log-out"
  | "search"
  | "bell"
  | "plus-circle"
  | "edit"
  | "trash-2"
  | "sparkles"
  | "server"
  | "megaphone"
  | "briefcase"
  | "plane"
  | "banknote"
  | "lightbulb"
  | "more-horizontal"
  | "shopping-cart"
  | "home"
  | "activity"
  | "graduation-cap"
  | "clapperboard"
  | "piggy-bank"
  | "theater"
  | "paw-print"
  | "layers";

export interface Category {
  id: string;
  name: string;
  icon: CategoryIcon;
  color: string;
  transactionCount: number;
  amount: number;
  type: "expense" | "income";
  overline?: string;
}

const IconMap: Record<CategoryIcon | string, any> = {
  server: Server,
  megaphone: Megaphone,
  briefcase: Briefcase,
  plane: Plane,
  banknote: Banknote,
  lightbulb: Lightbulb,
  "more-horizontal": MoreHorizontal,
};

interface CategoryCardProps {
  category: Category;
  onDelete?: (id: string) => void;
}

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
  const Icon = IconMap[category.icon] || MoreHorizontal;

  return (
    <div className="bg-surface-container rounded-2xl p-6 transition-all hover:bg-surface-container-high group border border-transparent hover:border-outline-variant/10 shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
          }}
        >
          <Icon size={24} />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-bright">
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete?.(category.id)}
            className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-surface-bright"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-on-surface mb-1">
          {category.name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: category.color }}
          ></span>
          <span className="text-xs text-on-surface-variant font-medium">
            {category.transactionCount}{" "}
            {category.type === "income" ? "sources" : "transactions"} this month
          </span>
        </div>

        <div className="mt-6 pt-6 border-t border-outline-variant/5">
          <p className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
            Total {category.type === "income" ? "Earned" : "Spent"}
          </p>
          <p
            className={cn(
              "text-2xl font-black",
              category.type === "income"
                ? "text-emerald-400"
                : "text-on-surface",
            )}
          >
            {category.type === "income" ? "+" : ""}$
            {category.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
