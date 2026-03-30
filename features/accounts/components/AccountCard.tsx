import React from 'react';
import { 
  MoreVertical, 
  Landmark, 
  CreditCard, 
  Bitcoin, 
  Banknote 
} from 'lucide-react';

export interface Account {
  id: string;
  name: string;
  type: 'Bank' | 'Credit Card' | 'Wallet' | 'Cash';
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  color: string;
  icon: string;
}


interface AccountCardProps {
  account: Account;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const getIcon = () => {
    switch (account.type) {
      case 'Bank': return Landmark;
      case 'Credit Card': return CreditCard;
      case 'Wallet': return Bitcoin;
      case 'Cash': return Banknote;
      default: return Landmark;
    }
  };

  const Icon = getIcon();

  return (
    <div className="group relative p-8 rounded-xl bg-surface-container hover:bg-surface-bright transition-all duration-300">
      <div className="absolute top-0 right-0 p-8">
        <MoreVertical 
          size={20} 
          className="text-on-surface-variant/40 group-hover:text-primary transition-colors cursor-pointer" 
        />
      </div>
      
      <div className="flex items-start gap-5  mb-8">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${account.color}20`, color: account.color }}
        >
          <Icon size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface">{account.name}</h3>
          <span 
            className="inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter"
            style={{ backgroundColor: `${account.color}20`, color: account.color }}
          >
            {account.type}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.15em] text-on-surface-variant font-bold">
          {account.type === 'Credit Card' ? 'Outstanding Balance' : account.type === 'Wallet' ? 'Total Valuation' : account.type === 'Cash' ? 'Physical Reserve' : 'Current Balance'}
        </span>
        <div className="text-4xl font-black tracking-tight text-on-surface mt-1">
          ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/10">
        <div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Month Income</span>
          <p className="font-semibold text-[#4ade80]">
            {account.monthlyIncome > 0 ? '+' : ''}${account.monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Month Expense</span>
          <p className={`font-semibold ${account.monthlyExpense > 2000 ? 'text-error' : 'text-on-surface'}`}>
            ${account.monthlyExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}
