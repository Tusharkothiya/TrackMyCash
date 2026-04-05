import { Types } from "mongoose";

import { jwtUtils } from "@/configs/jwt";
import { logger } from "@/lib/logger";
import Account from "@/models/Accounts.model";
import Budget from "@/models/Budgets.model";
import Category from "@/models/Categories.model";
import Transaction from "@/models/Transactions.model";
import User from "@/models/Users.model";

type ServiceResult = {
  flag: boolean;
  data?: unknown;
  status?: number;
};

type DashboardFilters = {
  days: number;
};

type TrendPoint = {
  month: string;
  income: number;
  expense: number;
};

const TOKEN_KEY = "_next_refresh_token_tmc_";
const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;
const MONTH_COLORS = ["#b4c5ff", "#33467e", "#ffb596", "#8d90a0", "#434655", "#6f7bb8"];

function getCookieValue(request: Request, key: string): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  if (!cookieHeader) return null;

  const chunks = cookieHeader.split(";");
  for (const chunk of chunks) {
    const [name, ...valueParts] = chunk.trim().split("=");
    if (name === key) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function getBearerToken(request: Request): string | null {
  const authorizationHeader = request.headers.get("authorization") || "";
  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim();
}

async function getAuthenticatedUser(request: Request): Promise<ServiceResult> {
  const token = getCookieValue(request, TOKEN_KEY) || getBearerToken(request);
  if (!token) {
    return {
      flag: false,
      data: "auth.invalidToken",
      status: 401,
    };
  }

  const decoded = jwtUtils.vJT(token);
  if (!decoded?.email) {
    return {
      flag: false,
      data: "auth.invalidToken",
      status: 401,
    };
  }

  const user = await User.findOne({
    email: String(decoded.email).trim().toLowerCase(),
  }).select("_id email");

  if (!user) {
    return {
      flag: false,
      data: "auth.accountNotFound",
      status: 404,
    };
  }

  return {
    flag: true,
    data: user,
  };
}

function clampDays(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, Math.max(1, Math.round(value)));
}

function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
}

function getMonthYearLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getPercentChange(current: number, previous: number): number {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeekMonday(date: Date): Date {
  const next = new Date(date);
  const day = next.getDay();
  const diff = (day + 6) % 7;
  next.setDate(next.getDate() - diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatSignedPercent(value: number): string {
  const rounded = Math.abs(value).toFixed(1);
  return `${value >= 0 ? "+" : "-"}${rounded}%`;
}

function getDayLabel(index: number): string {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] || "";
}

export const dashboardServices = {
  getOverview: async (request: Request): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) return auth;

      const user = auth.data as { _id: Types.ObjectId };
      const { searchParams } = new URL(request.url);
      const days = clampDays(Number(searchParams.get("days") || DEFAULT_DAYS));

      const now = new Date();
      const dateFrom = new Date(now);
      dateFrom.setDate(now.getDate() - (days - 1));
      dateFrom.setHours(0, 0, 0, 0);

      const currentMonthStart = startOfMonth(now);
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonthEnd = new Date(currentMonthStart.getTime() - 1);
      const chartStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const weekStart = startOfWeekMonday(now);

      const [accounts, monthRows, previousMonthRows, recentTransactions, monthlyChartRows, monthExpenseRows, weekRows, budgets] =
        await Promise.all([
          Account.find({ userId: user._id }).select("balance type").lean(),
          Transaction.aggregate([
            {
              $match: {
                userId: user._id,
                status: "Completed",
                type: { $in: ["Income", "Expense"] },
                transactionDate: {
                  $gte: currentMonthStart,
                  $lte: now,
                },
              },
            },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ]),
          Transaction.aggregate([
            {
              $match: {
                userId: user._id,
                status: "Completed",
                type: { $in: ["Income", "Expense"] },
                transactionDate: {
                  $gte: previousMonthStart,
                  $lte: previousMonthEnd,
                },
              },
            },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ]),
          Transaction.find({ userId: user._id })
            .populate({ path: "categoryId", select: "name color" })
            .select("title type amount transactionDate status categoryId")
            .sort({ transactionDate: -1, createdAt: -1 })
            .limit(5)
            .lean(),
          Transaction.aggregate([
            {
              $match: {
                userId: user._id,
                status: "Completed",
                type: { $in: ["Income", "Expense"] },
                transactionDate: {
                  $gte: chartStart,
                  $lte: now,
                },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$transactionDate" },
                  month: { $month: "$transactionDate" },
                  type: "$type",
                },
                total: { $sum: "$amount" },
              },
            },
          ]),
          Transaction.aggregate([
            {
              $match: {
                userId: user._id,
                status: "Completed",
                type: "Expense",
                transactionDate: {
                  $gte: currentMonthStart,
                  $lte: now,
                },
              },
            },
            {
              $group: {
                _id: "$categoryId",
                total: { $sum: "$amount" },
              },
            },
            {
              $lookup: {
                from: Category.collection.name,
                localField: "_id",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                total: 1,
                categoryName: "$category.name",
                categoryColor: "$category.color",
              },
            },
            { $sort: { total: -1 } },
          ]),
          Transaction.aggregate([
            {
              $match: {
                userId: user._id,
                status: "Completed",
                type: { $in: ["Income", "Expense"] },
                transactionDate: {
                  $gte: weekStart,
                  $lte: now,
                },
              },
            },
            {
              $group: {
                _id: {
                  dayOfWeek: { $dayOfWeek: "$transactionDate" },
                  type: "$type",
                },
                total: { $sum: "$amount" },
              },
            },
          ]),
          Budget.find({ userId: user._id })
            .populate({ path: "categoryId", select: "name color type" })
            .select("budgetLimit categoryId")
            .lean(),
        ]);

      const connectedAccounts = accounts.length;
      const totalBalance = accounts.reduce((total, account: any) => {
        if (account.type === "Credit Card") {
          return total - Number(account.balance || 0);
        }

        return total + Number(account.balance || 0);
      }, 0);

      const monthIncome = Number(monthRows.find((row) => row._id === "Income")?.total || 0);
      const monthExpense = Number(monthRows.find((row) => row._id === "Expense")?.total || 0);
      const previousMonthIncome = Number(
        previousMonthRows.find((row) => row._id === "Income")?.total || 0,
      );
      const previousMonthExpense = Number(
        previousMonthRows.find((row) => row._id === "Expense")?.total || 0,
      );

      const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome) * 100 : 0;
      const previousSavingsRate =
        previousMonthIncome > 0
          ? ((previousMonthIncome - previousMonthExpense) / previousMonthIncome) * 100
          : 0;

      const incomeChange = getPercentChange(monthIncome, previousMonthIncome);
      const expenseChange = getPercentChange(monthExpense, previousMonthExpense);
      const savingsRateChange = savingsRate - previousSavingsRate;

      const chartIndex = new Map<string, TrendPoint>();
      const cashflowTrend: TrendPoint[] = [];
      for (let offset = 5; offset >= 0; offset -= 1) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        const key = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
        const point: TrendPoint = {
          month: getMonthLabel(monthDate),
          income: 0,
          expense: 0,
        };
        chartIndex.set(key, point);
        cashflowTrend.push(point);
      }

      monthlyChartRows.forEach((row: any) => {
        const key = `${row._id.year}-${row._id.month}`;
        const point = chartIndex.get(key);
        if (!point) return;

        if (row._id.type === "Income") {
          point.income = Number(row.total || 0);
        }
        if (row._id.type === "Expense") {
          point.expense = Number(row.total || 0);
        }
      });

      const expenseBreakdownTotal = monthExpenseRows.reduce(
        (total: number, row: any) => total + Number(row.total || 0),
        0,
      );

      const expenseBreakdown = monthExpenseRows.slice(0, 5).map((row: any, index: number) => {
        const amount = Number(row.total || 0);
        const value = expenseBreakdownTotal > 0 ? (amount / expenseBreakdownTotal) * 100 : 0;

        return {
          name: String(row.categoryName || "Other"),
          value: Math.round(value),
          color: String(row.categoryColor || MONTH_COLORS[index % MONTH_COLORS.length]),
          amount,
          categoryId: row._id ? String(row._id) : null,
        };
      });

      const expenseByCategoryId = new Map<string, number>();
      monthExpenseRows.forEach((row: any) => {
        if (!row._id) return;
        expenseByCategoryId.set(String(row._id), Number(row.total || 0));
      });

      const topSpendingCategories = budgets
        .map((budget: any, index: number) => {
          const category = budget.categoryId;
          if (!category || category.type !== "expense") {
            return null;
          }

          const categoryId = String(category._id);
          const spent = Number(expenseByCategoryId.get(categoryId) || 0);
          const limit = Number(budget.budgetLimit || 0);

          return {
            id: categoryId,
            name: String(category.name || "Category"),
            spent,
            limit,
            color: String(category.color || MONTH_COLORS[index % MONTH_COLORS.length]),
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.spent - a.spent)
        .slice(0, 4);

      const weeklyNetMovement = Array.from({ length: 7 }, (_, index) => ({
        day: getDayLabel(index),
        value: 0,
      }));

      weekRows.forEach((row: any) => {
        const dayOfWeek = Number(row._id.dayOfWeek);
        const dayIndex = dayOfWeek === 1 ? 6 : dayOfWeek - 2;
        if (dayIndex < 0 || dayIndex > 6) return;

        const total = Number(row.total || 0);
        if (row._id.type === "Income") {
          weeklyNetMovement[dayIndex].value += total;
        } else if (row._id.type === "Expense") {
          weeklyNetMovement[dayIndex].value -= total;
        }
      });

      const recent = recentTransactions.map((transaction: any) => {
        const category = transaction.categoryId;

        return {
          id: String(transaction._id),
          title: String(transaction.title || "Transaction"),
          category: String(category?.name || (transaction.type === "Transfer" ? "Transfer" : "Unknown")),
          date: new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(transaction.transactionDate)),
          amount: Number(transaction.amount || 0),
          type: transaction.type,
          status: transaction.status,
          categoryColor: String(category?.color || "#b4c5ff"),
        };
      });

      const monthlyBudgetLimit = topSpendingCategories.reduce(
        (total: number, item: any) => total + Number(item.limit || 0),
        0,
      );
      const expenseBudgetUsage =
        monthlyBudgetLimit > 0 ? Math.min(100, (monthExpense / monthlyBudgetLimit) * 100) : 0;

      const topCategory = topSpendingCategories[0] as any;
      const insight = topCategory
        ? `${topCategory.name} has the highest spend this month at ${topCategory.spent.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}.`
        : "No major spending trend detected yet for this month.";

      return {
        flag: true,
        data: {
          summary: {
            periodLabel: `Overview for ${getMonthYearLabel(now)}`,
            totalBalance,
            connectedAccounts,
            monthlyIncome: monthIncome,
            monthlyExpense: monthExpense,
            monthlyIncomeChange: incomeChange,
            monthlyExpenseChange: expenseChange,
            savingsRate,
            savingsRateChange,
            expenseBudgetUsage,
          },
          charts: {
            cashflowTrend,
            expenseBreakdown,
            weeklyNetMovement,
          },
          recentTransactions: recent,
          topSpendingCategories,
          insight,
          filters: {
            days,
            dateFrom: dateFrom.toISOString(),
            dateTo: now.toISOString(),
          },
          meta: {
            incomeChangeLabel: formatSignedPercent(incomeChange),
            expenseChangeLabel: formatSignedPercent(expenseChange),
            savingsChangeLabel: formatSignedPercent(savingsRateChange),
          },
        },
      };
    } catch (error) {
      logger.error("Error fetching dashboard overview:", error);
      return {
        flag: false,
        data: "dashboard.fetchError",
        status: 500,
      };
    }
  },
};
