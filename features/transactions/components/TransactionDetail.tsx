import { cn } from "@/lib/utils/helper";
import { Banknote, Calendar, ChevronRight, Edit2, Info, ReceiptText, Shapes, Trash2 } from "lucide-react";

export type TransactionStatus = "Completed" | "Pending" | "Failed";
export type TransactionType = "Expense" | "Income" | "Transfer";

export interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  account: string;
  status: TransactionStatus;
  type: TransactionType;
  amount: number;
  notes?: string;
  icon?: string;
}

export interface TransactionSummary {
  totalOutflow: number;
  totalInflow: number;
  netCashflow: number;
  outflowTrend: number;
  inflowTrend: number;
}

// --- Mock Data ---
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Apple Store Purchase",
    category: "Technology",
    date: "Oct 24, 2023",
    account: "Chase Checking",
    status: "Completed",
    type: "Expense",
    amount: 1299.0,
    icon: "shopping_bag",
  },
  {
    id: "2",
    title: "Monthly Salary",
    category: "Income",
    date: "Oct 20, 2023",
    account: "Wells Fargo",
    status: "Completed",
    type: "Income",
    amount: 8500.0,
    icon: "payments",
  },
  {
    id: "3",
    title: "Blue Hill Restaurant",
    category: "Dining",
    date: "Oct 19, 2023",
    account: "Chase Checking",
    status: "Pending",
    type: "Expense",
    amount: 245.5,
    icon: "restaurant",
  },
  {
    id: "4",
    title: "Electric Bill",
    category: "Utilities",
    date: "Oct 18, 2023",
    account: "Wells Fargo",
    status: "Completed",
    type: "Expense",
    amount: 112.1,
    icon: "bolt",
  },
  {
    id: "5",
    title: "Equinox Membership",
    category: "Health",
    date: "Oct 15, 2023",
    account: "Chase Checking",
    status: "Completed",
    type: "Expense",
    amount: 225.0,
    icon: "fitness_center",
  },
];

const TransactionDetail = ({
  transaction,
  onBack,
}: {
  transaction: Transaction;
  onBack: () => void;
}) => {
  return (
    <div className="space-y-10">
      {/* Detail Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
          <button
            onClick={onBack}
            className="hover:text-on-surface transition-colors"
          >
            Transactions
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-on-surface">{transaction.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold bg-surface-container-high text-on-surface hover:bg-surface-bright transition-all rounded-xl flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button className="px-4 py-2 text-sm font-semibold bg-error-container/20 text-error hover:bg-error-container/30 transition-all rounded-xl flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Hero Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex gap-2 mb-4">
            <span
              className={cn(
                "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5",
                transaction.status === "Completed"
                  ? "bg-primary/10 text-primary"
                  : "bg-on-surface-variant/10 text-on-surface-variant",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  transaction.status === "Completed"
                    ? "bg-primary"
                    : "bg-on-surface-variant/40",
                )}
              ></span>
              {transaction.status.toLowerCase()}
            </span>
            <span
              className={cn(
                "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5",
                transaction.type === "Income"
                  ? "bg-tertiary/10 text-tertiary"
                  : "bg-error/10 text-error",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  transaction.type === "Income" ? "bg-tertiary" : "bg-error",
                )}
              ></span>
              {transaction.type.toLowerCase()}
            </span>
          </div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
            Transaction Amount
          </p>
          <h2
            className={cn(
              "text-5xl font-black tracking-tight",
              transaction.type === "Income" ? "text-primary" : "text-error",
            )}
          >
            {transaction.type === "Income" ? "+" : "-"}$
            {transaction.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h2>
        </div>
        <div className="flex items-center gap-4 bg-surface-container p-4 rounded-xl">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <ReceiptText className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-on-surface text-sm font-bold">
              Standard {transaction.category}
            </p>
            <p className="text-on-surface-variant text-xs italic">
              Recurring monthly credit
            </p>
          </div>
        </div>
      </div>

      {/* Bento Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {[
            { label: "Category", value: transaction.category, icon: Shapes },
            { label: "Account", value: transaction.account, icon: Banknote },
            {
              label: "Date",
              value: transaction.date + " • 09:15 AM",
              icon: Calendar,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface-container p-6 rounded-xl flex items-center gap-4 group hover:bg-surface-bright transition-colors cursor-default"
            >
              <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-on-surface font-semibold">{item.value}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="bg-surface-container p-8 rounded-xl flex flex-col">
          <div className="mb-6">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-2">
              Transaction Title
            </p>
            <h3 className="text-xl font-bold text-on-surface">
              {transaction.title} - Oct 2023
            </h3>
          </div>
          <div className="mb-auto">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-2">
              Personal Notes
            </p>
            <p className="text-on-surface/80 leading-relaxed bg-surface-container-low p-4 rounded-lg">
              {transaction.notes ||
                "Final salary credit for the month of October including the quarterly performance bonus and healthcare adjustment."}
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            <div className="flex items-center gap-2 text-on-surface-variant text-[11px]">
              <Info className="w-4 h-4" />
              <span className="italic font-medium">
                Auto-parsed: Internal transfer from Employer ID #9921092
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Transactions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-on-surface">
            Related {transaction.category} Credits
          </h4>
          <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-hidden bg-surface-container rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Title
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {[
                {
                  date: "Sep 30, 2023",
                  title: `${transaction.title} - Sep 2023`,
                  amount: 4850.0,
                },
                {
                  date: "Aug 31, 2023",
                  title: `${transaction.title} - Aug 2023`,
                  amount: 4850.0,
                },
                {
                  date: "Jul 31, 2023",
                  title: `${transaction.title} - Jul 2023`,
                  amount: 4850.0,
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-surface-bright transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-on-surface">
                    {row.title}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary text-right">
                    +$
                    {row.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TransactionDetail;