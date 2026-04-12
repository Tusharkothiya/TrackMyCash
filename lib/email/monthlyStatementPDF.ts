import PDFDocument from 'pdfkit';
import type { MonthlyStatementData } from './monthlyStatementTemplate';

const appName = process.env.APP_NAME || 'TrackMyCash';

interface TableRow {
  [key: string]: string | number;
}

/**
 * Get currency symbol from currency code
 */
function getCurrencySymbol(currency: string): string {
  const symbols: { [key: string]: string } = {
    INR: 'Rs.',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };
  return symbols[currency] || currency;
}

/**
 * Draw a bordered table on PDF
 */
function drawTable(
  doc: InstanceType<typeof PDFDocument>,
  startX: number,
  startY: number,
  columns: { name: string; width: number; align?: 'left' | 'right' | 'center' }[],
  rows: TableRow[],
  headerBgColor: string = '#e8e8e8'
): number {
  const rowHeight = 18;
  const borderColor = '#333333';
  const textColor = '#000000';
  let currentY = startY;

  // Calculate total width
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  // Draw header
  doc.fillColor(headerBgColor);
  doc.rect(startX, currentY, totalWidth, rowHeight).fill();

  // Header text
  doc.fillColor(textColor);
  doc.fontSize(7).font('Helvetica-Bold');
  let currentX = startX;
  columns.forEach((col) => {
    doc.text(col.name, currentX + 4, currentY + 4, {
      width: col.width - 8,
      align: col.align || 'left',
      height: rowHeight - 8,
    });
    currentX += col.width;
  });

  currentY += rowHeight;

  // Draw rows
  doc.fontSize(6).font('Helvetica');
  rows.forEach((row, rowIndex) => {
    currentX = startX;
    const isEvenRow = rowIndex % 2 === 0;

    // Alternate row background
    if (isEvenRow) {
      doc.fillColor('#f5f5f5');
      doc.rect(startX, currentY, totalWidth, rowHeight).fill();
    }

    // Draw row borders and text
    doc.strokeColor(borderColor).lineWidth(0.5);
    currentX = startX;
    columns.forEach((col) => {
      // Draw cell borders
      doc.rect(currentX, currentY, col.width, rowHeight).stroke();

      // Draw cell text
      doc.fillColor(textColor);
      doc.text(String(row[col.name.toLowerCase().replace(/\s+/g, '')]), currentX + 4, currentY + 4, {
        width: col.width - 8,
        align: col.align || 'left',
        height: rowHeight - 8,
      });

      currentX += col.width;
    });

    currentY += rowHeight;
  });

  return currentY;
}

