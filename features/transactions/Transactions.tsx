"use client";

import { useMemo, useState } from "react";
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
  ArrowRightLeft,
} from "lucide-react";

import { cn } from "@/lib/utils/helper";
import { ConfirmActionModal } from "@/components/ui/ConfirmActionModal";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/hooks/useTransactions";

import TransactionDrawer from "./components/TransactionDrawer";
import TransactionDetail from "./components/TransactionDetail";
import type { Account } from "../accounts/types";
import type { Category } from "../categories/types";
import type {
  TransactionFilters,
  TransactionPayload,
  TransactionRecord,
  TransactionStatus,
  TransactionType,
} from "./types";

const DATE_RANGE_OPTIONS = ["Last 30 Days", "This Month", "Last Quarter", "All Time"] as const;

type DateRangeOption = (typeof DATE_RANGE_OPTIONS)[number];

type UiTransaction = {
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
};

function mapCategoryIconToLegacy(icon?: string) {
  if (!icon) return "receipt";

  if (icon.includes("shopping")) return "shopping_bag";
  if (icon.includes("bank") || icon.includes("wallet")) return "payments";
  if (icon.includes("activity")) return "fitness_center";
  if (icon.includes("home")) return "home";
  if (icon.includes("plane")) return "flight";
  if (icon.includes("bolt")) return "bolt";
  return icon;
}

function getDateRangeFilter(range: DateRangeOption): Pick<TransactionFilters, "dateFrom" | "dateTo"> {
  const today = new Date();
  const toDate = today.toISOString().slice(0, 10);

  if (range === "Last 30 Days") {
    const from = new Date(today);
    from.setDate(today.getDate() - 30);
    return { dateFrom: from.toISOString().slice(0, 10), dateTo: toDate };
  }

  if (range === "This Month") {
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    return { dateFrom: from.toISOString().slice(0, 10), dateTo: toDate };
  }

  if (range === "Last Quarter") {
    const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
    const from = new Date(today.getFullYear(), quarterStartMonth - 3, 1);
    const quarterEnd = new Date(today.getFullYear(), quarterStartMonth, 0);
    return {
      dateFrom: from.toISOString().slice(0, 10),
      dateTo: quarterEnd.toISOString().slice(0, 10),
    };
  }

  return { dateFrom: undefined, dateTo: undefined };
}

