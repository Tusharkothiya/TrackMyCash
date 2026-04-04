import type { TransactionPayload } from "../types";

const transactionTypes = ["Expense", "Income", "Transfer"];
const transactionStatuses = ["Completed", "Pending", "Failed"];

export function validateTransactionPayload(payload: TransactionPayload): string | null {
  if (!payload.title || payload.title.trim().length < 2) {
    return "Transaction title must be at least 2 characters";
  }

  if (payload.title.trim().length > 150) {
    return "Transaction title must be less than 150 characters";
  }

  if (payload.amount === null || payload.amount === undefined || Number.isNaN(payload.amount)) {
    return "Transaction amount is required";
  }

  if (payload.amount <= 0) {
    return "Transaction amount must be greater than 0";
  }

  if (payload.amount > 999999999.99) {
    return "Transaction amount must be less than or equal to 999999999.99";
  }

  if (!transactionTypes.includes(payload.type)) {
    return "Transaction type must be Expense, Income, or Transfer";
  }

  if (!transactionStatuses.includes(payload.status)) {
    return "Transaction status must be Completed, Pending, or Failed";
  }

  if (!payload.transactionDate) {
    return "Transaction date is required";
  }

  const parsedDate = new Date(payload.transactionDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Transaction date must be a valid date";
  }

  if (!payload.accountId || payload.accountId.trim().length === 0) {
    return "Account is required";
  }

  if (payload.type === "Transfer") {
    if (!payload.destinationAccountId || payload.destinationAccountId.trim().length === 0) {
      return "Destination account is required for transfer";
    }

    if (payload.accountId === payload.destinationAccountId) {
      return "Source and destination account cannot be the same";
    }
  } else if (!payload.categoryId || payload.categoryId.trim().length === 0) {
    return "Category is required for Expense and Income transactions";
  }

  if (payload.notes && payload.notes.length > 1000) {
    return "Notes must be less than 1000 characters";
  }

  return null;
}
