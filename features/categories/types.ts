export type CategoryIcon =
  | "layout-grid"
  | "receipt"
  | "wallet"
  | "bar-chart"
  | "settings"
  | "log-out"
  | "search"
  | "bell"
  | "plus-circle"
  | "edit"
  | "trash-2"
  | "sparkles"
  | "server"
  | "megaphone"
  | "briefcase"
  | "plane"
  | "banknote"
  | "lightbulb"
  | "more-horizontal"
  | "shopping-cart"
  | "home"
  | "activity"
  | "graduation-cap"
  | "clapperboard"
  | "piggy-bank"
  | "theater"
  | "paw-print"
  | "layers";

export interface Category {
  _id: string;
  userId: string;
  name: string;
  nameKey: string;
  icon: CategoryIcon;
  color: string;
  type: "expense" | "income";
  overline?: string;
  transactionCount?: number;
  amount?: number;
  createdAt: string;
  updatedAt: string;
}

export type CategoryPayload = {
  name: string;
  icon: CategoryIcon;
  color: string;
  type: "expense" | "income";
  overline?: string;
};
