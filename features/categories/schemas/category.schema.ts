import { CategoryPayload } from "../types";

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export function validateCategoryPayload(payload: CategoryPayload): string | null {
  const name = payload.name?.trim();

  if (!name) {
    return "Category name is required.";
  }

  if (name.length < 2) {
    return "Category name must be at least 2 characters.";
  }

  if (name.length > 60) {
    return "Category name must be less than 60 characters.";
  }

  if (!payload.icon) {
    return "Category icon is required.";
  }

  if (!payload.color || !hexColorRegex.test(payload.color)) {
    return "Please select a valid hex color.";
  }

  if (payload.type !== "income" && payload.type !== "expense") {
    return "Category type must be expense or income.";
  }

  if (payload.overline && payload.overline.length > 80) {
    return "Overline must be less than 80 characters.";
  }

  return null;
}