const Transactions = () => {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeOption>("Last 30 Days");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | TransactionStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [page, setPage] = useState(1);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionRecord | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<UiTransaction | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [modalApiMessage, setModalApiMessage] = useState<string | null>(null);
  const [deleteApiMessage, setDeleteApiMessage] = useState<string | null>(null);

  const categoriesQuery = useCategories();
  const accountsQuery = useAccounts();

  const dateFilter = useMemo(() => getDateRangeFilter(dateRange), [dateRange]);

  const filters = useMemo<TransactionFilters>(() => {
    return {
      page,
      limit: 10,
      search: search.trim() || undefined,
      type: typeFilter === "all" ? undefined : typeFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      categoryId: categoryFilter === "all" ? undefined : categoryFilter,
      dateFrom: dateFilter.dateFrom,
      dateTo: dateFilter.dateTo,
    };
  }, [categoryFilter, dateFilter.dateFrom, dateFilter.dateTo, page, search, statusFilter, typeFilter]);

  const transactionsQuery = useTransactions(filters);
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const categories = useMemo<Category[]>(() => {
    if (!categoriesQuery.data?.success || !Array.isArray(categoriesQuery.data.data)) {
      return [];
    }
    return categoriesQuery.data.data as Category[];
  }, [categoriesQuery.data]);

  const accounts = useMemo<Account[]>(() => {
    if (!accountsQuery.data?.success || !Array.isArray(accountsQuery.data.data)) {
      return [];
    }
    return accountsQuery.data.data as Account[];
  }, [accountsQuery.data]);

  const transactionData = useMemo(() => {
    if (!transactionsQuery.data?.success || !transactionsQuery.data?.data) {
      return {
        transactions: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        summary: {
          totalInflow: 0,
          totalOutflow: 0,
          netCashflow: 0,
          transferVolume: 0,
        },
      };
    }

    return transactionsQuery.data.data;
  }, [transactionsQuery.data]);

  const transactionRecords: TransactionRecord[] = transactionData.transactions || [];

  const uiTransactions: UiTransaction[] = useMemo(() => {
    return transactionRecords.map((transaction) => {
      const category =
        typeof transaction.categoryId === "string"
          ? transaction.type === "Transfer"
            ? "Transfer"
            : "Unknown"
          : transaction.categoryId?.name || (transaction.type === "Transfer" ? "Transfer" : "Unknown");

      const account =
        typeof transaction.accountId === "string"
          ? "Unknown Account"
          : transaction.accountId?.name || "Unknown Account";

      return {
        id: transaction._id,
        title: transaction.title,
        category,
        date: new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }).format(new Date(transaction.transactionDate)),
        account,
        status: transaction.status,
        type: transaction.type,
        amount: transaction.amount,
        notes: transaction.notes,
        icon:
          typeof transaction.categoryId === "string"
            ? "receipt"
            : mapCategoryIconToLegacy(transaction.categoryId?.icon),
      };
    });
  }, [transactionRecords]);

  const isSubmitting =
    createTransactionMutation.isPending || updateTransactionMutation.isPending;

  const selectedTransactionRecord = useMemo(
    () => transactionRecords.find((item) => item._id === editingTransaction?._id) || editingTransaction,
    [editingTransaction, transactionRecords],
  );

  const deleteTransactionData = useMemo(
    () => uiTransactions.find((item) => item.id === deleteTransactionId) || null,
    [deleteTransactionId, uiTransactions],
  );

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
      case "transfer":
        return <ArrowRightLeft className="w-5 h-5" />;
      default:
        return <ReceiptText className="w-5 h-5" />;
    }
  };

  const handleDrawerOpenCreate = () => {
    setModalApiMessage(null);
    setEditingTransaction(null);
    setIsDrawerOpen(true);
  };

  const handleDrawerOpenEdit = (transactionId: string) => {
    const transaction = transactionRecords.find((item) => item._id === transactionId);
    if (!transaction) return;

    setModalApiMessage(null);
    setEditingTransaction(transaction);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setModalApiMessage(null);
    setIsDrawerOpen(false);
    setEditingTransaction(null);
  };

  const handleTransactionSave = async (payload: TransactionPayload) => {
    setModalApiMessage(null);

    if (editingTransaction) {
      const result = await updateTransactionMutation.mutateAsync({
        transactionId: editingTransaction._id,
        payload,
      });

      if (!result?.success) {
        setModalApiMessage(result?.message || "Unable to update transaction.");
        return;
      }

      handleDrawerClose();
      return;
    }

    const result = await createTransactionMutation.mutateAsync(payload);
    if (!result?.success) {
      setModalApiMessage(result?.message || "Unable to create transaction.");
      return;
    }

    handleDrawerClose();
  };

  const handleDeletePromptOpen = (id: string) => {
    setDeleteApiMessage(null);
    setDeleteTransactionId(id);
  };

  const handleDeletePromptClose = () => {
    if (deleteTransactionMutation.isPending) return;
    setDeleteApiMessage(null);
    setDeleteTransactionId(null);
  };

  const handleDeleteTransaction = async () => {
    if (!deleteTransactionId) return;

    const result = await deleteTransactionMutation.mutateAsync(deleteTransactionId);
    if (!result?.success) {
      setDeleteApiMessage(result?.message || "Unable to delete transaction.");
      return;
    }

    handleDeletePromptClose();
  };

  const totalPages = Math.max(1, transactionData.pagination.totalPages || 1);
  const currentPage = Math.min(page, totalPages);
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => Math.max(1, currentPage - 2) + index,
  ).filter((pageNumber) => pageNumber <= totalPages);

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
                  onClick={handleDrawerOpenCreate}
                  className="primary-gradient cursor-pointer text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-xl shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Transaction
                </button>
              </div>

              <section className="bg-surface-container p-6 rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Search Keywords
                    </label>
                    <input
                      type="text"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                      className="w-full bg-surface-container-low border-none rounded-md py-2.5 px-3 text-sm focus:ring-1 focus:ring-primary/30 outline-none"
                      placeholder="Filter by title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Date Range
                    </label>
                    <div className="relative">
                      <select
                        value={dateRange}
                        onChange={(event) => {
                          setDateRange(event.target.value as DateRangeOption);
                          setPage(1);
                        }}
                        className="w-full bg-surface-container-low border-none rounded-md py-2.5 px-3 text-sm focus:ring-1 focus:ring-primary/30 appearance-none outline-none cursor-pointer"
                      >
                        {DATE_RANGE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={categoryFilter}
                        onChange={(event) => {
                          setCategoryFilter(event.target.value);
                          setPage(1);
                        }}
                        className="w-full bg-surface-container-low border-none rounded-md py-2.5 px-3 text-sm focus:ring-1 focus:ring-primary/30 appearance-none outline-none cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(event) => {
                          setStatusFilter(event.target.value as "all" | TransactionStatus);
                          setPage(1);
                        }}
                        className="w-full bg-surface-container-low border-none rounded-md py-2.5 px-3 text-sm focus:ring-1 focus:ring-primary/30 appearance-none outline-none cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Type
                    </label>
                    <div className="relative">
                      <select
                        value={typeFilter}
                        onChange={(event) => {
                          setTypeFilter(event.target.value as "all" | TransactionType);
                          setPage(1);
                        }}
                        className="w-full bg-surface-container-low border-none rounded-md py-2.5 px-3 text-sm focus:ring-1 focus:ring-primary/30 appearance-none outline-none cursor-pointer"
                      >
                        <option value="all">All Types</option>
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                        <option value="Transfer">Transfer</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                    </div>
                  </div>
                </div>
              </section>

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
                      {transactionsQuery.isLoading ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-on-surface-variant">
                            Loading transactions...
                          </td>
                        </tr>
                      ) : uiTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-on-surface-variant">
                            No transactions found.
                          </td>
                        </tr>
                      ) : (
                        uiTransactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="group hover:bg-surface-container-high/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <td
                              className="py-4 px-6"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                className="rounded-sm bg-surface-container-highest border-none focus:ring-primary text-primary-container"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                                  {getIcon(transaction.icon || "")}
                                </div>
                                <span className="font-semibold text-sm">{transaction.title}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={cn(
                                  "px-3 py-1 text-[10px] font-bold rounded-full border",
                                  transaction.type === "Income"
                                    ? "bg-tertiary-container/10 text-tertiary border-tertiary/20"
                                    : transaction.type === "Transfer"
                                      ? "bg-secondary/10 text-secondary border-secondary/20"
                                      : "bg-primary-container/10 text-primary border-primary/20",
                                )}
                              >
                                {transaction.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-on-surface-variant">
                              {transaction.date}
                            </td>
                            <td className="py-4 px-4 text-sm text-on-surface-variant">
                              {transaction.account}
                            </td>
                            <td className="py-4 px-4">
                              <div
                                className={cn(
                                  "flex items-center gap-1.5 text-[11px] font-medium",
                                  transaction.status === "Completed"
                                    ? "text-secondary"
                                    : transaction.status === "Pending"
                                      ? "text-on-surface-variant"
                                      : "text-error",
                                )}
                              >
                                <span
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    transaction.status === "Completed"
                                      ? "bg-secondary"
                                      : transaction.status === "Pending"
                                        ? "bg-on-surface-variant/40"
                                        : "bg-error",
                                  )}
                                ></span>
                                {transaction.status}
                              </div>
                            </td>
                            <td
                              className={cn(
                                "py-4 px-4 text-right pr-6 font-bold text-sm",
                                transaction.type === "Income"
                                  ? "text-primary"
                                  : transaction.type === "Transfer"
                                    ? "text-secondary"
                                    : "text-error",
                              )}
                            >
                              {transaction.type === "Income"
                                ? "+"
                                : transaction.type === "Expense"
                                  ? "-"
                                  : ""}
                              ${transaction.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td
                              className="py-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant"
                                  onClick={() => handleDrawerOpenEdit(transaction.id)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-1 hover:bg-error-container/20 rounded text-error"
                                  onClick={() => handleDeletePromptOpen(transaction.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-6 bg-surface-container-low flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Showing {uiTransactions.length === 0 ? 0 : (currentPage - 1) * transactionData.pagination.limit + 1}
                    -
                    {(currentPage - 1) * transactionData.pagination.limit + uiTransactions.length} of {transactionData.pagination.total} results
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage <= 1}
                      className="px-3 py-1.5 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {pageNumbers.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={cn(
                            "w-8 h-8 rounded-md font-bold text-xs transition-colors",
                            pageNumber === currentPage
                              ? "bg-primary text-on-primary"
                              : "hover:bg-surface-container-highest text-on-surface-variant",
                          )}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1.5 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container p-6 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                    Total Outflow
                  </p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-2xl font-bold">
                      ${transactionData.summary.totalOutflow.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h3>
                    <span className="text-error text-xs font-medium flex items-center mb-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Live
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container p-6 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                    Total Inflow
                  </p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-2xl font-bold">
                      ${transactionData.summary.totalInflow.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h3>
                    <span className="text-primary text-xs font-medium flex items-center mb-1">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Live
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container p-6 rounded-xl border border-primary/10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                    Net Cashflow
                  </p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-2xl font-bold text-on-surface">
                      {transactionData.summary.netCashflow >= 0 ? "+" : "-"}$
                      {Math.abs(transactionData.summary.netCashflow).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h3>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold mb-1">
                      {transactionData.summary.netCashflow >= 0 ? "HEALTHY" : "RISK"}
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
        mode={editingTransaction ? "edit" : "create"}
        isSubmitting={isSubmitting}
        apiMessage={modalApiMessage}
        initialValues={selectedTransactionRecord || undefined}
        accounts={accounts}
        categories={categories}
        onClose={handleDrawerClose}
        onSubmit={handleTransactionSave}
      />

      <ConfirmActionModal
        isOpen={Boolean(deleteTransactionId)}
        intent="delete"
        variant="danger"
        title="Delete transaction?"
        description={
          deleteTransactionData
            ? `This will permanently delete ${deleteTransactionData.title}. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        apiMessage={deleteApiMessage}
        isLoading={deleteTransactionMutation.isPending}
        onClose={handleDeletePromptClose}
        onConfirm={handleDeleteTransaction}
      />

      <footer className="py-10 px-12 opacity-30 text-[10px] uppercase tracking-widest text-on-surface-variant text-center">
        System ID: TXN_8829_QLP • Secured by LedgerGuard™ Encryption
      </footer>
    </div>
  );
};

export default Transactions;
