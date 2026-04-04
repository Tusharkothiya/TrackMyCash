import mongoose, { Document, models, Types } from "mongoose";

export interface IAccountModal extends Document {
  userId: Types.ObjectId;
  name: string;
  type: "Bank" | "Credit Card" | "Wallet" | "Cash";
  currency: "USD" | "INR" | "EUR" | "GBP";
  balance: number;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new mongoose.Schema<IAccountModal>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
      minlength: [2, "Account name must be at least 2 characters long"],
      maxlength: [100, "Account name must be less than 100 characters long"],
    },
    type: {
      type: String,
      enum: {
        values: ["Bank", "Credit Card", "Wallet", "Cash"],
        message: "Account type must be Bank, Credit Card, Wallet, or Cash",
      },
      required: [true, "Account type is required"],
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
    balance: {
      type: Number,
      required: [true, "Balance is required"],
      default: 0,
      min: [-999999999.99, "Balance cannot be less than -999999999.99"],
      max: [999999999.99, "Balance cannot be more than 999999999.99"],
    },
    color: {
      type: String,
      required: [true, "Account color is required"],
      trim: true,
      match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Color must be a valid hex code"],
    },
    icon: {
      type: String,
      required: [true, "Account icon is required"],
      trim: true,
      enum: {
        values: ["bank", "credit_card", "wallet", "cash"],
        message: "Icon must be bank, credit_card, wallet, or cash",
      },
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ userId: 1, name: 1 }, { unique: true });

const Account =
  models?.Account || mongoose.model<IAccountModal>("Account", accountSchema);

export default Account;