export async function generateMonthlyStatementPDF(
  data: MonthlyStatementData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 30,
      bufferPages: true,
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on('error', (error: Error) => {
      reject(error);
    });

    try {
      const leftMargin = 30;
      const pageWidth = 595 - 60;

      // ===== HEADER =====
      doc.fontSize(16).font('Helvetica-Bold').text(appName, leftMargin, 25, {
        align: 'left',
      });
      doc.fontSize(9).font('Helvetica').text('MONTHLY TRANSACTION STATEMENT', leftMargin, 42, {
        align: 'left',
      });

      doc.moveTo(leftMargin, 55).lineTo(leftMargin + pageWidth, 55).stroke('#333333').lineWidth(1);

      let currentY = 65;

      // ===== STATEMENT MONTH HEADER =====
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#333333');
      doc.text(data.month.toUpperCase(), leftMargin, currentY);
      currentY += 20;

      // ===== SUMMARY SECTION - 2 COLUMNS =====
      doc.fontSize(8).font('Helvetica-Bold').text('STATEMENT SUMMARY', leftMargin, currentY);
      currentY += 12;

      doc.fontSize(7).font('Helvetica');
      const col1X = leftMargin;
      const col2X = leftMargin + pageWidth / 2;
      const currencySymbol = getCurrencySymbol(data.currency);

      doc.text('Total Income:', col1X, currentY);
      doc.text(`+${currencySymbol} ${data.totalIncome.toFixed(2)}`, col1X + 120, currentY, {
        align: 'right',
        width: 80,
      });

      doc.text('Total Expenses:', col2X, currentY);
      doc.text(`${currencySymbol} ${data.totalExpenses.toFixed(2)}`, col2X + 120, currentY, {
        align: 'right',
        width: 80,
      });

      currentY += 12;
      doc.text('Net Balance:', col1X, currentY);
      doc.text(
        `${data.netBalance >= 0 ? '+' : ''}${currencySymbol} ${data.netBalance.toFixed(2)}`,
        col1X + 120,
        currentY,
        { align: 'right', width: 80 }
      );

      doc.text('Transactions:', col2X, currentY);
      doc.text(data.transactionCount.toString(), col2X + 120, currentY, {
        align: 'right',
        width: 80,
      });

      currentY += 18;

      // ===== TRANSACTIONS TABLE =====
      if (data.transactions && data.transactions.length > 0) {
        doc.fontSize(8).font('Helvetica-Bold').text('TRANSACTION DETAILS', leftMargin, currentY);
        currentY += 12;

        const transactionColumns = [
          { name: 'Date', width: 55, align: 'left' as const },
          { name: 'Description', width: 90, align: 'left' as const },
          { name: 'Category', width: 75, align: 'left' as const },
          { name: 'Type', width: 40, align: 'center' as const },
          { name: 'Amount', width: 70, align: 'right' as const },
          { name: 'Account', width: 80, align: 'left' as const },
        ];

        const tableRows: TableRow[] = data.transactions.map((txn) => {
          const dateStr = new Date(txn.date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          });

          const description = txn.title.length > 12 ? txn.title.substring(0, 10) + '..' : txn.title;
          const category = (txn.category || '-').substring(0, 10);
          const amountStr = `${txn.type === 'Income' ? '+' : '-'}${getCurrencySymbol(data.currency)} ${txn.amount.toFixed(2)}`;
          const account = txn.accountName.substring(0, 12);

          return {
            date: dateStr,
            description: description,
            category: category,
            type: txn.type.substring(0, 3),
            amount: amountStr,
            account: account,
          };
        });

        currentY = drawTable(doc, leftMargin, currentY, transactionColumns, tableRows, '#d0d0d0');
        currentY += 8;
      }

      // ===== TOP CATEGORIES =====
      if (data.topCategories && data.topCategories.length > 0) {
        doc.fontSize(8).font('Helvetica-Bold').text('TOP SPENDING CATEGORIES', leftMargin, currentY);
        currentY += 12;

        const categoryColumns = [
          { name: 'Category', width: 150, align: 'left' as const },
          { name: 'Amount', width: 100, align: 'right' as const },
          { name: 'Percentage', width: 80, align: 'right' as const },
        ];

        const categoryRows: TableRow[] = data.topCategories.map((cat) => ({
          category: cat.name,
          amount: `${getCurrencySymbol(data.currency)} ${cat.total.toFixed(2)}`,
          percentage: `${cat.percentage.toFixed(1)}%`,
        }));

        currentY = drawTable(doc, leftMargin, currentY, categoryColumns, categoryRows, '#d0d0d0');
        currentY += 8;
      }

      // ===== ACCOUNT BALANCES =====
      if (data.accountSummary && data.accountSummary.length > 0) {
        doc.fontSize(8).font('Helvetica-Bold').text('ACCOUNT BALANCES', leftMargin, currentY);
        currentY += 12;

        const accountColumns = [
          { name: 'Account', width: 200, align: 'left' as const },
          { name: 'Balance', width: 130, align: 'right' as const },
        ];

        const accountRows: TableRow[] = data.accountSummary.map((acc) => ({
          account: acc.name,
          balance: `${getCurrencySymbol(data.currency)} ${acc.balance.toFixed(2)}`,
        }));

        currentY = drawTable(doc, leftMargin, currentY, accountColumns, accountRows, '#d0d0d0');
        currentY += 8;
      }

      // ===== FOOTER =====
      currentY += 8;
      doc.fontSize(6).font('Helvetica').fillColor('#666666');
      doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, leftMargin, currentY, {
        align: 'center',
        width: pageWidth,
      });
      doc.text(`© 2026 ${appName}. All rights reserved.`, leftMargin, currentY + 10, {
        align: 'center',
        width: pageWidth,
      });

      doc.end();
    } catch (error) {
      doc.end();
      reject(error);
    }
  });
}
