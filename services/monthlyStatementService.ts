/**
 * Monthly Statement Service
 * Generates and sends monthly statement emails to all users
 */

import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { logger } from '@/lib/logger';
import User from '@/models/Users.model';
import Transaction from '@/models/Transactions.model';
import Account from '@/models/Accounts.model';
import Category from '@/models/Categories.model';
import Budget from '@/models/Budgets.model';
import {
  buildMonthlyStatementEmail,
  buildMonthlyStatementEmailSubject,
  type MonthlyStatementData,
} from '@/lib/email/monthlyStatementTemplate';

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const appName = process.env.APP_NAME || 'TrackMyCash';
const fromName = process.env.EMAIL_FROM_NAME || appName;
const fromAddress = process.env.EMAIL_FROM_ADDRESS || smtpUser || 'noreply@example.com';
const replyTo = process.env.EMAIL_REPLY_TO || fromAddress;
const resolvedFromAddress = smtpHost.includes('gmail.com') ? smtpUser || fromAddress : fromAddress;

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_USER and SMTP_PASS are required to send emails');
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

export const monthlyStatementService = {
  /**
   * Generate monthly statement data for a user
   */
  generateMonthlyStatement: async (userId: string): Promise<MonthlyStatementData | null> => {
    try {
      const user = await User.findById(userId).select('fullName country email');
      if (!user) return null;

      // Get current month range
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Fetch transactions for this month
      const transactions = await Transaction.find({
        userId,
        transactionDate: {
          $gte: firstDay,
          $lte: lastDay,
        },
      }).sort({ transactionDate: -1 });

      if (!transactions || transactions.length === 0) {
        await logger.info(`No transactions found for user ${userId} in ${now.toISOString().split('T')[0]}`);
        return null;
      }

      // Fetch category details
      const categoryIds = transactions
        .map((t: any) => t.categoryId)
        .filter((id: any) => id);

      let categoryNameMap: { [key: string]: string } = {};
      if (categoryIds.length > 0) {
        const categories = await Category.find({ _id: { $in: categoryIds } });
        categories.forEach((cat: any) => {
          categoryNameMap[cat._id.toString()] = cat.name;
        });
      }

      // Fetch account names
      const accountIds = transactions
        .map((t: any) => t.accountId)
        .filter((id: any) => id);

      let accountNameMap: { [key: string]: string } = {};
      if (accountIds.length > 0) {
        const accountsList = await Account.find({ _id: { $in: accountIds } });
        accountsList.forEach((acc: any) => {
          accountNameMap[acc._id.toString()] = acc.name;
        });
      }

      // Calculate totals
      let totalIncome = 0;
      let totalExpenses = 0;
      const categorySpending: { [key: string]: number } = {};
      const transactionList: any[] = [];

      for (const tx of transactions) {
        const amount = Number(tx.amount);

        if (tx.type === 'Income') {
          totalIncome += amount;
        } else if (tx.type === 'Expense') {
          totalExpenses += amount;
          const categoryId = tx.categoryId?.toString();
          const categoryName = categoryId ? categoryNameMap[categoryId] : 'Uncategorized';
          categorySpending[categoryName] = (categorySpending[categoryName] || 0) + amount;
        }

        // Add to transaction list
        const accountId = tx.accountId?.toString();
        const accountName = accountId ? accountNameMap[accountId] : 'Unknown Account';
        const categoryId = tx.categoryId?.toString();
        const categoryName = categoryId ? categoryNameMap[categoryId] : undefined;

        transactionList.push({
          title: tx.title,
          amount,
          type: tx.type,
          category: categoryName,
          date: tx.transactionDate,
          accountName,
        });
      }

      // Fetch account balances
      const accounts = await Account.find({ userId }).select('name balance');
      const accountSummary = accounts.map((acc: any) => ({
        name: acc.name || 'Account',
        balance: Number(acc.balance) || 0,
      }));

      // Generate category breakdown
      const topCategories = Object.entries(categorySpending)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, total]) => ({
          name,
          total,
          percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
        }));

      const month = now.toLocaleString('default', { month: 'long', year: 'numeric' });
      const currency = user.country === 'US' ? 'USD' : 'INR';
      const netBalance = totalIncome - totalExpenses;

      return {
        fullName: user.fullName || 'User',
        month,
        totalIncome,
        totalExpenses,
        netBalance,
        currency,
        transactionCount: transactions.length,
        topCategories,
        accountSummary,
        transactions: transactionList,
      };
    } catch (error) {
      await logger.error(`Error generating monthly statement for user ${userId}:`, error);
      return null;
    }
  },

  /**
   * Send monthly statement email to a single user with PDF attachment
   */
  sendMonthlyStatement: async (userEmail: string, statementData: MonthlyStatementData): Promise<boolean> => {
    try {
      const html = buildMonthlyStatementEmail(statementData);
      const subject = buildMonthlyStatementEmailSubject();

      // Generate PDF with statement data
      const { generateMonthlyStatementPDF } = await import('@/lib/email/monthlyStatementPDF');
      const pdfBuffer = await generateMonthlyStatementPDF(statementData);

      const plainText = `
Monthly Statement for ${statementData.month}

Income: ${statementData.totalIncome.toFixed(2)} ${statementData.currency}
Expenses: ${statementData.totalExpenses.toFixed(2)} ${statementData.currency}
Net Balance: ${statementData.netBalance.toFixed(2)} ${statementData.currency}

Total Transactions: ${statementData.transactionCount}

Please see the attached PDF for your detailed statement.
      `;

      const mailTransporter = getTransporter();

      await mailTransporter.sendMail({
        from: `${fromName} <${resolvedFromAddress}>`,
        to: userEmail,
        replyTo,
        subject,
        text: plainText,
        html,
        attachments: [
          {
            filename: `TrackMyCash_Statement_${statementData.month.replace(' ', '_')}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

      await logger.info(`Monthly statement with PDF sent to ${userEmail}`);
      return true;
    } catch (error) {
      await logger.error(`Error sending monthly statement to ${userEmail}:`, error);
      return false;
    }
  },

  /**
   * Reset all monthly budgets to start fresh tracking for the new month
   * Updates activationDate to the first day of current month
   */
  resetMonthlyBudgets: async (): Promise<number> => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const result = await Budget.updateMany(
        { frequency: 'Monthly' },
        { activationDate: firstDayOfMonth },
      );

      await logger.info(
        `Reset ${result.modifiedCount} monthly budgets for new tracking period`,
      );

      return result.modifiedCount;
    } catch (error) {
      await logger.error('Error resetting monthly budgets:', error);
      return 0;
    }
  },

  /**
   * Send monthly statements to all users
   * Called by monthly cron job
   */
  sendMonthlyStatementsToAllUsers: async (): Promise<{
    success: boolean;
    sent: number;
    failed: number;
    total: number;
  }> => {
    try {
      const users = await User.find({ email: { $exists: true, $ne: null } }).select('_id email fullName');

      let sent = 0;
      let failed = 0;

      await logger.info(`Starting monthly statement sending to ${users.length} users`);

      for (const user of users) {
        try {
          // Generate statement
          const statementData = await monthlyStatementService.generateMonthlyStatement(user._id.toString());

          if (!statementData) {
            // Skip users with no transactions this month
            continue;
          }

          // Send email
          const emailSent = await monthlyStatementService.sendMonthlyStatement(user.email, statementData);

          if (emailSent) {
            sent++;
          } else {
            failed++;
          }

          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          await logger.error(`Error processing statement for user ${user._id}:`, error);
          failed++;
        }
      }

      const message = `Monthly statements completed: ${sent} sent, ${failed} failed, ${users.length - sent - failed} skipped`;
      await logger.info(message);

      // Reset all monthly budgets for new tracking period
      const budgetsReset = await monthlyStatementService.resetMonthlyBudgets();

      return {
        success: failed === 0,
        sent,
        failed,
        total: users.length,
      };
    } catch (error) {
      await logger.error('Error sending monthly statements to all users:', error);
      return {
        success: false,
        sent: 0,
        failed: 0,
        total: 0,
      };
    }
  },
};
