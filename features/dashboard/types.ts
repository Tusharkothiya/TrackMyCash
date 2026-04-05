export type DashboardSummary = {
  periodLabel: string;
  totalBalance: number;
  connectedAccounts: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyIncomeChange: number;
  monthlyExpenseChange: number;
  savingsRate: number;
  savingsRateChange: number;
  expenseBudgetUsage: number;
};

export type DashboardCashflowPoint = {
  month: string;
  income: number;
  expense: number;
};

export type DashboardExpenseBreakdownItem = {
  name: string;
  value: number;
  color: string;
  amount: number;
  categoryId?: string | null;
};

export type DashboardWeeklyNetItem = {
  day: string;
  value: number;
};

export type DashboardRecentTransaction = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "Income" | "Expense" | "Transfer";
  status: "Completed" | "Pending" | "Failed";
  categoryColor: string;
};

export type DashboardTopSpendingCategory = {
  id: string;
  name: string;
  spent: number;
  limit: number;
  color: string;
};

export type DashboardOverview = {
  summary: DashboardSummary;
  charts: {
    cashflowTrend: DashboardCashflowPoint[];
    expenseBreakdown: DashboardExpenseBreakdownItem[];
    weeklyNetMovement: DashboardWeeklyNetItem[];
  };
  recentTransactions: DashboardRecentTransaction[];
  topSpendingCategories: DashboardTopSpendingCategory[];
  insight: string;
  filters: {
    days: number;
    dateFrom: string;
    dateTo: string;
  };
  meta: {
    incomeChangeLabel: string;
    expenseChangeLabel: string;
    savingsChangeLabel: string;
  };
};
