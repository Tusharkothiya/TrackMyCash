import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { authServices } from "@/services/authServices";

const TOKEN_KEY = "_next_refresh_token_tmc_";

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

export const GET = catchAsync(async (request: Request, res: any) => {
  const token = getCookieValue(request, TOKEN_KEY);

  if (!token) {
    const message = _localize("auth.invalidToken");
    return utils.failureResponse(message, res, 401);
  }

  const result = await authServices.getCurrentUser(token);
  if (!result.flag) {
    const message = _localize(result.data as string);
    return utils.failureResponse(message, res, result.status || 400);
  }

  res.message = "Success";
  return utils.successResponse(result.data, res);
});
