import { USER_ROLES } from "@/lib/constants/common.constants";
import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required().messages({
    "string.min": "Full Name must be at least 3 characters",
    "any.required": "Full Name is required",
    "string.empty": "Full Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
  timeZone: Joi.string().required().messages({
    "any.required": "Time Zone is required",
    "string.empty": "Time Zone is required",
  }),
  role: Joi.string()
    .valid(USER_ROLES.USER, USER_ROLES.ADMIN)
    .required()
    .messages({
      "any.required": "Role is required",
      "string.empty": "Role is required",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
  timezone: Joi.string().optional(),
});

export const otpVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 characters long",
    "any.required": "OTP is required",
    "string.empty": "OTP is required",
  }),
});

export const resendOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),
});

export const changePasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),

  token: Joi.string().required().messages({
    "any.required": "Token is required",
    "string.empty": "Token is required",
  }),
});
