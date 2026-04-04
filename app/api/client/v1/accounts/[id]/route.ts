import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { accountServices } from "@/services/accountServices";
import { updateAccountSchema } from "@/validations/account.schema";

export const GET = catchAsync(async (request: Request, res: any) => {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return utils.failureResponse("Account ID is required", res, 400);
  }

  const result = await accountServices.getAccountById(request, id);
  if (result.flag) {
    res.message = _localize("account.fetchSuccess");
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
      return utils.failureResponse("Account ID is required", res, 400);
    }

    const result = await accountServices.updateAccount(request, id, body);
    if (result.flag) {
      res.message = _localize("account.updateSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  },
  updateAccountSchema
);

export const DELETE = catchAsync(async (request: Request, res: any) => {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return utils.failureResponse("Account ID is required", res, 400);
  }

  const result = await accountServices.deleteAccount(request, id);
  if (result.flag) {
    res.message = _localize("account.deleteSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});
