import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Coins,
  Clock3,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { Category } from "@/features/categories/types";
import { cn } from "@/lib/utils/helper";

import { validateBudgetPayload } from "../schemas/budget.schema";
import type { Budget, BudgetFrequency, BudgetPayload, Currency } from "../types";

const FREQUENCIES: BudgetFrequency[] = ["Monthly", "Quarterly", "Yearly"];
const CURRENCIES: Currency[] = ["USD", "INR", "EUR", "GBP"];

function resolveCategoryId(value: Budget["categoryId"] | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
}

function toDateInputValue(value?: string) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsedDate.toISOString().slice(0, 10);
}

interface BudgetModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  isSubmitting?: boolean;
  apiMessage?: string | null;
  categories: Category[];
  initialValues?: Budget;
  onClose: () => void;
  onSubmit: (budget: BudgetPayload) => void | Promise<void>;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  mode,
  isSubmitting,
  apiMessage,
  categories,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [categoryId, setCategoryId] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [frequency, setFrequency] = useState<BudgetFrequency>("Monthly");
  const [activationDate, setActivationDate] = useState(toDateInputValue());
  const [currency, setCurrency] = useState<Currency>("USD");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialValues) {
      setCategoryId(resolveCategoryId(initialValues.categoryId));
      setBudgetLimit(String(initialValues.budgetLimit ?? ""));
      setFrequency(initialValues.frequency ?? "Monthly");
      setActivationDate(toDateInputValue(initialValues.activationDate));
      setCurrency(initialValues.currency ?? "USD");
      return;
    }

    setCategoryId(categories[0]?._id || "");
    setBudgetLimit("");
    setFrequency("Monthly");
    setActivationDate(toDateInputValue());
    setCurrency("USD");
  }, [categories, initialValues, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setValidationMessage(null);
    }
  }, [isOpen]);

  const messageToShow = useMemo(
    () => validationMessage || apiMessage || null,
    [validationMessage, apiMessage],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: BudgetPayload = {
      categoryId,
      budgetLimit: Number(budgetLimit),
      frequency,
      activationDate,
      currency,
    };

    const errorMessage = validateBudgetPayload(payload);
    if (errorMessage) {
      setValidationMessage(errorMessage);
      return;
    }

    setValidationMessage(null);
    await onSubmit(payload);
  };

  const hasCategories = categories.length > 0;

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-outline-variant/10 bg-surface-container-high shadow-2xl"
          >
            <div className="border-b border-outline-variant/10 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-5 pt-6 sm:pt-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    Budget Planning
                  </p>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-on-surface">
                    {mode === "edit" ? "Edit Budget" : "Create Budget"}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-on-surface-variant">
                    Set a spending rule for a category, choose how often it resets,
                    and keep the allocation tied to the right currency.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-bright hover:text-on-surface shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 px-4 sm:px-6 lg:px-8 py-6">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    disabled={!hasCategories}
                    className={cn(
                      "w-full appearance-none rounded-2xl border-none bg-surface-container-highest px-4 py-3 sm:py-4 pr-11 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/50",
                      !hasCategories && "cursor-not-allowed opacity-70",
                    )}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name} ({category.type})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                </div>
                {!hasCategories ? (
                  <p className="ml-1 text-xs text-amber-400">
                    Create a category first before adding a budget.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Budget Limit
                  </label>
                  <div className="relative">
                    <Coins
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={budgetLimit}
                      onChange={(event) => setBudgetLimit(event.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-2xl border-none bg-surface-container-highest py-3 sm:py-4 pl-11 pr-4 text-lg font-semibold text-on-surface outline-none transition-all placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value as Currency)}
                      className="w-full appearance-none rounded-2xl border-none bg-surface-container-highest px-4 py-3 sm:py-4 pr-11 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/50"
                    >
                      {CURRENCIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Frequency
                  </label>
                  <div className="relative">
                    <Clock3
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    />
                    <select
                      value={frequency}
                      onChange={(event) => setFrequency(event.target.value as BudgetFrequency)}
                      className="w-full appearance-none rounded-2xl border-none bg-surface-container-highest px-4 py-3 sm:py-4 pl-11 pr-11 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/50"
                    >
                      {FREQUENCIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Activation Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    />
                    <input
                      type="date"
                      value={activationDate}
                      onChange={(event) => setActivationDate(event.target.value)}
                      className="w-full rounded-2xl border-none bg-surface-container-highest py-3 sm:py-4 pl-11 pr-4 text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary-container/10 p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 text-primary shrink-0" size={18} />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-on-surface">Budget rules stay simple</p>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      The server validates the category, duplicate frequency, amount,
                      and activation date before the record is saved.
                    </p>
                  </div>
                </div>
              </div>

              {messageToShow ? (
                <p className="rounded-2xl bg-error/10 px-4 py-3 text-sm font-medium text-error">
                  {messageToShow}
                </p>
              ) : null}

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={Boolean(isSubmitting)}
                  className="cursor-pointer rounded-2xl bg-surface-container-high px-5 py-3 sm:py-3.5 text-sm font-bold text-on-surface-variant transition-all hover:bg-surface-bright disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Boolean(isSubmitting) || !hasCategories}
                  className="cursor-pointer rounded-2xl bg-linear-to-br from-primary-container to-primary px-5 py-3 sm:py-3.5 text-sm font-bold text-on-primary-fixed shadow-lg shadow-primary-container/20 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting
                    ? mode === "edit"
                      ? "Updating..."
                      : "Creating..."
                    : mode === "edit"
                      ? "Update Budget"
                      : "Create Budget"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default BudgetModal;