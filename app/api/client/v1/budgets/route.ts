import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { budgetServices } from "@/services/budgetServices";
import { createBudgetSchema } from "@/validations/budget.schema";

export const GET = catchAsync(async (request: Request, res: any) => {
  const result = await budgetServices.getBudgets(request);
  if (result.flag) {
    res.message = _localize("budget.fetchSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});

export const POST = catchAsync(
  async (request: Request, res: any, body: any) => {
    const result = await budgetServices.createBudget(request, body);
    if (result.flag) {
      res.message = _localize("budget.createSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  },
  createBudgetSchema
);
