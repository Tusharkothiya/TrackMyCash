import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  ShoppingCart,
  Home,
  Plane,
  Activity,
  GraduationCap,
  Banknote,
  Clapperboard,
  PiggyBank,
  Theater,
  PawPrint,
  MoreHorizontal,
  Pipette,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils/helper";
import {
  Category,
  CategoryIcon,
  CategoryPayload,
} from "@/features/categories/types";
import { validateCategoryPayload } from "@/features/categories/schemas/category.schema";

const ICONS: { icon: CategoryIcon; label: string }[] = [
  { icon: "shopping-cart", label: "Shopping" },
  { icon: "home", label: "Home" },
  { icon: "plane", label: "Travel" },
  { icon: "activity", label: "Health" },
  { icon: "graduation-cap", label: "Education" },
  { icon: "banknote", label: "Income" },
  { icon: "clapperboard", label: "Media" },
  { icon: "piggy-bank", label: "Savings" },
  { icon: "theater", label: "Entertainment" },
  { icon: "paw-print", label: "Pets" },
  { icon: "more-horizontal", label: "Other" },
];

const COLORS = [
  "#2563eb", // Blue
  "#ffb596", // Peach
  "#a4b6f5", // Light Blue
  "#ffb4ab", // Pinkish
  "#0053db", // Deep Blue
  "#33467e", // Navy
];

const IconMap: Record<string, any> = {
  "shopping-cart": ShoppingCart,
  home: Home,
  plane: Plane,
  activity: Activity,
  "graduation-cap": GraduationCap,
  banknote: Banknote,
  clapperboard: Clapperboard,
  "piggy-bank": PiggyBank,
  theater: Theater,
  "paw-print": PawPrint,
  "more-horizontal": MoreHorizontal,
};

interface AddCategoryModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  isSubmitting?: boolean;
  apiMessage?: string | null;
  initialValues?: Category;
  onClose: () => void;
  onSubmit: (category: CategoryPayload) => void | Promise<void>;
}

export function AddCategoryModal({
  isOpen,
  mode,
  isSubmitting,
  apiMessage,
  initialValues,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<CategoryIcon>("home");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [overline, setOverline] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialValues) {
      setName(initialValues.name || "");
      setSelectedIcon(initialValues.icon || "home");
      setSelectedColor(initialValues.color || COLORS[0]);
      setType(initialValues.type || "expense");
      setOverline(initialValues.overline || "");
      return;
    }

    setName("");
    setSelectedIcon("home");
    setSelectedColor(COLORS[0]);
    setType("expense");
    setOverline("");
  }, [initialValues, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setValidationMessage(null);
    }
  }, [isOpen]);

  const messageToShow = useMemo(
    () => validationMessage || apiMessage || null,
    [validationMessage, apiMessage],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CategoryPayload = {
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      type,
      overline: overline.trim() || undefined,
    };

    const errorMessage = validateCategoryPayload(payload);
    if (errorMessage) {
      setValidationMessage(errorMessage);
      return;
    }

    setValidationMessage(null);
    await onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-high rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/10"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
                    New Asset Group
                  </p>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">
                    {mode === "edit" ? "Edit Category" : "Create Category"}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors text-on-surface-variant"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                    Category Name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Monthly Subscriptions"
                    className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface-variant/30 text-base transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                    Select Icon
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {ICONS.map(({ icon }) => {
                      const Icon = IconMap[icon];
                      const isActive = selectedIcon === icon;
                      return (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setSelectedIcon(icon)}
                          className={cn(
                            "aspect-square cursor-pointer flex items-center justify-center rounded-2xl transition-all duration-200",
                            isActive
                              ? "bg-primary text-on-primary-fixed shadow-lg scale-110"
                              : "bg-surface-container-highest text-on-surface hover:bg-surface-bright",
                          )}
                        >
                          <Icon size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                    Category Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["expense", "income"] as const).map((itemType) => (
                      <button
                        key={itemType}
                        type="button"
                        onClick={() => setType(itemType)}
                        className={cn(
                          "rounded-2xl py-3 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all",
                          type === itemType
                            ? "bg-primary text-on-primary-fixed"
                            : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface",
                        )}
                      >
                        {itemType}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                    Overline (Optional)
                  </label>
                  <input
                    type="text"
                    value={overline}
                    onChange={(e) => setOverline(e.target.value)}
                    placeholder="e.g. Q2 Campaigns"
                    className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface-variant/30 text-base transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-4">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all cursor-pointer duration-200 flex items-center justify-center",
                          selectedColor === color
                            ? "ring-4 ring-primary/20 ring-offset-4 ring-offset-surface-container-high scale-110"
                            : "hover:scale-110",
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {selectedColor === color && (
                          <Check size={14} className="text-white" />
                        )}
                      </button>
                    ))}
                    <div className="w-px h-6 bg-outline-variant/20 mx-1"></div>
                    <button
                      type="button"
                      className="w-8 h-8 cursor-pointer rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <Pipette size={14} />
                    </button>
                  </div>
                </div>

                {messageToShow ? (
                  <p className="text-sm text-red-600">{messageToShow}</p>
                ) : null}

                <div className="mt-12 flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={Boolean(isSubmitting)}
                    className="flex-1 px-6 py-4 cursor-pointer rounded-2xl text-on-surface-variant font-bold hover:bg-surface-bright transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={Boolean(isSubmitting)}
                    className="flex-2 px-6 py-4 cursor-pointer rounded-2xl bg-linear-to-br from-primary-container to-primary text-on-primary-fixed font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                  >
                    {isSubmitting
                      ? mode === "edit"
                        ? "Updating..."
                        : "Creating..."
                      : mode === "edit"
                        ? "Update Category"
                        : "Create Category"}
                  </button>
                </div>
              </form>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-tertiary/10 blur-[50px] pointer-events-none rounded-full"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
