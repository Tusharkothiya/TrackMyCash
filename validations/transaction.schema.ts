import Joi from "joi";

const transactionTypeValues = ["Expense", "Income", "Transfer"];
const transactionStatusValues = ["Completed", "Pending", "Failed"];
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const baseSchema = {
  title: Joi.string().min(2).max(150),
  amount: Joi.number().min(0.01).max(999999999.99),
  type: Joi.string().valid(...transactionTypeValues),
  status: Joi.string().valid(...transactionStatusValues),
  transactionDate: Joi.date(),
  accountId: Joi.string().pattern(objectIdRegex),
  destinationAccountId: Joi.string().pattern(objectIdRegex),
  categoryId: Joi.string().pattern(objectIdRegex),
  notes: Joi.string().allow("").max(1000),
  receiptUrl: Joi.string().uri().allow(""),
};

export const createTransactionSchema = Joi.object({
  title: baseSchema.title.required().messages({
    "string.min": "Transaction title must be at least 2 characters",
    "string.max": "Transaction title must be less than 150 characters",
    "any.required": "Transaction title is required",
    "string.empty": "Transaction title is required",
  }),
  amount: baseSchema.amount.required().messages({
    "number.min": "Transaction amount must be greater than 0",
    "number.max": "Transaction amount must be less than or equal to 999999999.99",
    "any.required": "Transaction amount is required",
  }),
  type: baseSchema.type.required().messages({
    "any.only": "Transaction type must be Expense, Income, or Transfer",
    "any.required": "Transaction type is required",
    "string.empty": "Transaction type is required",
  }),
  status: baseSchema.status.required().messages({
    "any.only": "Transaction status must be Completed, Pending, or Failed",
    "any.required": "Transaction status is required",
    "string.empty": "Transaction status is required",
  }),
  transactionDate: baseSchema.transactionDate.required().messages({
    "date.base": "Transaction date must be a valid date",
    "any.required": "Transaction date is required",
  }),
  accountId: baseSchema.accountId.required().messages({
    "string.pattern.base": "Invalid account ID",
    "any.required": "Account ID is required",
    "string.empty": "Account ID is required",
  }),
  destinationAccountId: baseSchema.destinationAccountId.optional().messages({
    "string.pattern.base": "Invalid destination account ID",
  }),
  categoryId: baseSchema.categoryId.optional().messages({
    "string.pattern.base": "Invalid category ID",
  }),
  notes: baseSchema.notes.optional().messages({
    "string.max": "Notes must be less than 1000 characters",
  }),
  receiptUrl: baseSchema.receiptUrl.optional().messages({
    "string.uri": "Receipt URL must be a valid URL",
  }),
})
  .custom((value, helpers) => {
    const type = value.type as string;

    if (type === "Transfer") {
      if (!value.destinationAccountId) {
        return helpers.error("any.custom", {
          message: "Destination account is required for transfer",
        });
      }
    } else if (!value.categoryId) {
      return helpers.error("any.custom", {
        message: "Category is required for Expense and Income transactions",
      });
    }

    return value;
  })
  .messages({
    "any.custom": "{{#message}}",
  });

export const updateTransactionSchema = Joi.object({
  title: baseSchema.title.optional().messages({
    "string.min": "Transaction title must be at least 2 characters",
    "string.max": "Transaction title must be less than 150 characters",
  }),
  amount: baseSchema.amount.optional().messages({
    "number.min": "Transaction amount must be greater than 0",
    "number.max": "Transaction amount must be less than or equal to 999999999.99",
  }),
  type: baseSchema.type.optional().messages({
    "any.only": "Transaction type must be Expense, Income, or Transfer",
  }),
  status: baseSchema.status.optional().messages({
    "any.only": "Transaction status must be Completed, Pending, or Failed",
  }),
  transactionDate: baseSchema.transactionDate.optional().messages({
    "date.base": "Transaction date must be a valid date",
  }),
  accountId: baseSchema.accountId.optional().messages({
    "string.pattern.base": "Invalid account ID",
  }),
  destinationAccountId: baseSchema.destinationAccountId.allow(null).optional().messages({
    "string.pattern.base": "Invalid destination account ID",
  }),
  categoryId: baseSchema.categoryId.allow(null).optional().messages({
    "string.pattern.base": "Invalid category ID",
  }),
  notes: baseSchema.notes.allow(null).optional().messages({
    "string.max": "Notes must be less than 1000 characters",
  }),
  receiptUrl: baseSchema.receiptUrl.allow(null).optional().messages({
    "string.uri": "Receipt URL must be a valid URL",
  }),
})
  .or(
    "title",
    "amount",
    "type",
    "status",
    "transactionDate",
    "accountId",
    "destinationAccountId",
    "categoryId",
    "notes",
    "receiptUrl"
  )
  .messages({
    "object.missing": "At least one field is required to update transaction",
  });
