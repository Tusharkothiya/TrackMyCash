"use client";

import { useState } from "react";
import { Plus, Wallet as WalletIcon } from "lucide-react";
import { Account, AccountCard } from "./components/AccountCard";
import AddAccountModal from "./components/AddAccountModal";

const INITIAL_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Chase Sapphire Checking",
    type: "Bank",
    balance: 84200.5,
    monthlyIncome: 9500.0,
    monthlyExpense: 4210.0,
    color: "#2563eb",
    icon: "bank",
  },
  {
    id: "2",
    name: "Amex Platinum",
    type: "Credit Card",
    balance: 12450.92,
    monthlyIncome: 0.0,
    monthlyExpense: 2840.1,
    color: "#ffb596",
    icon: "credit_card",
  },
  {
    id: "3",
    name: "Crypto Ledger",
    type: "Wallet",
    balance: 45800.0,
    monthlyIncome: 2900.0,
    monthlyExpense: 120.0,
    color: "#4ade80",
    icon: "bitcoin",
  },
  {
    id: "4",
    name: "Emergency Cash",
    type: "Cash",
    balance: 399.0,
    monthlyIncome: 0.0,
    monthlyExpense: 950.4,
    color: "#c3c6d7",
    icon: "cash",
  },
];

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalBalance = accounts.reduce((acc, curr) => {
    if (curr.type === "Credit Card") return acc - curr.balance;
    return acc + curr.balance;
  }, 0);

  const totalMonthlyIn = accounts.reduce(
    (acc, curr) => acc + curr.monthlyIncome,
    0,
  );
  const totalMonthlyOut = accounts.reduce(
    (acc, curr) => acc + curr.monthlyExpense,
    0,
  );

  const handleAddAccount = (newAccount: Omit<Account, "id">) => {
    const account: Account = {
      ...newAccount,
      id: Math.random().toString(36).substring(7),
    };
    setAccounts([...accounts, account]);
  };

  return (
    <div>
      <main className=" min-h-screen relative overflow-hidden flex flex-col max-w-7xl mx-auto">
        {/* Background Decoration */}
        <div className="fixed top-0 right-0 -z-10 w-150 h-150 bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="fixed bottom-0 left-65 -z-10 w-100 h-100 bg-tertiary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

        {/* Action Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1 block">
              Global Overview
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
              Financial Assets
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
             className="bg-linear-to-br cursor-pointer from-primary-container to-primary text-on-primary-fixed px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary-container/20"
          >
            <Plus size={20} />
            Add Account
          </button>
        </div>

        {/* Summary Bar */}
        <section className="mb-10 p-8 rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-full bg-primary-container/10 text-primary">
              <WalletIcon size={32} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
                Total Combined Balance
              </span>
              <div className="text-3xl font-black text-on-surface mt-1">
                $
                {totalBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
          <div className="flex gap-12 items-center h-full border-l border-outline-variant/20 pl-12">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Monthly In
              </span>
              <div className="text-xl font-bold text-[#4ade80] mt-0.5">
                +$
                {totalMonthlyIn.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Monthly Out
              </span>
              <div className="text-xl font-bold text-error mt-0.5">
                -$
                {totalMonthlyOut.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Account Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>

        
      </main>

      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAccount}
      />
    </div>
  );
};

export default Accounts;
