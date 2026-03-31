"use client";

import { useState } from "react";
import {
  ReceiptText,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Banknote,
  Utensils,
  Zap,
  Dumbbell,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils/helper";
import TransactionDrawer from "./components/TransactionDrawer";
import TransactionDetail from "./components/TransactionDetail";

export type TransactionStatus = "Completed" | "Pending" | "Failed";
export type TransactionType = "Expense" | "Income" | "Transfer";

export interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  account: string;
  status: TransactionStatus;
  type: TransactionType;
  amount: number;
  notes?: string;
  icon?: string;
}

export interface TransactionSummary {
  totalOutflow: number;
  totalInflow: number;
  netCashflow: number;
  outflowTrend: number;
  inflowTrend: number;
}

// --- Mock Data ---
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Apple Store Purchase",
    category: "Technology",
    date: "Oct 24, 2023",
    account: "Chase Checking",
    status: "Completed",
    type: "Expense",
    amount: 1299.0,
    icon: "shopping_bag",
  },
  {
    id: "2",
    title: "Monthly Salary",
    category: "Income",
    date: "Oct 20, 2023",
    account: "Wells Fargo",
    status: "Completed",
    type: "Income",
    amount: 8500.0,
    icon: "payments",
  },
  {
    id: "3",
    title: "Blue Hill Restaurant",
    category: "Dining",
    date: "Oct 19, 2023",
    account: "Chase Checking",
    status: "Pending",
    type: "Expense",
    amount: 245.5,
    icon: "restaurant",
  },
  {
    id: "4",
    title: "Electric Bill",
    category: "Utilities",
    date: "Oct 18, 2023",
    account: "Wells Fargo",
    status: "Completed",
    type: "Expense",
    amount: 112.1,
    icon: "bolt",
  },
  {
    id: "5",
    title: "Equinox Membership",
    category: "Health",
    date: "Oct 15, 2023",
    account: "Chase Checking",
    status: "Completed",
    type: "Expense",
    amount: 225.0,
    icon: "fitness_center",
  },
];

