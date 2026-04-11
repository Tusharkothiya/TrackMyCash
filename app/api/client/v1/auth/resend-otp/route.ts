import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import { mailServices } from "@/services/mailServices";
import { authServices } from "@/services/authServices";
import { resendOTPSchema } from "@/validations/auth.schema";
import { after } from "next/server";

export const POST = catchAsync(
    async(request: Request, res: any, body: any) => {
        const result = await authServices.resendOTP(body.email);
        if(result.flag) {
            const otpEmail = result?.meta?.otpEmail;
            if (otpEmail) {
                after(async () => {
                    await mailServices.sendOtpVerificationEmail(otpEmail);
                });
            }
            res.message = _localize("auth.otpResent");
            return utils.successResponse(result?.data, res)
        }else{
            const message = _localize(result?.data as string);
            return utils.failureResponse(message, res)
        }
    },
    resendOTPSchema
)