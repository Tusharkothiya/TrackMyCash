import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { categoryServices } from "@/services/categoryServices";
import { createCategorySchema } from "@/validations/category.schema";

export const GET = catchAsync(async (request: Request, res: any) => {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type && type !== "expense" && type !== "income") {
    return utils.failureResponse("Type must be expense or income", res, 400);
  }

  const result = await categoryServices.getCategories(request, { type });
  if (result.flag) {
    res.message = _localize("category.fetchSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});

export const POST = catchAsync(
  async (request: Request, res: any, body: any) => {
    const result = await categoryServices.createCategory(request, body);
    if (result.flag) {
      res.message = _localize("category.createSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  },
  createCategorySchema
);
