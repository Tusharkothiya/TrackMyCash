import { AccountPayload } from "../types";

export function validateAccountPayload(payload: AccountPayload): string | null {
  // Name validation
  if (!payload.name || payload.name.trim().length === 0) {
    return "Account name is required";
  }
  if (payload.name.trim().length < 2) {
    return "Account name must be at least 2 characters";
  }
  if (payload.name.length > 100) {
    return "Account name must be less than 100 characters";
  }

  // Type validation
  const validTypes = ["Bank", "Credit Card", "Wallet", "Cash"];
  if (!validTypes.includes(payload.type)) {
    return "Account type must be Bank, Credit Card, Wallet, or Cash";
  }

  // Currency validation
  const validCurrencies = ["USD", "INR", "EUR", "GBP"];
  if (!validCurrencies.includes(payload.currency)) {
    return "Currency must be USD, INR, EUR, or GBP";
  }

  // Balance validation
  if (typeof payload.balance !== "number") {
    return "Balance must be a number";
  }

  // Color validation (hex color)
  const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (!hexColorRegex.test(payload.color)) {
    return "Color must be a valid hex code";
  }

  // Icon validation
  const validIcons = ["bank", "credit_card", "wallet", "cash"];
  if (!validIcons.includes(payload.icon)) {
    return "Invalid account icon";
  }

  return null;
}
