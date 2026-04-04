export type AccountIcon = "bank" | "credit_card" | "wallet" | "cash";
export type AccountType = "Bank" | "Credit Card" | "Wallet" | "Cash";
export type Currency = "USD" | "INR" | "EUR" | "GBP";

export interface Account {
  _id: string;
  userId?: string;
  name: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  color: string;
  icon: AccountIcon;
  createdAt?: string;
  updatedAt?: string;
}

export type AccountPayload = {
  name: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  color: string;
  icon: AccountIcon;
};
