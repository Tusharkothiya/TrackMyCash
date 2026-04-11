import mongoose, { Types } from "mongoose";

import { jwtUtils } from "@/configs/jwt";
import { logger } from "@/lib/logger";
import Account from "@/models/Accounts.model";
import Category from "@/models/Categories.model";
import Transaction from "@/models/Transactions.model";
import User from "@/models/Users.model";
import { transactionEmailService } from "@/services/transactionEmailService";

type ServiceResult = {
  flag: boolean;
  data?: unknown;
  status?: number;
};

type TransactionType = "Expense" | "Income" | "Transfer";
type TransactionStatus = "Completed" | "Pending" | "Failed";

type TransactionPayload = {
  title: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: Date | string;
  accountId: string;
  destinationAccountId?: string | null;
  categoryId?: string | null;
  notes?: string | null;
  receiptUrl?: string | null;
};

type TransactionFilters = {
  search?: string | null;
  type?: TransactionType | null;
  status?: TransactionStatus | null;
  accountId?: string | null;
  categoryId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  page?: number;
  limit?: number;
};

const TOKEN_KEY = "_next_refresh_token_tmc_";
const MIN_BALANCE = -999999999.99;
const MAX_BALANCE = 999999999.99;

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

function ensureObjectId(id: string | null | undefined, key: string): ServiceResult | null {
  if (!id || !Types.ObjectId.isValid(id)) {
    return {
      flag: false,
      data: key,
      status: 400,
    };
  }

  return null;
}

function assertBalanceInRange(balance: number): ServiceResult | null {
  if (balance < MIN_BALANCE || balance > MAX_BALANCE) {
    return {
      flag: false,
      data: "transaction.balanceOutOfRange",
      status: 400,
    };
  }

  return null;
}

function applyBalanceEffect(
  account: { balance: number },
  destinationAccount: { balance: number } | null,
  type: TransactionType,
  amount: number,
  direction: 1 | -1,
): ServiceResult | null {
  if (type === "Income") {
    account.balance += direction * amount;
    return assertBalanceInRange(account.balance);
  }

  if (type === "Expense") {
    if (direction === 1 && account.balance < amount) {
      return {
        flag: false,
        data: "transaction.insufficientBalance",
        status: 400,
      };
    }

    account.balance -= direction * amount;
    return assertBalanceInRange(account.balance);
  }

  if (!destinationAccount) {
    return {
      flag: false,
      data: "transaction.destinationAccountRequired",
      status: 400,
    };
  }

  if (direction === 1 && account.balance < amount) {
    return {
      flag: false,
      data: "transaction.insufficientBalance",
      status: 400,
    };
  }

  account.balance -= direction * amount;
  const sourceRangeError = assertBalanceInRange(account.balance);
  if (sourceRangeError) {
    return sourceRangeError;
  }

  destinationAccount.balance += direction * amount;
  return assertBalanceInRange(destinationAccount.balance);
}

function normalizePayload(payload: TransactionPayload): TransactionPayload {
  return {
    ...payload,
    title: payload.title.trim(),
    notes: payload.notes?.trim() || undefined,
    receiptUrl: payload.receiptUrl?.trim() || undefined,
  };
}

async function validateCategoryForType(
  userId: Types.ObjectId,
  categoryId: string | null | undefined,
  type: TransactionType,
  session: mongoose.ClientSession,
): Promise<ServiceResult | { _id: Types.ObjectId } | null> {
  if (type === "Transfer") {
    if (categoryId) {
      return {
        flag: false,
        data: "transaction.categoryNotAllowedForTransfer",
        status: 400,
      };
    }

    return null;
  }

  if (!categoryId) {
    return {
      flag: false,
      data: "transaction.categoryRequired",
      status: 400,
    };
  }

  const categoryValidationError = ensureObjectId(categoryId, "transaction.invalidCategoryId");
  if (categoryValidationError) {
    return categoryValidationError;
  }

  const category = await Category.findOne({
    _id: new Types.ObjectId(categoryId),
    userId,
  })
    .select("_id type")
    .session(session);

  if (!category) {
    return {
      flag: false,
      data: "transaction.categoryNotFound",
      status: 404,
    };
  }

  if (type === "Expense" && category.type !== "expense") {
    return {
      flag: false,
      data: "transaction.categoryTypeMismatch",
      status: 400,
    };
  }

  if (type === "Income" && category.type !== "income") {
    return {
      flag: false,
      data: "transaction.categoryTypeMismatch",
      status: 400,
    };
  }

  return category;
}

