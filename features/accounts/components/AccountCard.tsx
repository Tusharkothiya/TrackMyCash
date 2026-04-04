import React from 'react';
import { 
  MoreVertical, 
  Landmark, 
  CreditCard, 
  Bitcoin, 
  Banknote,
  Edit2,
  Trash2
} from 'lucide-react';
import type { Account } from '@/features/accounts/types';

interface AccountCardProps {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (id: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
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
    <div className="group relative p-8 rounded-xl bg-surface-container hover:bg-surface-bright transition-all duration-300 border border-transparent hover:border-outline-variant/10">
      <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit?.(account)}
          className="p-2 text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors rounded-lg hover:bg-surface-bright"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete?.(account._id)}
          className="p-2 text-on-surface-variant cursor-pointer hover:text-error transition-colors rounded-lg hover:bg-surface-bright"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="flex items-start gap-5 mb-8">
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

      <div>
        <span className="text-[11px] uppercase tracking-[0.15em] text-on-surface-variant font-bold">
          {account.type === 'Credit Card' ? 'Outstanding Balance' : account.type === 'Wallet' ? 'Total Valuation' : account.type === 'Cash' ? 'Physical Reserve' : 'Current Balance'}
        </span>
        <div className="text-4xl font-black tracking-tight text-on-surface mt-1">
          {account.currency === 'INR' ? '₹' : '$'}
          {Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <p className="text-[10px] text-on-surface-variant mt-2 font-medium">
          Currency: {account.currency}
        </p>
      </div>
    </div>
  );
}
