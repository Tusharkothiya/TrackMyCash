import nodemailer from "nodemailer";
import mongoose, { Types } from "mongoose";
import { logger } from "@/lib/logger";
import EmailTask from "@/models/EmailTask.model";
import {
  transactionEmailTemplates,
  type TransactionEmailData,
} from "@/lib/email/transactionEmailTemplate";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const appName = process.env.APP_NAME || "TrackMyCash";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const fromName = process.env.EMAIL_FROM_NAME || appName;
const fromAddress = process.env.EMAIL_FROM_ADDRESS || smtpUser || "noreply@example.com";
const replyTo = process.env.EMAIL_REPLY_TO || fromAddress;
const resolvedFromAddress = smtpHost.includes("gmail.com")
  ? smtpUser || fromAddress
  : fromAddress;

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!smtpUser || !smtpPass) {
    throw new Error("SMTP_USER and SMTP_PASS are required to send emails");
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
};

interface CreateTransactionEmailTaskInput {
  userId: Types.ObjectId;
  transactionId: Types.ObjectId;
  recipientEmail: string;
  type: "TRANSACTION_CREATED" | "TRANSACTION_UPDATED" | "TRANSACTION_DELETED";
  data: TransactionEmailData;
  delayMinutes?: number;
}

interface SendTransactionEmailInput {
  recipientEmail: string;
  data: TransactionEmailData;
}

