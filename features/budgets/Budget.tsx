"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Plus, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ConfirmActionModal } from "@/components/ui/ConfirmActionModal";
import { useCategories } from "@/hooks/useCategories";
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from "@/hooks/useBudgets";

import BudgetCard from "./components/BudgetCard";
import BudgetModal from "./components/BudgetModal";
import InsightCard from "./components/InsightCard";
import type { Budget, BudgetPayload } from "./types";

const BUDGET_SKELETON_COUNT = 3;

function BudgetCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container p-6">
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative flex items-center gap-8">
        <div className="h-14 w-14 rounded-full bg-surface-bright animate-pulse" />
        <div className="flex-1">
          <div className="flex-1 space-y-3">
            <div className="h-7 w-2/5 rounded-lg bg-surface-bright animate-pulse" />
            <div className="h-4 w-3/5 rounded-lg bg-surface-bright/80 animate-pulse" />
            <div className="h-2.5 w-full rounded-full bg-surface-bright/70 animate-pulse" />
          </div>
        </div>

        <div className="w-24 space-y-2 text-right">
          <div className="space-y-2 text-right">
            <div className="ml-auto h-3 w-24 rounded bg-surface-bright animate-pulse" />
            <div className="ml-auto h-9 w-36 rounded-lg bg-surface-bright animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

