import mongoose, { Document, models, Types } from "mongoose";

export interface IBudgetModal extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  budgetLimit: number;
  frequency: "Monthly" | "Quarterly" | "Yearly";
  activationDate: Date;
  currency: "USD" | "INR" | "EUR" | "GBP";
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new mongoose.Schema<IBudgetModal>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
      index: true,
    },
    budgetLimit: {
      type: Number,
      required: [true, "Budget limit is required"],
      min: [0, "Budget limit cannot be negative"],
      max: [999999999.99, "Budget limit cannot exceed 999999999.99"],
    },
    frequency: {
      type: String,
      enum: {
        values: ["Monthly", "Quarterly", "Yearly"],
        message: "Frequency must be Monthly, Quarterly, or Yearly",
      },
      required: [true, "Frequency is required"],
      default: "Monthly",
    },
    activationDate: {
      type: Date,
      required: [true, "Activation date is required"],
      default: () => new Date(),
    },
    currency: {
      type: String,
      enum: {
        values: ["USD", "INR", "EUR", "GBP"],
        message: "Currency must be USD, INR, EUR, or GBP",
      },
      required: [true, "Currency is required"],
      default: "USD",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate budgets for same category in same period
budgetSchema.index({ userId: 1, categoryId: 1, frequency: 1 }, { unique: true });

const Budget =
  models?.Budget || mongoose.model<IBudgetModal>("Budget", budgetSchema);

export default Budget;
