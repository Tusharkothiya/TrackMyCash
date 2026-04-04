import mongoose, { Document, models, Types } from "mongoose";

export interface ICategoryModal extends Document {
  userId: Types.ObjectId;
  name: string;
  nameKey: string;
  icon: string;
  color: string;
  type: "expense" | "income";
  overline?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<ICategoryModal>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters long"],
      maxlength: [60, "Category name must be less than 60 characters long"],
    },
    nameKey: {
      type: String,
      required: [true, "Category key is required"],
      trim: true,
      lowercase: true,
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Category color is required"],
      trim: true,
      match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Color must be a valid hex code"],
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: [true, "Category type is required"],
      default: "expense",
    },
    overline: {
      type: String,
      trim: true,
      maxlength: [80, "Overline must be less than 80 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ userId: 1, nameKey: 1, type: 1 }, { unique: true });

const Category =
  models?.Category || mongoose.model<ICategoryModal>("Category", categorySchema);

export default Category;
