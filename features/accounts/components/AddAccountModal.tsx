"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Landmark,
  Banknote,
  PiggyBank,
  Wallet,
  ChevronDown,
  Check,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Account, AccountPayload, AccountIcon, AccountType, Currency } from "@/features/accounts/types";
import { validateAccountPayload } from "@/features/accounts/schemas/account.schema";

interface AddAccountModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  isSubmitting?: boolean;
  apiMessage?: string | null;
  initialValues?: Account;
  onClose: () => void;
  onSubmit: (payload: AccountPayload) => void | Promise<void>;
}

export default function AddAccountModal({
  isOpen,
  mode,
  isSubmitting,
  apiMessage,
  initialValues,
  onClose,
  onSubmit,
}: AddAccountModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("Bank");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [balance, setBalance] = useState("");
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [selectedIcon, setSelectedIcon] = useState<AccountIcon>("bank");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const colors = [
    "#2563eb", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Rose
    "#a855f7", // Purple
    "#64748b", // Slate
  ];

  const icons: { id: AccountIcon; icon: React.ComponentType<any> }[] = [
    { id: "bank", icon: Landmark },
    { id: "credit_card", icon: PiggyBank },
    { id: "wallet", icon: Wallet },
    { id: "cash", icon: Banknote },
  ];

  const accountTypes: AccountType[] = ["Bank", "Credit Card", "Wallet", "Cash"];
  const currencies: Currency[] = ["USD", "INR", "EUR", "GBP"];

  useEffect(() => {
    if (!isOpen) return;

    if (initialValues && mode === "edit") {
      setName(initialValues.name || "");
      setType(initialValues.type || "Bank");
      setCurrency(initialValues.currency || "USD");
      setBalance(initialValues.balance.toString());
      setSelectedColor(initialValues.color || "#2563eb");
      setSelectedIcon(initialValues.icon || "bank");
      return;
    }

    setName("");
    setType("Bank");
    setCurrency("USD");
    setBalance("");
    setSelectedColor("#2563eb");
    setSelectedIcon("bank");
  }, [initialValues, isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      setValidationMessage(null);
    }
  }, [isOpen]);

  const messageToShow = useMemo(
    () => validationMessage || apiMessage || null,
    [validationMessage, apiMessage]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: AccountPayload = {
      name: name.trim(),
      type,
      currency,
      balance: parseFloat(balance) || 0,
      color: selectedColor,
      icon: selectedIcon,
    };

    const errorMessage = validateAccountPayload(payload);
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
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
                    Financial Account
                  </p>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">
                    {mode === "edit" ? "Edit Account" : "Add New Account"}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full hover:bg-surface-bright transition-colors text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Account Name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Personal Checking"
                    className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Account Type
                    </label>
                    <div className="relative">
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as AccountType)}
                        className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3.5 text-on-surface appearance-none focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer"
                      >
                        {accountTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={20}
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className="w-full bg-surface-container-highest border-none rounded-2xl px-4 py-3.5 text-on-surface appearance-none focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer"
                      >
                        {currencies.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={20}
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Initial Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">
                      {currency === "INR" ? "₹" : "$"}
                    </span>
                    <input
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      step="0.01"
                      className="w-full bg-surface-container-highest border-none rounded-2xl pl-8 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Account Style
                  </label>
                  
                  {/* Colors Section */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-on-surface-variant">
                      Brand Color
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`h-11 w-11 cursor-pointer rounded-full transition-all hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 ${
                            selectedColor === color
                              ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-surface-container-high"
                              : "opacity-60 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {selectedColor === color && (
                            <Check size={16} className="text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icons Section */}
                  <div className="space-y-2 border-t border-outline-variant/10 pt-4">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-on-surface-variant">
                      Account Icon
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {icons.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedIcon(item.id)}
                            className={`h-11 w-11 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                              selectedIcon === item.id
                                ? "bg-primary text-on-primary-fixed ring-2 ring-primary/30"
                                : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface hover:bg-surface-bright"
                            }`}
                          >
                            <Icon size={22} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {messageToShow && (
                  <p className="text-sm text-error bg-error/10 px-3 py-2 rounded-lg">{messageToShow}</p>
                )}

                <div className="mt-8 flex items-center justify-end gap-4 border-t border-outline-variant/20 pt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-linear-to-br cursor-pointer from-primary-container to-primary text-on-primary-fixed px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? mode === "edit"
                        ? "Updating..."
                        : "Creating..."
                      : mode === "edit"
                        ? "Update Account"
                        : "Add Account"}
                  </button>
                </div>
              </form>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none rounded-full" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
