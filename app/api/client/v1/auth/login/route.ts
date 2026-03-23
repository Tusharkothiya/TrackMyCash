import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { authServices } from "@/services/authServices";
import { loginSchema } from "@/validations/auth.schema";

export const POST = catchAsync(
  async (request: Request, res: any, body: any) => {
    const result = await authServices.login(body);
    if (result.flag) {
      res.message = _localize("auth.loginSuccess");
      return utils.successResponse(result?.data, res);
    }

    const message = _localize(result?.data as string);
    return utils.failureResponse(message, res);
  },
  loginSchema,
);
