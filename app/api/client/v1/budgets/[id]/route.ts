import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { budgetServices } from "@/services/budgetServices";
import { updateBudgetSchema } from "@/validations/budget.schema";

export const GET = catchAsync(async (request: Request, res: any) => {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return utils.failureResponse("Budget ID is required", res, 400);
  }

  const result = await budgetServices.getBudgetById(request, id);
  if (result.flag) {
    res.message = _localize("budget.fetchSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});

export const PUT = catchAsync(
  async (request: Request, res: any, body: any) => {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return utils.failureResponse("Budget ID is required", res, 400);
    }

    const result = await budgetServices.updateBudget(request, id, body);
    if (result.flag) {
      res.message = _localize("budget.updateSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  },
  updateBudgetSchema
);

export const DELETE = catchAsync(async (request: Request, res: any) => {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return utils.failureResponse("Budget ID is required", res, 400);
  }

  const result = await budgetServices.deleteBudget(request, id);
  if (result.flag) {
    res.message = _localize("budget.deleteSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});
