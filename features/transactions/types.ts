export type TransactionStatus = "Completed" | "Pending" | "Failed";
export type TransactionType = "Expense" | "Income" | "Transfer";

export interface TransactionCategoryRef {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: "expense" | "income";
}

export interface TransactionAccountRef {
  _id: string;
  name: string;
  type: "Bank" | "Credit Card" | "Wallet" | "Cash";
  currency: "USD" | "INR" | "EUR" | "GBP";
  color?: string;
  icon?: string;
  balance?: number;
}

export interface TransactionRecord {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: string;
  accountId: string | TransactionAccountRef;
  destinationAccountId?: string | TransactionAccountRef;
  categoryId?: string | TransactionCategoryRef;
  currency: "USD" | "INR" | "EUR" | "GBP";
  notes?: string;
  receiptUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionPayload = {
  title: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: string;
  accountId: string;
  destinationAccountId?: string;
  categoryId?: string;
  notes?: string;
  receiptUrl?: string;
};

export interface TransactionListResponseData {
  transactions: TransactionRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalInflow: number;
    totalOutflow: number;
    netCashflow: number;
    transferVolume: number;
  };
}

export type TransactionFilters = {
  page?: number;
  limit?: number;
  search?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  categoryId?: string;
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
};
