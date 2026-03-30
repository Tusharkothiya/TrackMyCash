"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Landmark,
  Banknote,
  PiggyBank,
  Wallet,
  ChevronDown,
} from "lucide-react";
import React, { useState } from "react";
import { Account } from "./AccountCard";

export type Currency = "USD" | "INR" | "EUR" | "GBP";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (account: Omit<Account, "id">) => void;
}

export default function AddAccountModal({
  isOpen,
  onClose,
  onAdd,
}: AddAccountModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Account["type"]>("Bank");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [balance, setBalance] = useState("");
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [selectedIcon, setSelectedIcon] = useState("bank");

  const colors = [
    "#2563eb", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Rose
    "#a855f7", // Purple
    "#64748b", // Slate
  ];

  const icons = [
    { id: "bank", icon: Landmark },
    { id: "piggy", icon: PiggyBank },
    { id: "wallet", icon: Wallet },
    { id: "cash", icon: Banknote },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      type,
      balance: parseFloat(balance) || 0,
      monthlyIncome: 0,
      monthlyExpense: 0,
      color: selectedColor,
      icon: selectedIcon,
    });
    onClose();
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
            className="absolute inset-0 modal-blur"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-[#161B22] w-full max-w-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden border border-[#21262D] relative z-10"
          >
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-1">
                Add New Account
              </h2>
              <p className="text-on-surface-variant text-sm">
                Select your account type and provide the details to begin
                tracking.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-2 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80 ml-1">
                  Account Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                  placeholder="e.g. Personal Checking"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80 ml-1">
                    Account Type
                  </label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value as Account["type"])
                      }
                      className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 text-on-surface appearance-none focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer"
                    >
                      <option value="Bank">Bank</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Wallet">Wallet</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80 ml-1">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                      className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 text-on-surface appearance-none focus:ring-2 focus:ring-primary/30 outline-none cursor-pointer"
                    >
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80 ml-1">
                  Initial Balance
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="w-full bg-surface-container-highest border-none rounded-xl pl-8 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80 ml-1">
                  Account Style
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2 flex-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-10 w-10 cursor-pointer rounded-full transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                          selectedColor === color
                            ? "ring-4 ring-primary/20"
                            : "opacity-60 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {selectedColor === color && (
                          <X size={12} className="text-white rotate-45" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="w-px h-8 bg-outline-variant/30 mx-1"></div>
                  <div className="flex gap-2">
                    {icons.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedIcon(item.id)}
                          className={`h-10 w-10 rounded-xl bg-surface-container-highest flex items-center justify-center transition-colors cursor-pointer ${
                            selectedIcon === item.id
                              ? "text-on-surface ring-2 ring-primary/30"
                              : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="px-0 py-8 mt-4 flex items-center justify-end gap-4 border-t border-outline-variant/20"
                style={{
                  display:'flex',
                  justifyContent:'end'
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-linear-to-br cursor-pointer from-primary-container to-primary text-on-primary-fixed px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary-container/20"
                >
                  Add Account
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