export const transactionEmailService = {
  /**
   * Create an email task to be sent after specified delay
   * This is called after transaction is created/updated/deleted
   * The actual sending is handled by the cron job API route
   */
  createEmailTask: async (
    input: CreateTransactionEmailTaskInput
  ): Promise<{ flag: boolean; data?: any; status?: number }> => {
    try {
      const delayMinutes = input.delayMinutes || 1; // Default 1 minute delay
      const scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000);

      const emailTask = await EmailTask.create({
        userId: input.userId,
        transactionId: input.transactionId,
        recipientEmail: input.recipientEmail,
        type: input.type,
        status: "PENDING",
        scheduledFor,
        retryCount: 0,
        maxRetries: 3,
        data: input.data,
      });

      await logger.info(
        `Email task created for transaction ${input.transactionId} to be sent at ${scheduledFor}`
      );

      return {
        flag: true,
        data: emailTask,
      };
    } catch (error) {
      await logger.error("Error creating email task:", error);
      return {
        flag: false,
        data: "email.taskCreationFailed",
        status: 500,
      };
    }
  },

  /**
   * Send a transaction email immediately
   * Used by the cron job processor
   */
  sendTransactionEmail: async (
    input: SendTransactionEmailInput
  ): Promise<{ flag: boolean; data?: any; status?: number }> => {
    try {
      const { recipientEmail, data } = input;
      const type = data.type.toUpperCase().replace("CREATED", "CREATED").replace("UPDATED", "UPDATED").replace("DELETED", "DELETED");

      const emailSubject = transactionEmailTemplates.buildTransactionEmailSubject(
        type as "CREATED" | "UPDATED" | "DELETED"
      );

      let html: string;

      switch (type) {
        case "CREATED":
          html = transactionEmailTemplates.buildTransactionCreatedEmail(data);
          break;
        case "UPDATED":
          html = transactionEmailTemplates.buildTransactionUpdatedEmail(data);
          break;
        case "DELETED":
          html = transactionEmailTemplates.buildTransactionDeletedEmail(data);
          break;
        default:
          return {
            flag: false,
            data: "email.unknownEmailType",
            status: 400,
          };
      }

      const plainText = `
Transaction ${data.type.toLowerCase()}: ${data.transaction.title}
Amount: ${data.transaction.amount} ${data.transaction.currency}
Type: ${data.transaction.transactionType}
Date: ${data.transaction.date}

Please visit ${appUrl} to manage your transactions.
      `;

      const mailTransporter = getTransporter();

      await mailTransporter.sendMail({
        from: `${fromName} <${resolvedFromAddress}>`,
        to: recipientEmail,
        replyTo,
        subject: emailSubject,
        text: plainText,
        html,
      });

      await logger.info(
        `Transaction email (${type}) sent successfully to ${recipientEmail}`
      );

      return {
        flag: true,
        data: { message: "Email sent successfully" },
      };
    } catch (error) {
      await logger.error("Error sending transaction email:", error);
      return {
        flag: false,
        data: "email.sendingFailed",
        status: 500,
      };
    }
  },

  /**
   * Process all pending email tasks that are due
   * This should be called by a cron job (external service like EasyCron)
   * Returns the count of processed emails
   */
  processPendingEmailTasks: async (): Promise<{
    flag: boolean;
    data?: { processed: number; sent: number; failed: number };
    status?: number;
  }> => {
    const session = await mongoose.startSession();

    try {
      const now = new Date();

      // Find all pending tasks that are due to be sent
      const pendingTasks = await EmailTask.find({
        status: "PENDING",
        scheduledFor: { $lte: now },
      })
        .limit(100) // Process max 100 tasks per execution
        .session(session);

      let sent = 0;
      let failed = 0;

      for (const task of pendingTasks) {
        try {
          // Check if transaction still exists (not deleted)
          const Transaction = mongoose.model("Transaction");
          const transactionExists = await Transaction.findById(task.transactionId);

          if (!transactionExists) {
            // Transaction was deleted, cancel the email task
            task.status = "CANCELLED";
            await task.save({ session });
            await logger.info(
              `Email task cancelled for deleted transaction ${task.transactionId}`
            );
            continue;
          }

          // Send the email
          const sendResult = await transactionEmailService.sendTransactionEmail({
            recipientEmail: task.recipientEmail,
            data: task.data as any,
          });

          if (sendResult.flag) {
            task.status = "SENT";
            task.sentAt = new Date();
            task.retryCount = 0;
            await task.save({ session });
            sent++;

            // Update transaction email status
            transactionExists.emailStatus = "SENT";
            await transactionExists.save({ session });
          } else {
            // Retry logic
            task.retryCount = (task.retryCount || 0) + 1;

            if (task.retryCount >= task.maxRetries) {
              task.status = "FAILED";
              task.failureReason = "Max retries exceeded";
            } else {
              // Schedule for retry in 5 minutes
              task.scheduledFor = new Date(Date.now() + 5 * 60 * 1000);
            }

            await task.save({ session });
            failed++;
          }
        } catch (taskError) {
          await logger.error(`Error processing email task ${task._id}:`, taskError);
          task.retryCount = (task.retryCount || 0) + 1;

          if (task.retryCount >= task.maxRetries) {
            task.status = "FAILED";
            task.failureReason = String(taskError);
          } else {
            task.scheduledFor = new Date(Date.now() + 5 * 60 * 1000);
          }

          await task.save({ session });
          failed++;
        }
      }

      await logger.info(
        `Email task processing complete: ${sent} sent, ${failed} failed out of ${pendingTasks.length} tasks`
      );

      return {
        flag: true,
        data: {
          processed: pendingTasks.length,
          sent,
          failed,
        },
      };
    } catch (error) {
      await logger.error("Error processing email tasks:", error);
      return {
        flag: false,
        status: 500,
      };
    } finally {
      await session.endSession();
    }
  },

  /**
   * Cancel pending email task for a transaction
   * Called when transaction is deleted between scheduling and sending
   */
  cancelEmailTask: async (transactionId: Types.ObjectId): Promise<void> => {
    try {
      await EmailTask.updateMany(
        {
          transactionId,
          status: "PENDING",
        },
        {
          status: "CANCELLED",
        }
      );

      await logger.info(`Email tasks cancelled for transaction ${transactionId}`);
    } catch (error) {
      await logger.error(`Error cancelling email tasks for ${transactionId}:`, error);
    }
  },
};
