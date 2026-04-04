import { jwtUtils } from "@/configs/jwt";
import { logger } from "@/lib/logger";
import Category from "@/models/Categories.model";
import User from "@/models/Users.model";
import { Types } from "mongoose";

type ServiceResult = {
  flag: boolean;
  data?: unknown;
  status?: number;
};

type CategoryPayload = {
  name: string;
  icon: string;
  color: string;
  type: "expense" | "income";
  overline?: string | null;
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

export const categoryServices = {
  createCategory: async (request: Request, payload: CategoryPayload): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };
      const normalizedName = payload.name.trim().toLowerCase();
      const cleanedName = payload.name.trim();

      const exists = await Category.findOne({
        userId: user._id,
        nameKey: normalizedName,
        type: payload.type,
      });

      if (exists) {
        return {
          flag: false,
          data: "category.alreadyExists",
          status: 409,
        };
      }

      const category = await Category.create({
        userId: user._id,
        ...payload,
        name: cleanedName,
        nameKey: normalizedName,
      });

      return {
        flag: true,
        data: category,
      };
    } catch (error) {
      await logger.error("Error in categoryServices.createCategory:", error);
      throw error;
    }
  },

  getCategories: async (
    request: Request,
    filters?: { type?: string | null }
  ): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      const query: {
        userId: Types.ObjectId;
        type?: "expense" | "income";
      } = {
        userId: user._id,
      };

      if (filters?.type === "expense" || filters?.type === "income") {
        query.type = filters.type;
      }

      const categories = await Category.find(query)
        .sort({ createdAt: -1 })
        .lean();

      return {
        flag: true,
        data: categories,
      };
    } catch (error) {
      await logger.error("Error in categoryServices.getCategories:", error);
      throw error;
    }
  },

  getCategoryById: async (request: Request, id: string): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };
      const category = await Category.findOne({
        _id: id,
        userId: user._id,
      });

      if (!category) {
        return {
          flag: false,
          data: "category.notFound",
          status: 404,
        };
      }

      return {
        flag: true,
        data: category,
      };
    } catch (error) {
      await logger.error("Error in categoryServices.getCategoryById:", error);
      throw error;
    }
  },

  updateCategory: async (
    request: Request,
    id: string,
    payload: Partial<CategoryPayload>
  ): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      const category = await Category.findOne({
        _id: id,
        userId: user._id,
      });

      if (!category) {
        return {
          flag: false,
          data: "category.notFound",
          status: 404,
        };
      }

      if (payload.name) {
        payload.name = payload.name.trim();
      }

      if (payload.name || payload.type) {
        const nextName = payload.name || category.name;
        const nextNameKey = nextName.trim().toLowerCase();

        const duplicate = await Category.findOne({
          _id: { $ne: id },
          userId: user._id,
          nameKey: nextNameKey,
          type: payload.type || category.type,
        });

        if (duplicate) {
          return {
            flag: false,
            data: "category.alreadyExists",
            status: 409,
          };
        }
      }

      Object.assign(category, payload);
      if (payload.name) {
        category.nameKey = payload.name.trim().toLowerCase();
      }
      await category.save();

      return {
        flag: true,
        data: category,
      };
    } catch (error) {
      await logger.error("Error in categoryServices.updateCategory:", error);
      throw error;
    }
  },

  deleteCategory: async (request: Request, id: string): Promise<ServiceResult> => {
    try {
      const auth = await getAuthenticatedUser(request);
      if (!auth.flag) {
        return auth;
      }

      const user = auth.data as { _id: Types.ObjectId };

      const category = await Category.findOneAndDelete({
        _id: id,
        userId: user._id,
      });

      if (!category) {
        return {
          flag: false,
          data: "category.notFound",
          status: 404,
        };
      }

      return {
        flag: true,
        data: category,
      };
    } catch (error) {
      await logger.error("Error in categoryServices.deleteCategory:", error);
      throw error;
    }
  },
};
