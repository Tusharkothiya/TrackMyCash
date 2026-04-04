import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { transactionServices } from "@/services/transactionServices";
import { updateTransactionSchema } from "@/validations/transaction.schema";

export const GET = catchAsync(async (request: Request, res: any) => {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return utils.failureResponse("Transaction ID is required", res, 400);
  }

  const result = await transactionServices.getTransactionById(request, id);
  if (result.flag) {
    res.message = _localize("transaction.fetchSuccess");
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
      return utils.failureResponse("Transaction ID is required", res, 400);
    }

    const result = await transactionServices.updateTransaction(request, id, body);
    if (result.flag) {
      res.message = _localize("transaction.updateSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  },
  updateTransactionSchema
);

export const DELETE = catchAsync(async (request: Request, res: any) => {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return utils.failureResponse("Transaction ID is required", res, 400);
  }

  const result = await transactionServices.deleteTransaction(request, id);
  if (result.flag) {
    res.message = _localize("transaction.deleteSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});
