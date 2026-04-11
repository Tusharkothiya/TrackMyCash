import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Plus,
  TrendingDown,
  TrendingUp,
  UploadCloud,
  X,
  ArrowRightLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import type { Account } from "@/features/accounts/types";
import type { Category } from "@/features/categories/types";
import { TOAST } from "@/lib/utils/toastMessage";

import { validateTransactionPayload } from "../schemas/transaction.schema";
import type {
  TransactionPayload,
  TransactionRecord,
  TransactionStatus,
  TransactionType,
} from "../types";

interface TransactionDrawerProps {
  isOpen: boolean;
  mode: "create" | "edit";
  isSubmitting?: boolean;
  apiMessage?: string | null;
  initialValues?: TransactionRecord;
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
  onSubmit: (payload: TransactionPayload) => void | Promise<void>;
}

function toDateInputValue(value?: string) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function resolveRefId(value?: string | { _id: string }) {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
}

const TRANSACTION_TYPES: TransactionType[] = ["Expense", "Income", "Transfer"];
const TRANSACTION_STATUSES: TransactionStatus[] = ["Completed", "Pending", "Failed"];

const TransactionDrawer = ({
  isOpen,
  mode,
  isSubmitting,
  apiMessage,
  initialValues,
  accounts,
  categories,
  onClose,
  onSubmit,
}: TransactionDrawerProps) => {
  const [type, setType] = useState<TransactionType>("Expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [transactionDate, setTransactionDate] = useState(toDateInputValue());
  const [status, setStatus] = useState<TransactionStatus>("Completed");
  const [notes, setNotes] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (type === "Transfer") return [];

    const categoryType = type === "Expense" ? "expense" : "income";
    return categories.filter((category) => category.type === categoryType);
  }, [categories, type]);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialValues) {
      setType(initialValues.type);
      setTitle(initialValues.title || "");
      setAmount(String(initialValues.amount || ""));
      setCategoryId(resolveRefId(initialValues.categoryId));
      setAccountId(resolveRefId(initialValues.accountId));
      setDestinationAccountId(resolveRefId(initialValues.destinationAccountId));
      setTransactionDate(toDateInputValue(initialValues.transactionDate));
      setStatus(initialValues.status);
      setNotes(initialValues.notes || "");
      setReceiptUrl(initialValues.receiptUrl || "");
      return;
    }

    setType("Expense");
    setTitle("");
    setAmount("");
    setCategoryId("");
    setAccountId(accounts[0]?._id || "");
    setDestinationAccountId("");
    setTransactionDate(toDateInputValue());
    setStatus("Completed");
    setNotes("");
    setReceiptUrl("");
  }, [accounts, initialValues, isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      setValidationMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (type === "Transfer") {
      setCategoryId("");
      return;
    }

    if (filteredCategories.length > 0 && !filteredCategories.find((item) => item._id === categoryId)) {
      setCategoryId(filteredCategories[0]._id);
    }
  }, [categoryId, filteredCategories, type]);

  const messageToShow = useMemo(
    () => validationMessage || apiMessage || null,
    [apiMessage, validationMessage],
  );

  const handleSubmit = async () => {
    const parsedAmount = Number(amount);

    if (type === "Expense" || type === "Transfer") {
      const sourceAccount = accounts.find((account) => account._id === accountId);
      if (sourceAccount && parsedAmount > sourceAccount.balance) {
        const errorMessage = "Amount cannot be greater than available account balance.";
        setValidationMessage(errorMessage);
        TOAST("error", errorMessage);
        return;
      }
    }

    const payload: TransactionPayload = {
      title: title.trim(),
      amount: parsedAmount,
      type,
      status,
      transactionDate,
      accountId,
      destinationAccountId: type === "Transfer" ? destinationAccountId : undefined,
      categoryId: type !== "Transfer" ? categoryId : undefined,
      notes: notes.trim() || undefined,
      receiptUrl: receiptUrl.trim() || undefined,
    };

    const errorMessage = validateTransactionPayload(payload);
    if (errorMessage) {
      setValidationMessage(errorMessage);
      TOAST("error", errorMessage);
      return;
    }

    setValidationMessage(null);
    await onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-120 bg-[#0d1117] shadow-2xl z-70 flex flex-col border-l border-outline-variant/20"
          >
            <header className="h-20 px-8 flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus className="text-primary w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-on-surface">
                  {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 cursor-pointer rounded-full hover:bg-surface-bright transition-colors flex items-center justify-center text-on-surface-variant"
              >
                <X className="w-6 h-6" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                  Transaction Type
                </label>
                <div className="grid grid-cols-3 bg-surface-container-lowest p-1 rounded-[10px] border border-outline-variant/10 gap-1">
                  {TRANSACTION_TYPES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`cursor-pointer flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-colors ${
                        type === item
                          ? "bg-surface-container text-on-surface shadow-sm font-bold"
                          : "text-on-surface-variant hover:text-on-surface font-medium"
                      }`}
                    >
                      {item === "Expense" ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : item === "Income" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <ArrowRightLeft className="w-4 h-4" />
                      )}
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                    Transaction Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary/50 outline-none transition-all"
                    placeholder="e.g. Monthly Grocery"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-on-surface-variant">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg pl-8 pr-4 py-3 text-2xl font-bold text-on-surface focus:border-primary/50 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {type !== "Transfer" ? (
                  <div className="space-y-2.5">
                    <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                      Category
                    </label>
                    <div className="relative group">
                      <select
                        value={categoryId}
                        onChange={(event) => setCategoryId(event.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm cursor-pointer"
                      >
                        <option value="">Select category</option>
                        {filteredCategories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                      Destination Account
                    </label>
                    <div className="relative group">
                      <select
                        value={destinationAccountId}
                        onChange={(event) => setDestinationAccountId(event.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm cursor-pointer"
                      >
                        <option value="">Select destination</option>
                        {accounts
                          .filter((account) => account._id !== accountId)
                          .map((account) => (
                            <option key={account._id} value={account._id}>
                              {account.name}
                            </option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                    </div>
                  </div>
                )}

                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                    Account
                  </label>
                  <div className="relative group">
                    <select
                      value={accountId}
                      onChange={(event) => setAccountId(event.target.value)}
                      className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm cursor-pointer"
                    >
                      <option value="">Select account</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={transactionDate}
                      onChange={(event) => setTransactionDate(event.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                    Status
                  </label>
                  <div className="relative group">
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as TransactionStatus)}
                      className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm cursor-pointer"
                    >
                      {TRANSACTION_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary/50 outline-none transition-all text-sm resize-none"
                  placeholder="Add some details about this transaction..."
                  rows={3}
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">
                  Receipt URL (Optional)
                </label>
                <input
                  value={receiptUrl}
                  onChange={(event) => setReceiptUrl(event.target.value)}
                  type="url"
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary/50 outline-none transition-all text-sm"
                  placeholder="https://example.com/receipt.png"
                />
              </div>

              <div className="p-6 border-2 border-dashed border-outline-variant/20 rounded-xl flex flex-col items-center justify-center gap-3 group hover:border-primary/30 transition-colors cursor-not-allowed opacity-60">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-on-surface">Upload Receipt</p>
                  <p className="text-xs text-on-surface-variant">Frontend upload integration pending</p>
                </div>
              </div>

              {messageToShow ? (
                <p className="text-sm text-error bg-error/10 px-3 py-2 rounded-lg">{messageToShow}</p>
              ) : null}
            </div>

            <footer className="p-8 border-t border-outline-variant/10 flex items-center gap-4 bg-surface-container-lowest">
              <button
                onClick={onClose}
                disabled={Boolean(isSubmitting)}
                className="flex-1 py-3.5 cursor-pointer rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-bright transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={Boolean(isSubmitting)}
                className="flex-2 cursor-pointer py-3.5 rounded-lg primary-gradient text-sm font-bold text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? mode === "edit"
                    ? "Updating..."
                    : "Saving..."
                  : mode === "edit"
                    ? "Update Transaction"
                    : "Save Transaction"}
              </button>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default TransactionDrawer;