import mongoose, { Document, models, Types } from "mongoose";

export interface IEmailTaskModal extends Document {
  userId: Types.ObjectId;
  transactionId: Types.ObjectId;
  recipientEmail: string;
  type: "TRANSACTION_CREATED" | "TRANSACTION_UPDATED" | "TRANSACTION_DELETED";
  status: "PENDING" | "SENT" | "FAILED" | "CANCELLED";
  scheduledFor: Date;
  sentAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const emailTaskSchema = new mongoose.Schema<IEmailTaskModal>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: [true, "Transaction ID is required"],
      index: true,
    },
    recipientEmail: {
      type: String,
      required: [true, "Recipient email is required"],
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ["TRANSACTION_CREATED", "TRANSACTION_UPDATED", "TRANSACTION_DELETED"],
        message: "Type must be TRANSACTION_CREATED, TRANSACTION_UPDATED, or TRANSACTION_DELETED",
      },
      required: [true, "Email task type is required"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "SENT", "FAILED", "CANCELLED"],
        message: "Status must be PENDING, SENT, FAILED, or CANCELLED",
      },
      required: [true, "Email task status is required"],
      default: "PENDING",
      index: true,
    },
    scheduledFor: {
      type: Date,
      required: [true, "Scheduled time is required"],
      index: true,
    },
    sentAt: {
      type: Date,
      required: false,
    },
    failureReason: {
      type: String,
      required: false,
    },
    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
      min: 0,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Email data is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying of pending tasks
emailTaskSchema.index({ status: 1, scheduledFor: 1 });
emailTaskSchema.index({ transactionId: 1, type: 1 });

const EmailTask =
  models.EmailTask || mongoose.model<IEmailTaskModal>("EmailTask", emailTaskSchema);

export default EmailTask;
