import { buildCommonEmailTemplate } from "@/lib/email/emailTemplate";

export type TransactionEmailType = "CREATED" | "UPDATED" | "DELETED";

export interface TransactionEmailData {
  type: TransactionEmailType;
  fullName: string;
  transaction: {
    id: string;
    title: string;
    amount: number;
    currency: string;
    transactionType: "Expense" | "Income" | "Transfer";
    status: string;
    date: string;
    account?: string;
    destinationAccount?: string;
    category?: string;
    notes?: string;
  };
  previousValues?: {
    amount?: number;
    title?: string;
    category?: string;
    notes?: string;
  };
}

export const transactionEmailTemplates = {
  buildTransactionCreatedEmail: (data: TransactionEmailData): string => {
    const { fullName, transaction } = data;
    const greeting = `Hi ${fullName || "there"},`;

    const typeIcon =
      transaction.transactionType === "Income"
        ? "📥"
        : transaction.transactionType === "Expense"
          ? "📤"
          : "🔄";

    const contentHtml = `
      <p style="margin:0 0 15px;font-size:15px;line-height:1.6;">Your transaction has been recorded successfully.</p>
      
      <div style="margin:20px 0;padding:16px;border:1px solid #e0e0e0;background:#f9f9f9;border-radius:8px;">
        <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#1a1a1a;">${typeIcon} Transaction Details</h3>
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;width:40%;">Title:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.title}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Amount:</td>
            <td style="padding:8px 0;color:#1a1a1a;font-weight:600;">${transaction.amount.toLocaleString()} ${transaction.currency}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Type:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.transactionType}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Date:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.date}</td>
          </tr>
          ${
            transaction.account
              ? `
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Account:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.account}</td>
          </tr>
          `
              : ""
          }
          ${
            transaction.category
              ? `
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Category:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.category}</td>
          </tr>
          `
              : ""
          }
          ${
            transaction.notes
              ? `
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Notes:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.notes}</td>
          </tr>
          `
              : ""
          }
        </table>
      </div>

      <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#666;">You can view or edit this transaction anytime in your TrackMyCash dashboard.</p>
    `;

    return buildCommonEmailTemplate({
      title: "Transaction Created",
      greeting,
      intro: "Your transaction has been successfully recorded.",
      contentHtml,
      outro: "If you did not create this transaction, please contact us immediately.",
    });
  },

  buildTransactionUpdatedEmail: (data: TransactionEmailData): string => {
    const { fullName, transaction, previousValues } = data;
    const greeting = `Hi ${fullName || "there"},`;

    const changes: Array<{ field: string; from: string; to: string }> = [];

    if (previousValues?.amount && previousValues.amount !== transaction.amount) {
      changes.push({
        field: "Amount",
        from: `${previousValues.amount.toLocaleString()} ${transaction.currency}`,
        to: `${transaction.amount.toLocaleString()} ${transaction.currency}`,
      });
    }

    if (previousValues?.title && previousValues.title !== transaction.title) {
      changes.push({
        field: "Title",
        from: previousValues.title,
        to: transaction.title,
      });
    }

    if (previousValues?.category && previousValues.category !== transaction.category) {
      changes.push({
        field: "Category",
        from: previousValues.category,
        to: transaction.category || "None",
      });
    }

    if (previousValues?.notes && previousValues.notes !== transaction.notes) {
      changes.push({
        field: "Notes",
        from: previousValues.notes,
        to: transaction.notes || "None",
      });
    }

    const contentHtml = `
      <p style="margin:0 0 15px;font-size:15px;line-height:1.6;">Your transaction has been updated successfully.</p>
      
      <div style="margin:20px 0;padding:16px;background:#fff3cd;border:1px solid #ffc107;border-radius:8px;">
        <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#856404;">✏️ Updated Fields</h3>
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${changes
            .map(
              (change) => `
          <tr style="border-bottom:1px solid #ffe0b2;">
            <td style="padding:10px 0;color:#666;font-weight:500;width:30%;">${change.field}:</td>
            <td style="padding:10px 0;color:#999;text-decoration:line-through;">${change.from}</td>
            <td style="padding:10px 0;color:#1a1a1a;font-weight:600;">➜ ${change.to}</td>
          </tr>
          `
            )
            .join("")}
        </table>
      </div>

      <div style="margin:20px 0;padding:16px;border:1px solid #e0e0e0;background:#f9f9f9;border-radius:8px;">
        <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#1a1a1a;">📋 Current Details</h3>
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;width:40%;">Title:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.title}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Amount:</td>
            <td style="padding:8px 0;color:#1a1a1a;font-weight:600;">${transaction.amount.toLocaleString()} ${transaction.currency}</td>
          </tr>
        </table>
      </div>

      <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#666;">Review the updated details in your TrackMyCash dashboard.</p>
    `;

    return buildCommonEmailTemplate({
      title: "Transaction Updated",
      greeting,
      intro: "Your transaction has been successfully updated.",
      contentHtml,
      outro: "If you did not make this change, please contact us immediately.",
    });
  },

  buildTransactionDeletedEmail: (data: TransactionEmailData): string => {
    const { fullName, transaction } = data;
    const greeting = `Hi ${fullName || "there"},`;

    const contentHtml = `
      <p style="margin:0 0 15px;font-size:15px;line-height:1.6;">A transaction has been deleted from your account.</p>
      
      <div style="margin:20px 0;padding:16px;background:#f8d7da;border:1px solid #f5c6cb;border-radius:8px;">
        <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#721c24;">🗑️ Deleted Transaction Details</h3>
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;width:40%;">Title:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.title}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Amount:</td>
            <td style="padding:8px 0;color:#1a1a1a;font-weight:600;">${transaction.amount.toLocaleString()} ${transaction.currency}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Type:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.transactionType}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Date:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.date}</td>
          </tr>
          ${
            transaction.account
              ? `
          <tr>
            <td style="padding:8px 0;color:#666;font-weight:500;">Account:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${transaction.account}</td>
          </tr>
          `
              : ""
          }
        </table>
      </div>

      <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#666;">This action has been completed. The account balance has been updated accordingly.</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#666;">If you did not delete this transaction or have concerns, please contact our support team.</p>
    `;

    return buildCommonEmailTemplate({
      title: "Transaction Deleted",
      greeting,
      intro: "A transaction has been removed from your account.",
      contentHtml,
      outro: "If you need to restore this transaction, please contact support.",
    });
  },

  buildTransactionEmailSubject: (type: TransactionEmailType): string => {
    const subjects = {
      CREATED: "New Transaction Recorded - TrackMyCash",
      UPDATED: "Transaction Updated - TrackMyCash",
      DELETED: "Transaction Deleted - TrackMyCash",
    };
    return subjects[type];
  },
};