function toPositiveNumber(value: number): number {
  return Math.abs(Number(value || 0));
}

function ensureSufficientBalance(
  balance: number,
  amount: number,
): ServiceResult | null {
  if (!Number.isFinite(balance)) {
    return {
      flag: false,
      data: "transaction.insufficientBalance",
      status: 400,
    };
  }

  if (amount > balance) {
    return {
      flag: false,
      data: "transaction.insufficientBalance",
      status: 400,
    };
  }

  return null;
}

export const transactionServices = {
  getTransactions: async (request: Request): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };
      const { searchParams } = new URL(request.url);

      const page = Math.max(1, Number(searchParams.get("page") || 1));
      const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));

      const filters: TransactionFilters = {
        search: searchParams.get("search"),
        type: (searchParams.get("type") as TransactionType | null) || null,
        status: (searchParams.get("status") as TransactionStatus | null) || null,
        accountId: searchParams.get("accountId"),
        categoryId: searchParams.get("categoryId"),
        dateFrom: searchParams.get("dateFrom"),
        dateTo: searchParams.get("dateTo"),
        page,
        limit,
      };

      const query: Record<string, any> = {
        userId: user._id,
      };

      if (filters.search) {
        query.title = { $regex: filters.search.trim(), $options: "i" };
      }

      if (filters.type && ["Expense", "Income", "Transfer"].includes(filters.type)) {
        query.type = filters.type;
      }

      if (filters.status && ["Completed", "Pending", "Failed"].includes(filters.status)) {
        query.status = filters.status;
      }

      if (filters.accountId) {
        const validationError = ensureObjectId(filters.accountId, "transaction.invalidAccountId");
        if (validationError) {
          return validationError;
        }

        query.$or = [
          { accountId: new Types.ObjectId(filters.accountId) },
          { destinationAccountId: new Types.ObjectId(filters.accountId) },
        ];
      }

      if (filters.categoryId) {
        const validationError = ensureObjectId(filters.categoryId, "transaction.invalidCategoryId");
        if (validationError) {
          return validationError;
        }

        query.categoryId = new Types.ObjectId(filters.categoryId);
      }

      if (filters.dateFrom || filters.dateTo) {
        query.transactionDate = {};

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (Number.isNaN(fromDate.getTime())) {
            return {
              flag: false,
              data: "transaction.invalidDateFilter",
              status: 400,
            };
          }
          fromDate.setHours(0, 0, 0, 0);
          query.transactionDate.$gte = fromDate;
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (Number.isNaN(toDate.getTime())) {
            return {
              flag: false,
              data: "transaction.invalidDateFilter",
              status: 400,
            };
          }
          toDate.setHours(23, 59, 59, 999);
          query.transactionDate.$lte = toDate;
        }
      }

      const [items, total] = await Promise.all([
        Transaction.find(query)
          .populate({ path: "accountId", select: "name type currency color icon" })
          .populate({ path: "destinationAccountId", select: "name type currency color icon" })
          .populate({ path: "categoryId", select: "name icon color type" })
          .select("-userId")
          .sort({ transactionDate: -1, createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Transaction.countDocuments(query),
      ]);

      const summaryRows = await Transaction.aggregate([
        { $match: { ...query, status: "Completed" } },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]);

      const totals = {
        income: 0,
        expense: 0,
        transfer: 0,
      };

      summaryRows.forEach((row) => {
        if (row._id === "Income") totals.income = row.total;
        if (row._id === "Expense") totals.expense = row.total;
        if (row._id === "Transfer") totals.transfer = row.total;
      });

      return {
        flag: true,
        data: {
          transactions: items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
          },
          summary: {
            totalInflow: totals.income,
            totalOutflow: totals.expense,
            netCashflow: totals.income - totals.expense,
            transferVolume: totals.transfer,
          },
        },
      };
    } catch (error) {
      logger.error("Error fetching transactions:", error);
      return {
        flag: false,
        data: "transaction.fetchError",
        status: 500,
      };
    }
  },

  getTransactionById: async (request: Request, transactionId: string): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };
      const idValidationError = ensureObjectId(transactionId, "transaction.invalidId");
      if (idValidationError) {
        return idValidationError;
      }

      const transaction = await Transaction.findOne({
        _id: new Types.ObjectId(transactionId),
        userId: user._id,
      })
        .populate({ path: "accountId", select: "name type currency color icon balance" })
        .populate({ path: "destinationAccountId", select: "name type currency color icon balance" })
        .populate({ path: "categoryId", select: "name icon color type" })
        .select("-userId")
        .lean();

      if (!transaction) {
        return {
          flag: false,
          data: "transaction.notFound",
          status: 404,
        };
      }

      return {
        flag: true,
        data: transaction,
      };
    } catch (error) {
      logger.error("Error fetching transaction:", error);
      return {
        flag: false,
        data: "transaction.fetchError",
        status: 500,
      };
    }
  },

  createTransaction: async (request: Request, payload: TransactionPayload): Promise<ServiceResult> => {
    const session = await mongoose.startSession();

    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };
      const nextPayload = normalizePayload(payload);

      const accountValidationError = ensureObjectId(nextPayload.accountId, "transaction.invalidAccountId");
      if (accountValidationError) {
        return accountValidationError;
      }

      if (nextPayload.destinationAccountId) {
        const destinationValidationError = ensureObjectId(
          nextPayload.destinationAccountId,
          "transaction.invalidDestinationAccountId",
        );
        if (destinationValidationError) {
          return destinationValidationError;
        }
      }

      if (
        nextPayload.type === "Transfer" &&
        nextPayload.accountId === nextPayload.destinationAccountId
      ) {
        return {
          flag: false,
          data: "transaction.sameTransferAccount",
          status: 400,
        };
      }

      const operation = await session.withTransaction(async () => {
        const account = await Account.findOne({
          _id: new Types.ObjectId(nextPayload.accountId),
          userId: user._id,
        }).session(session);

        if (!account) {
          return {
            flag: false,
            data: "transaction.accountNotFound",
            status: 404,
          } as ServiceResult;
        }

        let destinationAccount: any = null;
        if (nextPayload.destinationAccountId) {
          destinationAccount = await Account.findOne({
            _id: new Types.ObjectId(nextPayload.destinationAccountId),
            userId: user._id,
          }).session(session);

          if (!destinationAccount) {
            return {
              flag: false,
              data: "transaction.destinationAccountNotFound",
              status: 404,
            } as ServiceResult;
          }

          if (account.currency !== destinationAccount.currency) {
            return {
              flag: false,
              data: "transaction.currencyMismatch",
              status: 400,
            } as ServiceResult;
          }
        }

        const categoryValidation = await validateCategoryForType(
          user._id,
          nextPayload.categoryId,
          nextPayload.type,
          session,
        );

        if (categoryValidation && (categoryValidation as ServiceResult).flag === false) {
          return categoryValidation as ServiceResult;
        }

        const amount = toPositiveNumber(nextPayload.amount);

        if (nextPayload.type === "Expense" || nextPayload.type === "Transfer") {
          const balanceError = ensureSufficientBalance(Number(account.balance), amount);
          if (balanceError) {
            return balanceError;
          }
        }

        if (nextPayload.status === "Completed") {
          const balanceResult = applyBalanceEffect(
            account,
            destinationAccount,
            nextPayload.type,
            amount,
            1,
          );

          if (balanceResult) {
            return balanceResult;
          }

          await account.save({ session });
          if (destinationAccount) {
            await destinationAccount.save({ session });
          }
        }

        const createdTransaction = await Transaction.create(
          [
            {
              userId: user._id,
              title: nextPayload.title,
              amount,
              type: nextPayload.type,
              status: nextPayload.status,
              transactionDate: new Date(nextPayload.transactionDate),
              accountId: account._id,
              destinationAccountId:
                nextPayload.type === "Transfer" && destinationAccount
                  ? destinationAccount._id
                  : undefined,
              categoryId:
                nextPayload.type !== "Transfer" && nextPayload.categoryId
                  ? new Types.ObjectId(nextPayload.categoryId)
                  : undefined,
              currency: account.currency,
              notes: nextPayload.notes,
              receiptUrl: nextPayload.receiptUrl,
            },
          ],
          { session },
        );

        const populated = await Transaction.findById(createdTransaction[0]._id)
          .populate({ path: "accountId", select: "name type currency color icon" })
          .populate({ path: "destinationAccountId", select: "name type currency color icon" })
          .populate({ path: "categoryId", select: "name icon color type" })
          .select("-userId")
          .session(session)
          .lean();

        return {
          flag: true,
          data: populated,
        } as ServiceResult;
      });

      if (operation?.flag) {
        // Queue email task after successful transaction creation
        const userDoc = await User.findById(user._id).select("email fullName");
        if (userDoc?.email) {
          const transactionData = operation.data as any;
          const populatedAccount = transactionData.accountId;
          const category = transactionData.categoryId;

          await transactionEmailService.createEmailTask({
            userId: user._id,
            transactionId: new Types.ObjectId(transactionData._id),
            recipientEmail: userDoc.email,
            type: "TRANSACTION_CREATED",
            data: {
              type: "CREATED",
              fullName: userDoc.fullName || "User",
              transaction: {
                id: transactionData._id,
                title: transactionData.title,
                amount: transactionData.amount,
                currency: transactionData.currency,
                transactionType: transactionData.type,
                status: transactionData.status,
                date: new Intl.DateTimeFormat(undefined, {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(transactionData.transactionDate)),
                account: populatedAccount?.name,
                category: category?.name,
                notes: transactionData.notes,
              },
            },
            delayMinutes: 1,
          });
        }
      }

      return operation || {
        flag: false,
        data: "transaction.createError",
        status: 500,
      };
    } catch (error) {
      logger.error("Error creating transaction:", error);
      return {
        flag: false,
        data: "transaction.createError",
        status: 500,
      };
    } finally {
      await session.endSession();
    }
  },

  updateTransaction: async (
    request: Request,
    transactionId: string,
    payload: Partial<TransactionPayload>,
  ): Promise<ServiceResult> => {
    const session = await mongoose.startSession();

    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };
      const idValidationError = ensureObjectId(transactionId, "transaction.invalidId");
      if (idValidationError) {
        return idValidationError;
      }

      const operation = await session.withTransaction(async () => {
        const existingTransaction = await Transaction.findOne({
          _id: new Types.ObjectId(transactionId),
          userId: user._id,
        }).session(session);

        if (!existingTransaction) {
          return {
            flag: false,
            data: "transaction.notFound",
            status: 404,
          } as ServiceResult;
        }

        const nextType = (payload.type || existingTransaction.type) as TransactionType;
        const nextStatus = (payload.status || existingTransaction.status) as TransactionStatus;
        const nextAccountId = String(payload.accountId || existingTransaction.accountId);
        const nextDestinationAccountId =
          payload.destinationAccountId === null
            ? null
            : String(payload.destinationAccountId || existingTransaction.destinationAccountId || "") || null;
        const nextCategoryId =
          payload.categoryId === null
            ? null
            : String(payload.categoryId || existingTransaction.categoryId || "") || null;

        const accountValidationError = ensureObjectId(nextAccountId, "transaction.invalidAccountId");
        if (accountValidationError) {
          return accountValidationError;
        }

        if (nextDestinationAccountId) {
          const destinationValidationError = ensureObjectId(
            nextDestinationAccountId,
            "transaction.invalidDestinationAccountId",
          );
          if (destinationValidationError) {
            return destinationValidationError;
          }
        }

        if (nextType === "Transfer" && nextAccountId === nextDestinationAccountId) {
          return {
            flag: false,
            data: "transaction.sameTransferAccount",
            status: 400,
          } as ServiceResult;
        }

        const accountIds = new Set<string>([
          String(existingTransaction.accountId),
          nextAccountId,
        ]);

        if (existingTransaction.destinationAccountId) {
          accountIds.add(String(existingTransaction.destinationAccountId));
        }
        if (nextDestinationAccountId) {
          accountIds.add(nextDestinationAccountId);
        }

        const accountDocuments = await Account.find({
          _id: { $in: Array.from(accountIds).map((id) => new Types.ObjectId(id)) },
          userId: user._id,
        }).session(session);

        const accountMap = new Map(accountDocuments.map((account) => [String(account._id), account]));

        const sourceAccount = accountMap.get(nextAccountId);
        if (!sourceAccount) {
          return {
            flag: false,
            data: "transaction.accountNotFound",
            status: 404,
          } as ServiceResult;
        }

        const nextDestination = nextDestinationAccountId
          ? accountMap.get(nextDestinationAccountId)
          : null;

        if (nextDestinationAccountId && !nextDestination) {
          return {
            flag: false,
            data: "transaction.destinationAccountNotFound",
            status: 404,
          } as ServiceResult;
        }

        if (nextDestination && sourceAccount.currency !== nextDestination.currency) {
          return {
            flag: false,
            data: "transaction.currencyMismatch",
            status: 400,
          } as ServiceResult;
        }

        const categoryValidation = await validateCategoryForType(
          user._id,
          nextCategoryId,
          nextType,
          session,
        );

        if (categoryValidation && (categoryValidation as ServiceResult).flag === false) {
          return categoryValidation as ServiceResult;
        }

        const currentAccount = accountMap.get(String(existingTransaction.accountId));
        const currentDestination = existingTransaction.destinationAccountId
          ? accountMap.get(String(existingTransaction.destinationAccountId)) || null
          : null;

        const currentAmount = toPositiveNumber(existingTransaction.amount);
        const nextAmount = toPositiveNumber(
          payload.amount !== undefined ? payload.amount : existingTransaction.amount,
        );

        if (existingTransaction.status === "Completed" && currentAccount) {
          const rollbackResult = applyBalanceEffect(
            currentAccount,
            currentDestination,
            existingTransaction.type as TransactionType,
            currentAmount,
            -1,
          );

          if (rollbackResult) {
            return rollbackResult;
          }
        }

        if (nextType === "Expense" || nextType === "Transfer") {
          const balanceError = ensureSufficientBalance(Number(sourceAccount.balance), nextAmount);
          if (balanceError) {
            return balanceError;
          }
        }

        if (nextStatus === "Completed") {
          const applyResult = applyBalanceEffect(
            sourceAccount,
            nextDestination,
            nextType,
            nextAmount,
            1,
          );

          if (applyResult) {
            return applyResult;
          }
        }

        for (const account of accountMap.values()) {
          await account.save({ session });
        }

        existingTransaction.title = payload.title?.trim() || existingTransaction.title;
        existingTransaction.amount = nextAmount;
        existingTransaction.type = nextType;
        existingTransaction.status = nextStatus;
        existingTransaction.transactionDate = payload.transactionDate
          ? new Date(payload.transactionDate)
          : existingTransaction.transactionDate;
        existingTransaction.accountId = sourceAccount._id;
        existingTransaction.destinationAccountId =
          nextType === "Transfer" && nextDestination ? nextDestination._id : undefined;
        existingTransaction.categoryId =
          nextType === "Transfer"
            ? undefined
            : nextCategoryId
              ? new Types.ObjectId(nextCategoryId)
              : undefined;
        existingTransaction.currency = sourceAccount.currency;
        existingTransaction.notes =
          payload.notes === null
            ? undefined
            : payload.notes !== undefined
              ? payload.notes?.trim() || undefined
              : existingTransaction.notes;
        existingTransaction.receiptUrl =
          payload.receiptUrl === null
            ? undefined
            : payload.receiptUrl !== undefined
              ? payload.receiptUrl?.trim() || undefined
              : existingTransaction.receiptUrl;

        await existingTransaction.save({ session });

        const populated = await Transaction.findById(existingTransaction._id)
          .populate({ path: "accountId", select: "name type currency color icon" })
          .populate({ path: "destinationAccountId", select: "name type currency color icon" })
          .populate({ path: "categoryId", select: "name icon color type" })
          .select("-userId")
          .session(session)
          .lean();

        return {
          flag: true,
          data: populated,
        } as ServiceResult;
      });

      if (operation?.flag) {
        // Queue email task after successful transaction update
        const userDoc = await User.findById(user._id).select("email fullName");
        if (userDoc?.email) {
          const transactionData = operation.data as any;
          const populatedAccount = transactionData.accountId;
          const category = transactionData.categoryId;
          const previousValues = {
            amount: payload.amount !== undefined ? payload.amount : undefined,
            title: payload.title !== undefined ? payload.title : undefined,
            category: payload.categoryId,
            notes: payload.notes !== undefined ? payload.notes : undefined,
          };

          await transactionEmailService.createEmailTask({
            userId: user._id,
            transactionId: new Types.ObjectId(transactionData._id),
            recipientEmail: userDoc.email,
            type: "TRANSACTION_UPDATED",
            data: {
              type: "UPDATED",
              fullName: userDoc.fullName || "User",
              transaction: {
                id: transactionData._id,
                title: transactionData.title,
                amount: transactionData.amount,
                currency: transactionData.currency,
                transactionType: transactionData.type,
                status: transactionData.status,
                date: new Intl.DateTimeFormat(undefined, {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(transactionData.transactionDate)),
                account: populatedAccount?.name,
                category: category?.name,
                notes: transactionData.notes,
              },
              previousValues: Object.fromEntries(
                Object.entries(previousValues).filter(([_, v]) => v !== undefined)
              ),
            },
            delayMinutes: 1,
          });
        }
      }

      return operation || {
        flag: false,
        data: "transaction.updateError",
        status: 500,
      };
    } catch (error) {
      logger.error("Error updating transaction:", error);
      return {
        flag: false,
        data: "transaction.updateError",
        status: 500,
      };
    } finally {
      await session.endSession();
    }
  },

  deleteTransaction: async (request: Request, transactionId: string): Promise<ServiceResult> => {
    const session = await mongoose.startSession();

    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };
      const idValidationError = ensureObjectId(transactionId, "transaction.invalidId");
      if (idValidationError) {
        return idValidationError;
      }

      const operation = await session.withTransaction(async () => {
        const transaction = await Transaction.findOne({
          _id: new Types.ObjectId(transactionId),
          userId: user._id,
        })
          .populate({ path: "accountId", select: "name" })
          .session(session);

        if (!transaction) {
          return {
            flag: false,
            data: "transaction.notFound",
            status: 404,
          } as ServiceResult;
        }

        // Store transaction data for email before deletion
        const deletedTransactionData = {
          _id: transaction._id,
          title: transaction.title,
          amount: transaction.amount,
          currency: transaction.currency,
          type: transaction.type,
          status: transaction.status,
          transactionDate: transaction.transactionDate,
          account: (transaction.accountId as any)?.name,
        };

        if (transaction.status === "Completed") {
          const sourceAccount = await Account.findOne({
            _id: transaction.accountId,
            userId: user._id,
          }).session(session);

          if (!sourceAccount) {
            return {
              flag: false,
              data: "transaction.accountNotFound",
              status: 404,
            } as ServiceResult;
          }

          let destinationAccount: any = null;
          if (transaction.destinationAccountId) {
            destinationAccount = await Account.findOne({
              _id: transaction.destinationAccountId,
              userId: user._id,
            }).session(session);

            if (!destinationAccount) {
              return {
                flag: false,
                data: "transaction.destinationAccountNotFound",
                status: 404,
              } as ServiceResult;
            }
          }

          const rollbackResult = applyBalanceEffect(
            sourceAccount,
            destinationAccount,
            transaction.type as TransactionType,
            toPositiveNumber(transaction.amount),
            -1,
          );

          if (rollbackResult) {
            return rollbackResult;
          }

          await sourceAccount.save({ session });
          if (destinationAccount) {
            await destinationAccount.save({ session });
          }
        }

        await Transaction.deleteOne({ _id: transaction._id, userId: user._id }).session(session);

        const updatedAccounts = await Account.find({
          _id: {
            $in: [transaction.accountId, transaction.destinationAccountId].filter(Boolean),
          },
          userId: user._id,
        })
          .select("-userId")
          .session(session)
          .lean();

        return {
          flag: true,
          data: {
            _id: transaction._id,
            deletedTransactionData,
            updatedAccounts,
            affectedCategoryId: transaction.categoryId || null,
          },
        } as ServiceResult;
      });

      if (operation?.flag) {
        const operationData = operation.data as any;
        const transactionId = operationData?._id;
        const deletedTransactionData = operationData?.deletedTransactionData;

        if (transactionId) {
          // Cancel any pending email tasks for this transaction
          await transactionEmailService.cancelEmailTask(
            new Types.ObjectId(transactionId)
          );

          // Queue deletion email
          const userDoc = await User.findById(user._id).select("email fullName");
          if (userDoc?.email && deletedTransactionData) {
            await transactionEmailService.createEmailTask({
              userId: user._id,
              transactionId: new Types.ObjectId(transactionId),
              recipientEmail: userDoc.email,
              type: "TRANSACTION_DELETED",
              data: {
                type: "DELETED",
                fullName: userDoc.fullName || "User",
                transaction: {
                  id: deletedTransactionData._id.toString(),
                  title: deletedTransactionData.title,
                  amount: deletedTransactionData.amount,
                  currency: deletedTransactionData.currency,
                  transactionType: deletedTransactionData.type,
                  status: deletedTransactionData.status,
                  date: new Intl.DateTimeFormat(undefined, {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(deletedTransactionData.transactionDate)),
                  account: deletedTransactionData.account,
                },
              },
              delayMinutes: 0, // Send immediately for deletion
            });
          }
        }
      }

      return operation || {
        flag: false,
        data: "transaction.deleteError",
        status: 500,
      };
    } catch (error) {
      logger.error("Error deleting transaction:", error);
      return {
        flag: false,
        data: "transaction.deleteError",
        status: 500,
      };
    } finally {
      await session.endSession();
    }
  },
};
