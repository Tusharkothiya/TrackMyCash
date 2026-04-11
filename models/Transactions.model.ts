import mongoose, { Document, models, Types } from "mongoose";

export interface ITransactionModal extends Document {
  userId: Types.ObjectId;
  title: string;
  amount: number;
  type: "Expense" | "Income" | "Transfer";
  status: "Completed" | "Pending" | "Failed";
  transactionDate: Date;
  accountId: Types.ObjectId;
  destinationAccountId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  currency: "USD" | "INR" | "EUR" | "GBP";
  notes?: string;
  receiptUrl?: string;
  emailTaskId?: Types.ObjectId;
  emailStatus?: "PENDING" | "SENT" | "CANCELLED";
  emailScheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema<ITransactionModal>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
      minlength: [2, "Transaction title must be at least 2 characters long"],
      maxlength: [150, "Transaction title must be less than 150 characters long"],
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0.01, "Transaction amount must be greater than 0"],
      max: [999999999.99, "Transaction amount must be less than or equal to 999999999.99"],
    },
    type: {
      type: String,
      enum: {
        values: ["Expense", "Income", "Transfer"],
        message: "Type must be Expense, Income, or Transfer",
      },
      required: [true, "Transaction type is required"],
      default: "Expense",
    },
    status: {
      type: String,
      enum: {
        values: ["Completed", "Pending", "Failed"],
        message: "Status must be Completed, Pending, or Failed",
      },
      required: [true, "Transaction status is required"],
      default: "Completed",
    },
    transactionDate: {
      type: Date,
      required: [true, "Transaction date is required"],
      index: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account ID is required"],
      index: true,
    },
    destinationAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: false,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      index: true,
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
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes must be less than 1000 characters long"],
    },
    receiptUrl: {
      type: String,
      trim: true,
      maxlength: [500, "Receipt URL must be less than 500 characters long"],
    },
    emailTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTask",
      required: false,
      index: true,
    },
    emailStatus: {
      type: String,
      enum: {
        values: ["PENDING", "SENT", "CANCELLED"],
        message: "Email status must be PENDING, SENT, or CANCELLED",
      },
      default: "PENDING",
      index: true,
    },
    emailScheduledAt: {
      type: Date,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, accountId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, categoryId: 1, transactionDate: -1 });

const Transaction =
  models?.Transaction || mongoose.model<ITransactionModal>("Transaction", transactionSchema);

export default Transaction;
