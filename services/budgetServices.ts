import { jwtUtils } from "@/configs/jwt";
import { logger } from "@/lib/logger";
import Budget from "@/models/Budgets.model";
import Category from "@/models/Categories.model";
import Transaction from "@/models/Transactions.model";
import User from "@/models/Users.model";
import { Types } from "mongoose";

type ServiceResult = {
  flag: boolean;
  data?: unknown;
  status?: number;
};

type BudgetPayload = {
  categoryId: string;
  budgetLimit: number;
  frequency: "Monthly" | "Quarterly" | "Yearly";
  activationDate: Date | string;
  currency?: "USD" | "INR" | "EUR" | "GBP";
};

type BudgetWithCategory = {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  categoryId:
    | Types.ObjectId
    | {
        _id: Types.ObjectId;
        type?: "expense" | "income";
      };
  budgetLimit: number;
  frequency: "Monthly" | "Quarterly" | "Yearly";
  activationDate: Date;
  currency: "USD" | "INR" | "EUR" | "GBP";
  createdAt?: Date;
  updatedAt?: Date;
};

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

const TOKEN_KEY = "_next_refresh_token_tmc_";

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

function getBudgetWindow(
  frequency: "Monthly" | "Quarterly" | "Yearly",
  activationDate: Date,
): { from: Date; to: Date } {
  const now = new Date();
  const to = new Date(now.getTime());

  let from: Date;
  if (frequency === "Monthly") {
    from = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (frequency === "Quarterly") {
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    from = new Date(now.getFullYear(), quarterStartMonth, 1);
  } else {
    from = new Date(now.getFullYear(), 0, 1);
  }

  const normalizedActivationDate = new Date(activationDate);
  if (!Number.isNaN(normalizedActivationDate.getTime()) && normalizedActivationDate > from) {
    from = normalizedActivationDate;
  }

  return { from, to };
}

function resolveCategoryObject(
  category: BudgetWithCategory["categoryId"],
): { _id: Types.ObjectId; type?: "expense" | "income" } | null {
  if (!category) return null;

  if (category instanceof Types.ObjectId) {
    return { _id: category };
  }

  if (typeof category === "object" && "_id" in category) {
    return {
      _id: category._id,
      type: category.type,
    };
  }

  return null;
}

async function attachSpentAmount(
  userId: Types.ObjectId,
  budget: BudgetWithCategory,
): Promise<BudgetWithCategory & { spentAmount: number }> {
  const category = resolveCategoryObject(budget.categoryId);
  if (!category?._id) {
    return {
      ...budget,
      spentAmount: 0,
    };
  }

  const transactionType = category.type === "income" ? "Income" : "Expense";
  const window = getBudgetWindow(budget.frequency, new Date(budget.activationDate));

  const [summary] = await Transaction.aggregate([
    {
      $match: {
        userId,
        categoryId: category._id,
        type: transactionType,
        status: "Completed",
        transactionDate: {
          $gte: window.from,
          $lte: window.to,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return {
    ...budget,
    spentAmount: Number(summary?.total || 0),
  };
}

export const budgetServices = {
  getBudgets: async (request: Request): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      const budgets = (await Budget.find({ userId: user._id })
        .populate({
          path: "categoryId",
          select: "name icon color type",
        })
        .select("-userId")
        .sort({ activationDate: -1 })
        .lean()) as BudgetWithCategory[];

      const budgetsWithSpentAmount = await Promise.all(
        budgets.map((budget) => attachSpentAmount(user._id, budget)),
      );

      return {
        flag: true,
        data: budgetsWithSpentAmount,
      };
    } catch (error) {
      logger.error("Error fetching budgets:", error);
      return {
        flag: false,
        data: "budget.fetchError",
        status: 500,
      };
    }
  },

  getBudgetById: async (request: Request, budgetId: string): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      if (!Types.ObjectId.isValid(budgetId)) {
        return {
          flag: false,
          data: "budget.invalidId",
          status: 400,
        };
      }

      const budget = (await Budget.findOne({
        _id: new Types.ObjectId(budgetId),
        userId: user._id,
      })
        .populate({
          path: "categoryId",
          select: "name icon color type",
        })
        .select("-userId")
        .lean()) as BudgetWithCategory | null;

      if (!budget) {
        return {
          flag: false,
          data: "budget.notFound",
          status: 404,
        };
      }

      const budgetWithSpentAmount = await attachSpentAmount(user._id, budget);

      return {
        flag: true,
        data: budgetWithSpentAmount,
      };
    } catch (error) {
      logger.error("Error fetching budget:", error);
      return {
        flag: false,
        data: "budget.fetchError",
        status: 500,
      };
    }
  },

  createBudget: async (request: Request, payload: BudgetPayload): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      // Validate category exists and belongs to user
      if (!Types.ObjectId.isValid(payload.categoryId)) {
        return {
          flag: false,
          data: "budget.invalidCategoryId",
          status: 400,
        };
      }

      const category = await Category.findOne({
        _id: new Types.ObjectId(payload.categoryId),
        userId: user._id,
      }).select("_id");

      if (!category) {
        return {
          flag: false,
          data: "budget.categoryNotFound",
          status: 404,
        };
      }

      // Check for duplicate budget
      const exists = await Budget.findOne({
        userId: user._id,
        categoryId: payload.categoryId,
        frequency: payload.frequency,
      });

      if (exists) {
        return {
          flag: false,
          data: "budget.alreadyExists",
          status: 409,
        };
      }

      const newBudget = new Budget({
        userId: user._id,
        categoryId: new Types.ObjectId(payload.categoryId),
        budgetLimit: payload.budgetLimit,
        frequency: payload.frequency,
        activationDate: new Date(payload.activationDate),
        currency: payload.currency || "USD",
      });

      const savedBudget = await newBudget.save();
      const populatedBudget = await savedBudget.populate({
        path: "categoryId",
        select: "name icon color type",
      });

      const budgetData = populatedBudget.toObject();
      delete budgetData.userId;

      return {
        flag: true,
        data: budgetData,
      };
    } catch (error) {
      logger.error("Error creating budget:", error);
      return {
        flag: false,
        data: "budget.createError",
        status: 500,
      };
    }
  },

  updateBudget: async (
    request: Request,
    budgetId: string,
    payload: Partial<BudgetPayload>
  ): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      if (!Types.ObjectId.isValid(budgetId)) {
        return {
          flag: false,
          data: "budget.invalidId",
          status: 400,
        };
      }

      const budget = await Budget.findOne({
        _id: new Types.ObjectId(budgetId),
        userId: user._id,
      });

      if (!budget) {
        return {
          flag: false,
          data: "budget.notFound",
          status: 404,
        };
      }

      // If updating category, validate it exists
      if (payload.categoryId) {
        if (!Types.ObjectId.isValid(payload.categoryId)) {
          return {
            flag: false,
            data: "budget.invalidCategoryId",
            status: 400,
          };
        }

        const category = await Category.findOne({
          _id: new Types.ObjectId(payload.categoryId),
          userId: user._id,
        }).select("_id");

        if (!category) {
          return {
            flag: false,
            data: "budget.categoryNotFound",
            status: 404,
          };
        }

        // Check for duplicate with new category and frequency
        const duplicate = await Budget.findOne({
          userId: user._id,
          categoryId: new Types.ObjectId(payload.categoryId),
          frequency: payload.frequency || budget.frequency,
          _id: { $ne: new Types.ObjectId(budgetId) },
        });

        if (duplicate) {
          return {
            flag: false,
            data: "budget.alreadyExists",
            status: 409,
          };
        }

        budget.categoryId = new Types.ObjectId(payload.categoryId);
      }

      // Update other fields
      if (payload.budgetLimit !== undefined) budget.budgetLimit = payload.budgetLimit;
      if (payload.frequency) budget.frequency = payload.frequency;
      if (payload.activationDate) budget.activationDate = new Date(payload.activationDate);
      if (payload.currency) budget.currency = payload.currency;

      const updatedBudget = await budget.save();
      const populatedBudget = await updatedBudget.populate({
        path: "categoryId",
        select: "name icon color type",
      });

      const budgetData = populatedBudget.toObject();
      delete budgetData.userId;

      return {
        flag: true,
        data: budgetData,
      };
    } catch (error) {
      logger.error("Error updating budget:", error);
      return {
        flag: false,
        data: "budget.updateError",
        status: 500,
      };
    }
  },

  deleteBudget: async (request: Request, budgetId: string): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      if (!Types.ObjectId.isValid(budgetId)) {
        return {
          flag: false,
          data: "budget.invalidId",
          status: 400,
        };
      }

      const result = await Budget.findOneAndDelete({
        _id: new Types.ObjectId(budgetId),
        userId: user._id,
      });

      if (!result) {
        return {
          flag: false,
          data: "budget.notFound",
          status: 404,
        };
      }

      return {
        flag: true,
        data: { _id: result._id },
      };
    } catch (error) {
      logger.error("Error deleting budget:", error);
      return {
        flag: false,
        data: "budget.deleteError",
        status: 500,
      };
    }
  },
};
