import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { authServices } from "@/services/authServices";
import { otpVerificationSchema } from "@/validations/auth.schema";

export const POST = catchAsync(
    async(request: Request, res: any, body: any) => {
        const result = await authServices.verifyOtp(body);
        if(result.flag) {
            res.message = _localize("auth.otpVerified");
            return utils.successResponse(result?.data, res);
        }else{
            const message = _localize(result?.data as string);
            return utils.failureResponse(message, res);
        }
    },
    otpVerificationSchema
)