const Budget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null);
  const [modalApiMessage, setModalApiMessage] = useState<string | null>(null);
  const [deleteApiMessage, setDeleteApiMessage] = useState<string | null>(null);

  const budgetsQuery = useBudgets();
  const categoriesQuery = useCategories();
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();

  const budgets: Budget[] = useMemo(() => {
    if (!budgetsQuery.data?.success || !Array.isArray(budgetsQuery.data?.data)) {
      return [];
    }

    return budgetsQuery.data.data;
  }, [budgetsQuery.data]);

  const categories = useMemo(() => {
    if (!categoriesQuery.data?.success || !Array.isArray(categoriesQuery.data?.data)) {
      return [];
    }

    return categoriesQuery.data.data;
  }, [categoriesQuery.data]);

  const selectedBudget = useMemo(() => editingBudget, [editingBudget]);

  const deleteBudgetData = useMemo(
    () => budgets.find((budget) => budget._id === deleteBudgetId) || null,
    [budgets, deleteBudgetId],
  );

  const isSubmitting =
    createBudgetMutation.isPending || updateBudgetMutation.isPending;

  const totalAllocation = budgets.reduce(
    (accumulator, budget) => accumulator + budget.budgetLimit,
    0,
  );
  const totalSpent = budgets.reduce(
    (accumulator, budget) => accumulator + Math.max(0, budget.spentAmount || 0),
    0,
  );
  const overallUsage = totalAllocation > 0 ? Math.min(100, Math.round((totalSpent / totalAllocation) * 100)) : 0;

  const atRiskBudgets = budgets.filter((budget) => {
    const spent = Math.max(0, budget.spentAmount || 0);
    if (!budget.budgetLimit) return false;
    return (spent / budget.budgetLimit) * 100 >= 80;
  });

  const handleModalOpenForCreate = () => {
    setModalApiMessage(null);
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleModalOpenForEdit = (budget: Budget) => {
    setModalApiMessage(null);
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setModalApiMessage(null);
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleBudgetSave = async (payload: BudgetPayload) => {
    setModalApiMessage(null);

    if (editingBudget) {
      const result = await updateBudgetMutation.mutateAsync({
        budgetId: editingBudget._id,
        payload,
      });

      if (!result?.success) {
        setModalApiMessage(result?.message || "Unable to update budget.");
        return;
      }

      handleModalClose();
      return;
    }

    const result = await createBudgetMutation.mutateAsync(payload);
    if (!result?.success) {
      setModalApiMessage(result?.message || "Unable to create budget.");
      return;
    }

    handleModalClose();
  };

  const handleDeletePromptOpen = (id: string) => {
    setDeleteApiMessage(null);
    setDeleteBudgetId(id);
  };

  const handleDeletePromptClose = () => {
    if (deleteBudgetMutation.isPending) return;
    setDeleteApiMessage(null);
    setDeleteBudgetId(null);
  };

  const handleDeleteBudget = async () => {
    if (!deleteBudgetId) return;

    const result = await deleteBudgetMutation.mutateAsync(deleteBudgetId);
    if (!result?.success) {
      setDeleteApiMessage(result?.message || "Unable to delete budget.");
      return;
    }

    handleDeletePromptClose();
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <main className="max-w-7xl w-full mx-auto flex-1 flex flex-col min-h-screen">
        <div className="w-full mx-auto space-y-8">
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
              onClick={handleModalOpenForCreate}
              className="bg-linear-to-br cursor-pointer from-primary-container to-primary text-on-primary-fixed px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary-container/20"
            >
              <Plus size={20} />
              <span>Create Budget</span>
            </button>
          </div>

          {atRiskBudgets.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-tertiary-container/10 border-l-4 border-tertiary p-5 rounded-xl flex items-center gap-4"
            >
              <AlertTriangle className="text-tertiary" size={28} />
              <p className="text-on-surface font-medium">
                Warning: {atRiskBudgets.length} budget{atRiskBudgets.length > 1 ? "s are" : " is"} above 80% usage.
              </p>
            </motion.div>
          ) : null}

          <section className="space-y-6">
          {budgetsQuery.isLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: BUDGET_SKELETON_COUNT }).map((_, index) => (
                <BudgetCardSkeleton key={`budget-skeleton-${index}`} />
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {budgets.map((budget) => (
                  <motion.div
                    key={budget._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -2 }}
                  >
                    <BudgetCard
                      budget={budget}
                      onEdit={handleModalOpenForEdit}
                      onDelete={handleDeletePromptOpen}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {!budgetsQuery.isLoading && budgets.length === 0 ? (
                <div className="col-span-full bg-surface-container rounded-2xl p-10 text-center text-on-surface-variant font-medium">
                  No budgets found. Create one to get started.
                  <button
                    onClick={handleModalOpenForCreate}
                    className="mt-5 block mx-auto bg-linear-to-br cursor-pointer from-primary-container to-primary text-on-primary-fixed px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all"
                  >
                    Add Budget
                  </button>
                </div>
              ) : null}
            </>
          )}
          </section>

          {!budgetsQuery.isLoading && budgets.length > 0 ? (
            <div className="mt-12 grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
                <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-4">
                  Total Allocation
                </span>
                <div className="space-y-2">
                  <span className="text-5xl font-extrabold text-on-surface">
                    {totalAllocation.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Across all active budget categories for the current period.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-outline-variant/20">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-on-surface-variant">Budget Usage</span>
                    <span className="text-on-surface font-bold">{overallUsage}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container" style={{ width: `${overallUsage}%` }} />
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row gap-6">
                <InsightCard
                  icon={TrendingUp}
                  title="Budget Tracking"
                  description="Progress bars are now wired to API values and will reflect real spending once transactions are connected."
                  bgIcon={Wallet}
                />
                <InsightCard
                  icon={Sparkles}
                  title="Future Ready"
                  description="When transactions are added, each budget card will auto-calculate used percentage from spentAmount."
                  bgIcon={TrendingUp}
                  iconColor="text-tertiary"
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <BudgetModal
        isOpen={isModalOpen}
        mode={editingBudget ? "edit" : "create"}
        isSubmitting={isSubmitting}
        apiMessage={modalApiMessage}
        categories={categories}
        initialValues={selectedBudget || undefined}
        onClose={handleModalClose}
        onSubmit={handleBudgetSave}
      />

      <ConfirmActionModal
        isOpen={Boolean(deleteBudgetId)}
        intent="delete"
        variant="danger"
        title="Delete budget?"
        description={
          deleteBudgetData
            ? `This will permanently delete the budget for ${typeof deleteBudgetData.categoryId === "string" ? deleteBudgetData.categoryId : deleteBudgetData.categoryId.name}. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        apiMessage={deleteApiMessage}
        isLoading={deleteBudgetMutation.isPending}
        onClose={handleDeletePromptClose}
        onConfirm={handleDeleteBudget}
      />
    </div>
  );
};

export default Budget;
