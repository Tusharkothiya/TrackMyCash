import Joi from "joi";

const categoryIconValues = [
  "layout-grid",
  "receipt",
  "wallet",
  "bar-chart",
  "settings",
  "log-out",
  "search",
  "bell",
  "plus-circle",
  "edit",
  "trash-2",
  "sparkles",
  "server",
  "megaphone",
  "briefcase",
  "plane",
  "banknote",
  "lightbulb",
  "more-horizontal",
  "shopping-cart",
  "home",
  "activity",
  "graduation-cap",
  "clapperboard",
  "piggy-bank",
  "theater",
  "paw-print",
  "layers",
];

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(60).required().messages({
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must be less than 60 characters",
    "any.required": "Category name is required",
    "string.empty": "Category name is required",
  }),
  icon: Joi.string()
    .valid(...categoryIconValues)
    .required()
    .messages({
      "any.only": "Invalid category icon",
      "any.required": "Category icon is required",
      "string.empty": "Category icon is required",
    }),
  color: Joi.string().pattern(hexColorRegex).required().messages({
    "string.pattern.base": "Color must be a valid hex code",
    "any.required": "Category color is required",
    "string.empty": "Category color is required",
  }),
  type: Joi.string().valid("expense", "income").required().messages({
    "any.only": "Category type must be expense or income",
    "any.required": "Category type is required",
    "string.empty": "Category type is required",
  }),
  overline: Joi.string().max(80).allow("", null).optional().messages({
    "string.max": "Overline must be less than 80 characters",
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(60).optional().messages({
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must be less than 60 characters",
  }),
  icon: Joi.string()
    .valid(...categoryIconValues)
    .optional()
    .messages({
      "any.only": "Invalid category icon",
    }),
  color: Joi.string().pattern(hexColorRegex).optional().messages({
    "string.pattern.base": "Color must be a valid hex code",
  }),
  type: Joi.string().valid("expense", "income").optional().messages({
    "any.only": "Category type must be expense or income",
  }),
  overline: Joi.string().max(80).allow("", null).optional().messages({
    "string.max": "Overline must be less than 80 characters",
  }),
})
  .or("name", "icon", "color", "type", "overline")
  .messages({
    "object.missing": "At least one field is required to update category",
  });
