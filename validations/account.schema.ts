import Joi from "joi";

const accountIconValues = ["bank", "credit_card", "wallet", "cash"];
const accountTypeValues = ["Bank", "Credit Card", "Wallet", "Cash"];
const currencyValues = ["USD", "INR", "EUR", "GBP"];
const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const createAccountSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Account name must be at least 2 characters",
    "string.max": "Account name must be less than 100 characters",
    "any.required": "Account name is required",
    "string.empty": "Account name is required",
  }),
  type: Joi.string()
    .valid(...accountTypeValues)
    .required()
    .messages({
      "any.only": "Account type must be Bank, Credit Card, Wallet, or Cash",
      "any.required": "Account type is required",
      "string.empty": "Account type is required",
    }),
  currency: Joi.string()
    .valid(...currencyValues)
    .required()
    .messages({
      "any.only": "Currency must be USD, INR, EUR, or GBP",
      "any.required": "Currency is required",
      "string.empty": "Currency is required",
    }),
  balance: Joi.number()
    .min(-999999999.99)
    .max(999999999.99)
    .required()
    .messages({
      "number.min": "Balance cannot be less than -999999999.99",
      "number.max": "Balance cannot be more than 999999999.99",
      "any.required": "Balance is required",
    }),
  color: Joi.string().pattern(hexColorRegex).required().messages({
    "string.pattern.base": "Color must be a valid hex code",
    "any.required": "Account color is required",
    "string.empty": "Account color is required",
  }),
  icon: Joi.string()
    .valid(...accountIconValues)
    .required()
    .messages({
      "any.only": "Invalid account icon",
      "any.required": "Account icon is required",
      "string.empty": "Account icon is required",
    }),
});

export const updateAccountSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Account name must be at least 2 characters",
    "string.max": "Account name must be less than 100 characters",
  }),
  type: Joi.string()
    .valid(...accountTypeValues)
    .optional()
    .messages({
      "any.only": "Account type must be Bank, Credit Card, Wallet, or Cash",
    }),
  currency: Joi.string()
    .valid(...currencyValues)
    .optional()
    .messages({
      "any.only": "Currency must be USD, INR, EUR, or GBP",
    }),
  balance: Joi.number()
    .min(-999999999.99)
    .max(999999999.99)
    .optional()
    .messages({
      "number.min": "Balance cannot be less than -999999999.99",
      "number.max": "Balance cannot be more than 999999999.99",
    }),
  color: Joi.string().pattern(hexColorRegex).optional().messages({
    "string.pattern.base": "Color must be a valid hex code",
  }),
  icon: Joi.string()
    .valid(...accountIconValues)
    .optional()
    .messages({
      "any.only": "Invalid account icon",
    }),
})
  .or("name", "type", "currency", "balance", "color", "icon")
  .messages({
    "object.missing": "At least one field is required to update account",
  });
