export type DashboardStat = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
};

export type TransactionItem = {
  id: string;
  title: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  status: "completed" | "pending";
  account: string;
  note: string;
};

export type ReportItem = {
  id: string;
  title: string;
  period: string;
  revenue: number;
  expense: number;
  net: number;
  updatedAt: string;
};

export type BudgetItem = {
  id: string;
  category: string;
  limit: number;
  spent: number;
};

export const dashboardStats: DashboardStat[] = [
  { label: "Total Balance", value: "$24,560", change: "+8.2%", positive: true },
  { label: "Monthly Income", value: "$8,420", change: "+4.1%", positive: true },
  { label: "Monthly Expense", value: "$4,980", change: "-2.4%", positive: true },
  { label: "Savings Rate", value: "41%", change: "-1.3%", positive: false },
];

export const transactions: TransactionItem[] = [
  {
    id: "txn-1001",
    title: "Salary Credit",
    category: "Income",
    type: "income",
    amount: 5200,
    date: "2026-03-01",
    status: "completed",
    account: "Primary Account",
    note: "Monthly company payroll",
  },
  {
    id: "txn-1002",
    title: "AWS Cloud Billing",
    category: "Infrastructure",
    type: "expense",
    amount: 320,
    date: "2026-03-02",
    status: "completed",
    account: "Business Card",
    note: "Production hosting resources",
  },
  {
    id: "txn-1003",
    title: "Client Retainer",
    category: "Consulting",
    type: "income",
    amount: 1800,
    date: "2026-03-05",
    status: "pending",
    account: "Primary Account",
    note: "Payment expected in 2 days",
  },
  {
    id: "txn-1004",
    title: "Office Rent",
    category: "Operations",
    type: "expense",
    amount: 900,
    date: "2026-03-06",
    status: "completed",
    account: "Business Card",
    note: "March office rent",
  },
  {
    id: "txn-1005",
    title: "Travel Reimbursement",
    category: "Travel",
    type: "income",
    amount: 460,
    date: "2026-03-08",
    status: "completed",
    account: "Primary Account",
    note: "Team conference refund",
  },
];

export const reports: ReportItem[] = [
  {
    id: "rep-q1",
    title: "Quarterly Financial Summary",
    period: "Q1 2026",
    revenue: 24800,
    expense: 14220,
    net: 10580,
    updatedAt: "2026-03-10",
  },
  {
    id: "rep-feb",
    title: "Monthly Performance Report",
    period: "February 2026",
    revenue: 8420,
    expense: 4980,
    net: 3440,
    updatedAt: "2026-03-03",
  },
  {
    id: "rep-ops",
    title: "Operational Spend Breakdown",
    period: "Mar 1 - Mar 10",
    revenue: 3200,
    expense: 2210,
    net: 990,
    updatedAt: "2026-03-10",
  },
];

export const budgets: BudgetItem[] = [
  { id: "bud-1", category: "Infrastructure", limit: 1500, spent: 940 },
  { id: "bud-2", category: "Marketing", limit: 2200, spent: 1460 },
  { id: "bud-3", category: "Operations", limit: 1800, spent: 1240 },
  { id: "bud-4", category: "Travel", limit: 900, spent: 720 },
];

export const activities = [
  "Generated new Q1 performance report",
  "Processed 4 successful payouts",
  "Detected 2 pending invoice reminders",
  "Updated budget allocation for operations",
];

export const monthlyCashflowData = [
  { month: "Jan", income: 6200, expense: 4100 },
  { month: "Feb", income: 8420, expense: 4980 },
  { month: "Mar", income: 7800, expense: 4620 },
  { month: "Apr", income: 9050, expense: 5340 },
  { month: "May", income: 8600, expense: 5120 },
  { month: "Jun", income: 9400, expense: 5660 },
];

export const weeklyNetData = [
  { week: "W1", net: 1120 },
  { week: "W2", net: 840 },
  { week: "W3", net: 1320 },
  { week: "W4", net: 980 },
  { week: "W5", net: 1450 },
];

export const expenseBreakdownData = [
  { name: "Infrastructure", value: 28 },
  { name: "Operations", value: 24 },
  { name: "Marketing", value: 21 },
  { name: "Travel", value: 15 },
  { name: "Other", value: 12 },
];

export function getTransactionById(id: string): TransactionItem | undefined {
  return transactions.find((item) => item.id === id);
}

export function getReportById(id: string): ReportItem | undefined {
  return reports.find((item) => item.id === id);
}
