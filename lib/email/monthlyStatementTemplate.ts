/**
 * Monthly Statement Email Template
 * Generates HTML email with monthly transaction summary using common template
 */

import { buildCommonEmailTemplate } from '@/lib/email/emailTemplate';

export interface MonthlyStatementData {
  fullName: string;
  month: string; // e.g., "January 2026"
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
  transactionCount: number;
  topCategories: Array<{
    name: string;
    total: number;
    percentage: number;
  }>;
  accountSummary: Array<{
    name: string;
    balance: number;
  }>;
  transactions?: Array<{
    title: string;
    amount: number;
    type: 'Income' | 'Expense' | 'Transfer';
    category?: string;
    date: Date;
    accountName: string;
  }>;
}

export const buildMonthlyStatementEmail = (data: MonthlyStatementData): string => {
  const {
    fullName,
    month,
    totalIncome,
    totalExpenses,
    netBalance,
    currency,
    transactionCount,
    topCategories,
    accountSummary,
  } = data;

  const isPositiveBalance = netBalance >= 0;
  const balanceColor = isPositiveBalance ? '#10b981' : '#ef4444';

  // Build content HTML
  let contentHtml = `
    <p style="margin:0 0 15px;font-size:15px;line-height:1.6;color:#4a5a78;">Here's your monthly transaction summary with detailed spending analysis.</p>
    
    <div style="margin:20px 0;padding:16px;border:1px solid #e5eaf3;background:#f8faff;border-radius:10px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
        <tr>
          <td style="padding:8px 0;color:#5f6f8d;font-weight:700;">💰 Total Income</td>
          <td style="padding:8px 0;text-align:right;color:#10b981;font-weight:700;font-size:16px;">+${currency} ${totalIncome.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#5f6f8d;font-weight:700;">📤 Total Expenses</td>
          <td style="padding:8px 0;text-align:right;color:#ef4444;font-weight:700;font-size:16px;">-${currency} ${totalExpenses.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#5f6f8d;font-weight:700;border-top:1px solid #e5eaf3;margin-top:8px;">💳 Net Balance</td>
          <td style="padding:8px 0;text-align:right;color:${balanceColor};font-weight:700;font-size:18px;border-top:1px solid #e5eaf3;margin-top:8px;">${isPositiveBalance ? '+' : ''}${currency} ${netBalance.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div style="margin:20px 0;padding:14px;background:#f3f8ff;border-left:4px solid #0ea5e9;border-radius:6px;">
      <p style="margin:0;font-size:14px;color:#0f3d6e;"><strong>📊 Transactions:</strong> You recorded <strong>${transactionCount}</strong> transaction${transactionCount !== 1 ? 's' : ''} this month</p>
    </div>

    ${
      topCategories && topCategories.length > 0
        ? `
    <div style="margin:20px 0;padding:16px;border:1px solid #e5eaf3;background:#f8faff;border-radius:10px;">
      <h3 style="margin:0 0 15px;font-size:16px;color:#0f2f57;font-weight:700;">📁 Top Spending Categories</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;">
        ${topCategories
          .map(
            (cat) => `
        <tr>
          <td style="padding:10px 0;color:#5f6f8d;font-weight:600;width:40%;">${cat.name}</td>
          <td style="padding:10px 0;text-align:right;color:#1f2a44;font-weight:600;">${currency} ${cat.total.toFixed(2)}</td>
          <td style="padding:10px 0 10px 12px;text-align:right;color:#8a96ad;width:50px;">${cat.percentage.toFixed(0)}%</td>
        </tr>
        `
          )
          .join('')}
      </table>
    </div>
    `
        : ''
    }

    ${
      accountSummary && accountSummary.length > 0
        ? `
    <div style="margin:20px 0;padding:16px;border:1px solid #e5eaf3;background:#f8faff;border-radius:10px;">
      <h3 style="margin:0 0 15px;font-size:16px;color:#0f2f57;font-weight:700;">🏦 Account Balances</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;">
        ${accountSummary
          .map(
            (acc) => `
        <tr>
          <td style="padding:10px 0;color:#5f6f8d;font-weight:600;">${acc.name}</td>
          <td style="padding:10px 0;text-align:right;color:#1f2a44;font-weight:700;">${currency} ${acc.balance.toFixed(2)}</td>
        </tr>
        `
          )
          .join('')}
      </table>
    </div>
    `
        : ''
    }

    <div style="margin:18px 0 0;text-align:center;">
      <a href="https://track-my-cash-two.vercel.app" style="display:inline-block;padding:12px 24px;border-radius:10px;background:#165aa7;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">View Full Report</a>
    </div>
  `;

  return buildCommonEmailTemplate({
    title: `📊 Monthly Statement - ${month}`,
    greeting: `Hi ${fullName},`,
    intro: `Here's your transaction summary for ${month}. See your spending patterns, income, and account balances at a glance.`,
    contentHtml,
    outro: `You can view or edit your transactions anytime in your TrackMyCash dashboard. If you have any questions, contact our support team.`,
  });
};

export const buildMonthlyStatementEmailSubject = (): string => {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  return `Your ${month} Transaction Summary - TrackMyCash`;
};
