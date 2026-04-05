import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { dashboardServices } from "@/services/dashboardServices";

export const GET = catchAsync(async (request: Request, res: any) => {
  const result = await dashboardServices.getOverview(request);
  if (result.flag) {
    res.message = _localize("dashboard.fetchSuccess");
    return utils.successResponse(result.data, res);
  }

  const message = _localize(result.data as string);
  return utils.failureResponse(message, res, result.status || 400);
});
