"use client";

import React from "react";
import { AlertTriangle, Info, LogOut, ShieldAlert, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils/helper";

type ConfirmVariant = "danger" | "warning" | "info" | "neutral";
type ConfirmIntent = "delete" | "logout" | "generic";

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  intent?: ConfirmIntent;
  isLoading?: boolean;
  apiMessage?: string | null;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

const variantMap: Record<ConfirmVariant, { iconWrap: string; iconColor: string; confirmBtn: string }> = {
  danger: {
    iconWrap: "bg-error/15",
    iconColor: "text-error",
    confirmBtn: "bg-error hover:bg-error/90 text-on-error",
  },
  warning: {
    iconWrap: "bg-amber-500/15",
    iconColor: "text-amber-500",
    confirmBtn: "bg-amber-500 hover:bg-amber-500/90 text-white",
  },
  info: {
    iconWrap: "bg-primary/15",
    iconColor: "text-primary",
    confirmBtn: "bg-primary hover:bg-primary/90 text-on-primary-fixed",
  },
  neutral: {
    iconWrap: "bg-surface-container-highest",
    iconColor: "text-on-surface-variant",
    confirmBtn: "bg-surface-bright hover:bg-surface-container-high text-on-surface",
  },
};

function getIntentIcon(intent: ConfirmIntent, variant: ConfirmVariant) {
  if (intent === "logout") return LogOut;
  if (intent === "delete") return variant === "warning" ? ShieldAlert : AlertTriangle;
  return Info;
}

export function ConfirmActionModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  intent = "generic",
  isLoading,
  apiMessage,
  onConfirm,
  onClose,
}: ConfirmActionModalProps) {
  const variantClasses = variantMap[variant];
  const Icon = getIntentIcon(intent, variant);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-surface-container-lowest/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            className="relative w-full max-w-md rounded-3xl border border-outline-variant/15 bg-surface-container-high p-7 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={Boolean(isLoading)}
              className="absolute cursor-pointer right-5 top-5 h-8 w-8 rounded-full text-on-surface-variant hover:bg-surface-bright disabled:cursor-not-allowed"
            >
              <X size={16} className="mx-auto" />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl",
                  variantClasses.iconWrap,
                )}
              >
                <Icon size={20} className={variantClasses.iconColor} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-on-surface">{title}</h3>
                {description ? (
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{description}</p>
                ) : null}
              </div>
            </div>

            {apiMessage ? (
              <p className="mb-4 rounded-xl bg-error/10 px-3 py-2 text-sm font-medium text-error">
                {apiMessage}
              </p>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={Boolean(isLoading)}
                className="flex-1 cursor-pointer rounded-2xl px-4 py-3 text-sm font-bold text-on-surface-variant transition-all hover:bg-surface-bright disabled:cursor-not-allowed disabled:opacity-70"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={Boolean(isLoading)}
                className={cn(
                  "flex-1 cursor-pointer rounded-2xl px-4 py-3 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-70",
                  variantClasses.confirmBtn,
                )}
              >
                {isLoading ? "Please wait..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
