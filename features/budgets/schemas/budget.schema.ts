import { BudgetPayload } from "../types";

export function validateBudgetPayload(payload: BudgetPayload): string | null {
  // Category ID validation
  if (!payload.categoryId || payload.categoryId.trim().length === 0) {
    return "Category is required";
  }

  // Budget Limit validation
  if (payload.budgetLimit === null || payload.budgetLimit === undefined || Number.isNaN(payload.budgetLimit)) {
    return "Budget limit is required";
  }

  if (payload.budgetLimit < 0) {
    return "Budget limit cannot be negative";
  }

  if (payload.budgetLimit > 999999999.99) {
    return "Budget limit cannot exceed maximum amount";
  }

  // Frequency validation
  const validFrequencies = ["Monthly", "Quarterly", "Yearly"];
  if (!validFrequencies.includes(payload.frequency)) {
    return "Frequency must be Monthly, Quarterly, or Yearly";
  }

  // Activation date validation
  if (!payload.activationDate) {
    return "Activation date is required";
  }

  const activationDate = new Date(payload.activationDate);
  if (isNaN(activationDate.getTime())) {
    return "Invalid activation date";
  }

  // Currency validation
  if (!payload.currency) {
    return "Currency is required";
  }

  const validCurrencies = ["USD", "INR", "EUR", "GBP"];
  if (!validCurrencies.includes(payload.currency)) {
    return "Currency must be USD, INR, EUR, or GBP";
  }

  return null;
}
