import { jwtUtils } from "@/configs/jwt";
import { logger } from "@/lib/logger";
import User from "@/models/Users.model";
import bcrypt from "bcryptjs";

export const authServices = {
  //USER REGISTRATION
  register: async (userData: any) => {
    try {
      const normalizedEmail = userData?.email?.trim()?.toLowerCase();

      //Find Existing User
      const eu = await User.findOne({
        email: normalizedEmail,
      });

      if (eu) {
        return {
          flag: false,
          data: "auth.userAlreadyExists",
        };
      }

      //Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      //Generate JWT Token
      const token = jwtUtils.gJT({ email: normalizedEmail });

      //Create New User
      const response = await User.create({
        ...userData,
        email: normalizedEmail,
        otp,
      });

      return {
        flag: true,
        data: { ...response._doc, token },
        meta: {
          otpEmail: {
            email: normalizedEmail,
            fullName: response.fullName,
            otp,
          },
        },
      };
    } catch (error) {
      await logger.error("Error in authServices.register: ", error);
      throw error;
    }
  },

  // USER LOGIN
  login: async (loginData: any) => {
    try {
      const { email, password } = loginData;

      const user = await User.findOne({
        email: email?.trim()?.toLowerCase(),
      });

      if (!user) {
        return {
          flag: false,
          data: "auth.accountNotFound",
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          flag: false,
          data: "auth.passwordWrong",
        };
      }

      const token = jwtUtils.gJT({ email: user.email });

      return {
        flag: true,
        data: { ...user._doc, token },
      };
    } catch (error) {
      await logger.error("Error in authServices.login: ", error);
      throw error;
    }
  },

  // OTP VERIFICATION
  verifyOtp: async (otpData: any) => {
    try {
      const { email, otp } = otpData;
      const normalizedEmail = email?.trim()?.toLowerCase();
      const user = await User.findOne({
        email: normalizedEmail,
      });

      if (!user) {
        return {
          flag: false,
          data: "auth.accountNotFound",
        };
      }

      //Check Account is already verified
      if (user.isVerified) {
        return {
          flag: false,
          data: "auth.accountAlreadyVerified",
        };
      }

      if (user.otp !== otp) {
        return {
          flag: false,
          data: "auth.otpWrong",
        };
      }

      const verifiedUser = await User.findOneAndUpdate(
        {
          email: normalizedEmail,
          otp,
          isVerified: false,
        },
        {
          $set: {
            otp: "",
            isVerified: true,
          },
        },
        { new: true },
      );

      if (!verifiedUser) {
        return {
          flag: false,
          data: "auth.accountAlreadyVerified",
        };
      }

      return {
        flag: true,
        data: null,
        meta: {
          welcomeEmail: {
            userId: String(verifiedUser._id),
            email: verifiedUser.email,
            fullName: verifiedUser.fullName,
            alreadySent: Boolean(verifiedUser.welcomeEmailSent),
          },
        },
      };
    } catch (error) {
      await logger.error("Error in authServices.verifyOtp: ", error);
      throw error;
    }
  },

  //RESEND OTP
  resendOTP: async (email: string) => {
    try {
      //find Existing User
      const eu = await User.findOne({
        email: email?.trim()?.toLowerCase(),
      });

      if (!eu) {
        return {
          flag: false,
          data: "auth.accountNotFound",
        };
      }

      //check user is verified
      const iv = eu.isVerified;
      if (iv) {
        return {
          flag: false,
          data: "auth.accountAlreadyVerified",
        };
      }

      //Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      eu.otp = otp;
      await eu.save();

      return {
        flag: true,
        data: null,
        meta: {
          otpEmail: {
            email: eu.email,
            fullName: eu.fullName,
            otp,
          },
        },
      };
    } catch (error) {
      await logger.error("Error: Resend OTP Services. ", error);
      throw error;
    }
  },

  //FORGOT PASSWORD
  forgotPassword: async (email: any) => {
    try {
      const normalizedEmail = email?.trim()?.toLowerCase();

      //Find User
      const eu = await User.findOne({
        email: normalizedEmail,
      });

      if (!eu) {
        return {
          flag: false,
          data: "auth.accountNotFound",
        };
      }

      //Generate secured password reset token
      const token = jwtUtils.gPRT(normalizedEmail);

      eu.passwordResetToken = token;
      await eu.save();
      return {
        flag: true,
        data: {
          resetToken: token,
          email: normalizedEmail,
        },
      };
    } catch (error) {
      await logger.error("Error in authServices.forgotPassword: ", error);
      throw error;
    }
  },

  //CHANGE PASSWORD
  changePassword: async (data: any) => {
    try {
      const { email, password, token } = data;
      const normalizedEmail = email?.trim()?.toLowerCase();

      //Find User
      const eu = await User.findOne({
        email: normalizedEmail,
      });

      if (!eu) {
        return {
          flag: false,
          data: "auth.accountNotFound",
        };
      }

      //Verify Token
      const decodedToken = jwtUtils.vJT(token);
      if (!decodedToken) {
        return {
          flag: false,
          data: "auth.invalidToken",
        };
      }

      if (
        decodedToken.email !== normalizedEmail ||
        decodedToken.purpose !== "password_reset"
      ) {
        return {
          flag: false,
          data: "auth.invalidToken",
        };
      }

      if (!eu.passwordResetToken || eu.passwordResetToken !== token) {
        return {
          flag: false,
          data: "auth.invalidToken",
        };
      }

      eu.password = password;
      eu.passwordResetToken = "";
      await eu.save();

      return {
        flag: true,
      };


    } catch (error) {
      await logger.error("Error in authServices.changePassword: ", error);
      throw error;
    }
  },

  // CURRENT USER BY TOKEN
  getCurrentUser: async (token: string) => {
    try {
      const decodedToken = jwtUtils.vJT(token);
      if (!decodedToken?.email) {
        return {
          flag: false,
          data: "auth.invalidToken",
          status: 401,
        };
      }

      const user = await User.findOne({
        email: String(decodedToken.email).trim().toLowerCase(),
      }).select("fullName email role country timeZone isVerified createdAt updatedAt");

      if (!user) {
        return {
          flag: false,
          data: "auth.accountNotFound",
          status: 404,
        };
      }

      return {
        flag: true,
        data: user,
      };
    } catch (error) {
      await logger.error("Error in authServices.getCurrentUser: ", error);
      throw error;
    }
  },
};
