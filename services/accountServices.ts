import { jwtUtils } from "@/configs/jwt";
import { logger } from "@/lib/logger";
import Account from "@/models/Accounts.model";
import User from "@/models/Users.model";
import { Types } from "mongoose";

type ServiceResult = {
  flag: boolean;
  data?: unknown;
  status?: number;
};

type AccountPayload = {
  name: string;
  type: "Bank" | "Credit Card" | "Wallet" | "Cash";
  currency: "USD" | "INR" | "EUR" | "GBP";
  balance: number;
  color: string;
  icon: string;
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

export const accountServices = {
  getAccounts: async (request: Request): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      const accounts = await Account.find({ userId: user._id })
        .select("-userId")
        .sort({ createdAt: -1 })
        .lean();

      return {
        flag: true,
        data: accounts,
      };
    } catch (error) {
      logger.error("Error fetching accounts:", error);
      return {
        flag: false,
        data: "account.fetchError",
        status: 500,
      };
    }
  },

  getAccountById: async (request: Request, accountId: string): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      if (!Types.ObjectId.isValid(accountId)) {
        return {
          flag: false,
          data: "account.invalidId",
          status: 400,
        };
      }

      const account = await Account.findOne({
        _id: new Types.ObjectId(accountId),
        userId: user._id,
      }).select("-userId");

      if (!account) {
        return {
          flag: false,
          data: "account.notFound",
          status: 404,
        };
      }

      return {
        flag: true,
        data: account,
      };
    } catch (error) {
      logger.error("Error fetching account:", error);
      return {
        flag: false,
        data: "account.fetchError",
        status: 500,
      };
    }
  },

  createAccount: async (request: Request, payload: AccountPayload): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };
      const cleanedName = payload.name.trim();

      const exists = await Account.findOne({
        userId: user._id,
        name: cleanedName,
      });

      if (exists) {
        return {
          flag: false,
          data: "account.nameAlreadyExists",
          status: 409,
        };
      }

      const newAccount = new Account({
        userId: user._id,
        name: cleanedName,
        type: payload.type,
        currency: payload.currency,
        balance: payload.balance,
        color: payload.color,
        icon: payload.icon,
      });

      const savedAccount = await newAccount.save();
      const accountData = savedAccount.toObject();
      delete accountData.userId;

      return {
        flag: true,
        data: accountData,
      };
    } catch (error) {
      logger.error("Error creating account:", error);
      return {
        flag: false,
        data: "account.createError",
        status: 500,
      };
    }
  },

  updateAccount: async (
    request: Request,
    accountId: string,
    payload: Partial<AccountPayload>
  ): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      if (!Types.ObjectId.isValid(accountId)) {
        return {
          flag: false,
          data: "account.invalidId",
          status: 400,
        };
      }

      // Check if account exists
      const account = await Account.findOne({
        _id: new Types.ObjectId(accountId),
        userId: user._id,
      });

      if (!account) {
        return {
          flag: false,
          data: "account.notFound",
          status: 404,
        };
      }

      // If updating name, check for duplicates
      if (payload.name && payload.name.trim() !== account.name) {
        const duplicate = await Account.findOne({
          userId: user._id,
          name: payload.name.trim(),
          _id: { $ne: new Types.ObjectId(accountId) },
        });

        if (duplicate) {
          return {
            flag: false,
            data: "account.nameAlreadyExists",
            status: 409,
          };
        }
      }

      // Update only provided fields
      if (payload.name) account.name = payload.name.trim();
      if (payload.type) account.type = payload.type;
      if (payload.currency) account.currency = payload.currency;
      if (payload.balance !== undefined) account.balance = payload.balance;
      if (payload.color) account.color = payload.color;
      if (payload.icon) account.icon = payload.icon;

      const updatedAccount = await account.save();
      const accountData = updatedAccount.toObject();
      delete accountData.userId;

      return {
        flag: true,
        data: accountData,
      };
    } catch (error) {
      logger.error("Error updating account:", error);
      return {
        flag: false,
        data: "account.updateError",
        status: 500,
      };
    }
  },

  deleteAccount: async (request: Request, accountId: string): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      if (!Types.ObjectId.isValid(accountId)) {
        return {
          flag: false,
          data: "account.invalidId",
          status: 400,
        };
      }

      const result = await Account.findOneAndDelete({
        _id: new Types.ObjectId(accountId),
        userId: user._id,
      });

      if (!result) {
        return {
          flag: false,
          data: "account.notFound",
          status: 404,
        };
      }

      return {
        flag: true,
        data: { _id: result._id },
      };
    } catch (error) {
      logger.error("Error deleting account:", error);
      return {
        flag: false,
        data: "account.deleteError",
        status: 500,
      };
    }
  },
};
