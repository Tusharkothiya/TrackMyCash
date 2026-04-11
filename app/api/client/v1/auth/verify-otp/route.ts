import { utils } from "@/lib/api-response";
import { catchAsync } from "@/lib/catch-async";
import { _localize } from "@/lib/localize";
import User from "@/models/Users.model";
import { authServices } from "@/services/authServices";
import { mailServices } from "@/services/mailServices";
import { otpVerificationSchema } from "@/validations/auth.schema";
import { after } from "next/server";

export const POST = catchAsync(
    async(request: Request, res: any, body: any) => {
        const result = await authServices.verifyOtp(body);
        if(result.flag) {
            const welcomeEmail = result?.meta?.welcomeEmail;
            if (welcomeEmail && !welcomeEmail.alreadySent) {
                after(async () => {
                    const isWelcomeEmailSent = await mailServices.sendWelcomeEmail({
                        email: welcomeEmail.email,
                        fullName: welcomeEmail.fullName,
                    });

                    if (isWelcomeEmailSent) {
                        await User.updateOne(
                            { _id: welcomeEmail.userId, welcomeEmailSent: false },
                            {
                                $set: {
                                    welcomeEmailSent: true,
                                    welcomeEmailSentAt: new Date(),
                                },
                            },
                        );
                    }
                });
            }
            res.message = _localize("auth.otpVerified");
            return utils.successResponse(result?.data, res);
        }else{
            const message = _localize(result?.data as string);
            return utils.failureResponse(message, res);
        }
    },
    otpVerificationSchema
)