"use client";

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CategoryCard } from "./components/CategoryCard";
import { InsightFooter } from "./components/InsightFooter";
import { AddCategoryModal } from "./components/AddCategoryModal";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import { Category, CategoryPayload } from "./types";
import { ConfirmActionModal } from "@/components/ui/ConfirmActionModal";

const CATEGORY_SKELETON_COUNT = 4;

function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container p-6 shadow-sm h-full">
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative flex justify-between items-start mb-6">
        <div className="h-12 w-12 rounded-2xl bg-surface-bright animate-pulse" />
        <div className="flex gap-1">
          <div className="h-9 w-9 rounded-lg bg-surface-bright animate-pulse" />
          <div className="h-9 w-9 rounded-lg bg-surface-bright animate-pulse" />
        </div>
      </div>

      <div className="relative space-y-3">
        <div className="h-7 w-3/5 rounded-lg bg-surface-bright animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-surface-bright animate-pulse" />
          <div className="h-4 w-2/3 rounded-lg bg-surface-bright animate-pulse" />
        </div>

        <div className="mt-6 pt-6 border-t border-outline-variant/5 space-y-3">
          <div className="h-3 w-28 rounded-lg bg-surface-bright animate-pulse" />
          <div className="h-8 w-24 rounded-lg bg-surface-bright animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CreateCategorySkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-outline-variant/20 bg-surface-container-lowest p-6 min-h-60">
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative h-full flex flex-col items-center justify-center text-center text-on-surface-variant">
        <div className="h-14 w-14 rounded-full bg-surface-container animate-pulse mb-4" />
        <div className="h-4 w-40 rounded-lg bg-surface-bright animate-pulse" />
        <div className="mt-2 h-3 w-48 rounded-lg bg-surface-bright/80 animate-pulse" />
      </div>
    </div>
  );
}


const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState<"all" | "expense" | "income">("all");
  const [modalApiMessage, setModalApiMessage] = useState<string | null>(null);
  const [deleteApiMessage, setDeleteApiMessage] = useState<string | null>(null);

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const typeFilter = categoryType === "all" ? undefined : categoryType;
  const categoriesQuery = useCategories(typeFilter);

  const categories: Category[] = useMemo(() => {
    if (!categoriesQuery.data?.success || !Array.isArray(categoriesQuery.data?.data)) {
      return [];
    }
    return categoriesQuery.data.data;
  }, [categoriesQuery.data]);

  const selectedCategory = useMemo(() => {
    return editingCategory;
  }, [editingCategory]);

  const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  const deleteCategoryData = useMemo(
    () => categories.find((category) => category._id === deleteCategoryId) || null,
    [categories, deleteCategoryId],
  );

  const handleModalOpenForCreate = () => {
    setModalApiMessage(null);
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleModalOpenForEdit = (category: Category) => {
    setModalApiMessage(null);
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setModalApiMessage(null);
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySave = async (payload: CategoryPayload) => {
    setModalApiMessage(null);

    if (editingCategory) {
      const result = await updateCategoryMutation.mutateAsync({
        categoryId: editingCategory._id,
        payload,
      });

      if (!result?.success) {
        setModalApiMessage(result?.message || "Unable to update category.");
        return;
      }

      handleModalClose();
      return;
    }

    const result = await createCategoryMutation.mutateAsync(payload);
    if (!result?.success) {
      setModalApiMessage(result?.message || "Unable to create category.");
      return;
    }

    handleModalClose();
  };

  const handleDeletePromptOpen = (id: string) => {
    setDeleteApiMessage(null);
    setDeleteCategoryId(id);
  };

  const handleDeletePromptClose = () => {
    if (deleteCategoryMutation.isPending) return;
    setDeleteApiMessage(null);
    setDeleteCategoryId(null);
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;

    const result = await deleteCategoryMutation.mutateAsync(deleteCategoryId);
    if (!result?.success) {
      setDeleteApiMessage(result?.message || "Unable to delete category.");
      return;
    }

    handleDeletePromptClose();
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      
      <main className="min-h-screen ">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
            <div>
              <span className="text-[0.7rem] font-bold tracking-[0.2em] text-primary uppercase block mb-2">
                Portfolio Management
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-on-surface">
                Categories
              </h2>
            </div>
            
            <button 
              onClick={handleModalOpenForCreate}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 cursor-pointer bg-linear-to-br from-primary-container to-primary text-on-primary-fixed font-bold rounded-2xl flex items-center justify-center sm:justify-start gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/10 active:scale-95"
            >
              <PlusCircle size={20} />
              Add Category
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {(["all", "expense", "income"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setCategoryType(type)}
                className={`px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider transition-all ${
                  categoryType === type
                    ? "bg-primary text-on-primary-fixed"
                    : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categoriesQuery.isLoading ? (
              <>
                {Array.from({ length: CATEGORY_SKELETON_COUNT }).map((_, index) => (
                  <CategoryCardSkeleton key={`category-skeleton-${index}`} />
                ))}
                <CreateCategorySkeleton />
              </>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {categories.map((category) => (
                    <motion.div
                      key={category._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -4 }}
                    >
                      <CategoryCard 
                        category={category} 
                        onEdit={handleModalOpenForEdit}
                        onDelete={handleDeletePromptOpen}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!categoriesQuery.isLoading && categories.length === 0 && (
                  <div className="col-span-full bg-surface-container rounded-2xl p-10 text-center text-on-surface-variant font-medium">
                    No categories found for this filter.
                  </div>
                )}

                {/* Add New Category Placeholder */}
                <motion.button 
                  whileHover={{ y: -4 }}
                  onClick={handleModalOpenForCreate}
                  className="bg-surface-container-lowest cursor-pointer border-2 border-dashed border-outline-variant/20 rounded-2xl p-6 flex flex-col items-center justify-center text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all group min-h-60"
                >
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <PlusCircle size={32} />
                  </div>
                  <span className="font-bold text-sm tracking-wide">Create Custom Category</span>
                  <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase tracking-widest font-bold">Define a new tracking group</p>
                </motion.button>
              </>
            )}
          </div>

          {/* Footer Insight */}
          <InsightFooter />
        </div>
      </main>

      <AddCategoryModal 
        isOpen={isModalOpen} 
        mode={editingCategory ? "edit" : "create"}
        isSubmitting={isSubmitting}
        initialValues={selectedCategory || undefined}
        apiMessage={modalApiMessage}
        onClose={handleModalClose}
        onSubmit={handleCategorySave}
      />

      <ConfirmActionModal
        isOpen={Boolean(deleteCategoryId)}
        intent="delete"
        variant="danger"
        title="Delete category?"
        description={
          deleteCategoryData
            ? `This will permanently delete ${deleteCategoryData.name}. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        apiMessage={deleteApiMessage}
        isLoading={deleteCategoryMutation.isPending}
        onClose={handleDeletePromptClose}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}

export default Categories;