import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { transactionServices } from "@/services/transactionServices";
import { createTransactionSchema } from "@/validations/transaction.schema";

export const GET = catchAsync(async (request: Request, res: any) => {
  const result = await transactionServices.getTransactions(request);
  if (result.flag) {
    res.message = _localize("transaction.fetchSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});

export const POST = catchAsync(
  async (request: Request, res: any, body: any) => {
    const result = await transactionServices.createTransaction(request, body);
    if (result.flag) {
      res.message = _localize("transaction.createSuccess");
      return utils.successResponse(result.data, res);
    }

    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  },
  createTransactionSchema
);
