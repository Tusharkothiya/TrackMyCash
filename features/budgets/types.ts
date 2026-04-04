import type { CategoryIcon } from "@/features/categories/types";

export type BudgetFrequency = "Monthly" | "Quarterly" | "Yearly";
export type Currency = "USD" | "INR" | "EUR" | "GBP";

export interface BudgetCategory {
  _id: string;
  name: string;
  icon: CategoryIcon;
  color: string;
  type: "expense" | "income";
}

export interface Budget {
  _id: string;
  userId?: string;
  categoryId: string | BudgetCategory;
  budgetLimit: number;
  spentAmount?: number;
  frequency: BudgetFrequency;
  activationDate: string;
  currency: Currency;
  createdAt?: string;
  updatedAt?: string;
}

export type BudgetPayload = {
  categoryId: string;
  budgetLimit: number;
  frequency: BudgetFrequency;
  activationDate: string;
  currency: Currency;
};
