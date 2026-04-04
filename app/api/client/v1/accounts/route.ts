import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { accountServices } from "@/services/accountServices";
import { createAccountSchema } from "@/validations/account.schema";

export const GET = catchAsync(async (request: Request, res: any) => {
  const result = await accountServices.getAccounts(request);
  if (result.flag) {
    res.message = _localize("account.fetchSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});

export const POST = catchAsync(
  async (request: Request, res: any, body: any) => {
    const result = await accountServices.createAccount(request, body);
    if (result.flag) {
      res.message = _localize("account.createSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  },
  createAccountSchema
);
