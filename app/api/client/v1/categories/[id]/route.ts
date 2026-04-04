import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { categoryServices } from "@/services/categoryServices";
import { updateCategorySchema } from "@/validations/category.schema";
import mongoose from "mongoose";

type RouteContext = {
  params:
    | {
        id: string;
      }
    | Promise<{
    id: string;
      }>;
};

function isValidCategoryId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getCategoryIdFromContext(context: RouteContext) {
  const params = await Promise.resolve(context?.params);
  return params?.id;
}

export const GET = catchAsync(
  async (request: Request, res: any, _body: any, context: RouteContext) => {
    const id = await getCategoryIdFromContext(context);

    if (!id || !isValidCategoryId(id)) {
      return utils.failureResponse("Invalid category id", res, 400);
    }

    const result = await categoryServices.getCategoryById(request, id);
    if (result.flag) {
      res.message = _localize("category.fetchSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  }
);

export const PUT = catchAsync(
  async (request: Request, res: any, body: any, context: RouteContext) => {
    const id = await getCategoryIdFromContext(context);

    if (!id || !isValidCategoryId(id)) {
      return utils.failureResponse("Invalid category id", res, 400);
    }

    const result = await categoryServices.updateCategory(request, id, body);
    if (result.flag) {
      res.message = _localize("category.updateSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  },
  updateCategorySchema
);

export const DELETE = catchAsync(
  async (request: Request, res: any, _body: any, context: RouteContext) => {
    const id = await getCategoryIdFromContext(context);

    if (!id || !isValidCategoryId(id)) {
      return utils.failureResponse("Invalid category id", res, 400);
    }

    const result = await categoryServices.deleteCategory(request, id);
    if (result.flag) {
      res.message = _localize("category.deleteSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  }
);
