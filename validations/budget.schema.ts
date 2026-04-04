import Joi from "joi";

const frequencyValues = ["Monthly", "Quarterly", "Yearly"];
const currencyValues = ["USD", "INR", "EUR", "GBP"];

export const createBudgetSchema = Joi.object({
  categoryId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid category ID",
      "any.required": "Category ID is required",
      "string.empty": "Category ID is required",
    }),
  budgetLimit: Joi.number()
    .min(0)
    .max(999999999.99)
    .required()
    .messages({
      "number.min": "Budget limit cannot be negative",
      "number.max": "Budget limit cannot exceed 999999999.99",
      "any.required": "Budget limit is required",
    }),
  frequency: Joi.string()
    .valid(...frequencyValues)
    .required()
    .messages({
      "any.only": "Frequency must be Monthly, Quarterly, or Yearly",
      "any.required": "Frequency is required",
      "string.empty": "Frequency is required",
    }),
  activationDate: Joi.date().required().messages({
    "date.base": "Activation date must be a valid date",
    "any.required": "Activation date is required",
  }),
  currency: Joi.string()
    .valid(...currencyValues)
    .optional()
    .messages({
      "any.only": "Currency must be USD, INR, EUR, or GBP",
    }),
});

export const updateBudgetSchema = Joi.object({
  categoryId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid category ID",
    }),
  budgetLimit: Joi.number()
    .min(0)
    .max(999999999.99)
    .optional()
    .messages({
      "number.min": "Budget limit cannot be negative",
      "number.max": "Budget limit cannot exceed 999999999.99",
    }),
  frequency: Joi.string()
    .valid(...frequencyValues)
    .optional()
    .messages({
      "any.only": "Frequency must be Monthly, Quarterly, or Yearly",
    }),
  activationDate: Joi.date().optional().messages({
    "date.base": "Activation date must be a valid date",
  }),
  currency: Joi.string()
    .valid(...currencyValues)
    .optional()
    .messages({
      "any.only": "Currency must be USD, INR, EUR, or GBP",
    }),
})
  .or("categoryId", "budgetLimit", "frequency", "activationDate", "currency")
  .messages({
    "object.missing": "At least one field is required to update budget",
  });