const Transactions = () => {
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shopping_bag":
        return <ShoppingBag className="w-5 h-5" />;
      case "payments":
        return <Banknote className="w-5 h-5" />;
      case "restaurant":
        return <Utensils className="w-5 h-5" />;
      case "bolt":
        return <Zap className="w-5 h-5" />;
      case "fitness_center":
        return <Dumbbell className="w-5 h-5" />;
      default:
        return <ReceiptText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen flex flex-col">
        <div className="p-8 space-y-8 max-w-350 mx-auto w-full">
          {selectedTransaction ? (
            <TransactionDetail
              transaction={selectedTransaction}
              onBack={() => setSelectedTransaction(null)}
            />
          ) : (
            <>
              {/* Page Header */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-2 block">
                    Management
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight text-on-surface">
                    Transactions
                  </h2>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="primary-gradient cursor-pointer text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-xl shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Transaction
                </button>
              </div>

              {/* Filters Row */}
              <section className="bg-surface-container p-6 rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Search Keywords
                    </label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-low border-none rounded-md py-2.5 px-3 text-sm focus:ring-1 focus:ring-primary/30 outline-none"
                      placeholder="Filter by title..."
                    />
                  </div>
                  {[
                    {
                      label: "Date Range",
                      options: [
                        "Last 30 Days",
                        "This Month",
                        "Last Quarter",
                        "Custom Range",
                      ],
                    },
                    {
                      label: "Category",
                      options: [
                        "All Categories",
                        "Food & Dining",
                        "Entertainment",
                        "Housing",
                        "Investments",
                      ],
                    },
                    {
                      label: "Status",
                      options: ["All Status", "Completed", "Pending", "Failed"],
                    },
                    {
                      label: "Type",
                      options: ["All Types", "Expense", "Income", "Transfer"],
                    },
                  ].map((filter) => (
                    <div key={filter.label} className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        {filter.label}
                      </label>
                      <div className="relative">
                        <select className="w-full bg-surface-container-low border-none rounded-md py-2.5 px-3 text-sm focus:ring-1 focus:ring-primary/30 appearance-none outline-none cursor-pointer">
                          {filter.options.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Data Table */}
              <section className="bg-surface-container rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-surface-container-low">
                        <th className="py-4 px-6 w-10">
                          <input
                            type="checkbox"
                            className="rounded-sm bg-surface-container-highest border-none focus:ring-primary text-primary-container"
                          />
                        </th>
                        <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Title
                        </th>
                        <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Category
                        </th>
                        <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Date
                        </th>
                        <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Account
                        </th>
                        <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Status
                        </th>
                        <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right pr-6">
                          Amount
                        </th>
                        <th className="py-4 px-4 w-20"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="group hover:bg-surface-container-high/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedTransaction(tx)}
                        >
                          <td
                            className="py-4 px-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="rounded-sm bg-surface-container-highest border-none focus:ring-primary text-primary-container"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                                {getIcon(tx.icon || "")}
                              </div>
                              <span className="font-semibold text-sm">
                                {tx.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={cn(
                                "px-3 py-1 text-[10px] font-bold rounded-full border",
                                tx.category === "Income"
                                  ? "bg-tertiary-container/10 text-tertiary border-tertiary/20"
                                  : "bg-primary-container/10 text-primary border-primary/20",
                              )}
                            >
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-on-surface-variant">
                            {tx.date}
                          </td>
                          <td className="py-4 px-4 text-sm text-on-surface-variant">
                            {tx.account}
                          </td>
                          <td className="py-4 px-4">
                            <div
                              className={cn(
                                "flex items-center gap-1.5 text-[11px] font-medium",
                                tx.status === "Completed"
                                  ? "text-secondary"
                                  : "text-on-surface-variant",
                              )}
                            >
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  tx.status === "Completed"
                                    ? "bg-secondary"
                                    : "bg-on-surface-variant/40",
                                )}
                              ></span>
                              {tx.status}
                            </div>
                          </td>
                          <td
                            className={cn(
                              "py-4 px-4 text-right pr-6 font-bold text-sm",
                              tx.type === "Income"
                                ? "text-primary"
                                : "text-error",
                            )}
                          >
                            {tx.type === "Income" ? "+" : "-"}$
                            {tx.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td
                            className="py-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-1 hover:bg-error-container/20 rounded text-error">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Bar */}
                <div className="px-6 py-6 bg-surface-container-low flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Showing 1-5 of 420 results
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors flex items-center gap-1">
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-md bg-primary text-on-primary font-bold text-xs">
                        1
                      </button>
                      <button className="w-8 h-8 rounded-md hover:bg-surface-container-highest text-on-surface-variant font-bold text-xs transition-colors">
                        2
                      </button>
                      <button className="w-8 h-8 rounded-md hover:bg-surface-container-highest text-on-surface-variant font-bold text-xs transition-colors">
                        3
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
                        ...
                      </span>
                      <button className="w-8 h-8 rounded-md hover:bg-surface-container-highest text-on-surface-variant font-bold text-xs transition-colors">
                        42
                      </button>
                    </div>
                    <button className="px-3 py-1.5 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors flex items-center gap-1">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Summary Section */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container p-6 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                    Total Outflow
                  </p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-2xl font-bold">$4,281.50</h3>
                    <span className="text-error text-xs font-medium flex items-center mb-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      12%
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container p-6 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                    Total Inflow
                  </p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-2xl font-bold">$12,500.00</h3>
                    <span className="text-primary text-xs font-medium flex items-center mb-1">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      5%
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container p-6 rounded-xl border border-primary/10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                    Net Cashflow
                  </p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-2xl font-bold text-on-surface">
                      +$8,218.50
                    </h3>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold mb-1">
                      HEALTHY
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <TransactionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Footer Accent */}
      <footer className="py-10 px-12 opacity-30 text-[10px] uppercase tracking-widest text-on-surface-variant text-center">
        System ID: TXN_8829_QLP • Secured by LedgerGuard™ Encryption
      </footer>
    </div>
  );
};

export default Transactions;
