import { Calendar, CheckCircle2, ChevronDown, Plus, TrendingDown, TrendingUp, UploadCloud, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TransactionDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
          />
          
          {/* Drawer */}
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-120 bg-[#0d1117] shadow-2xl z-70 flex flex-col border-l border-outline-variant/20"
          >
            <header className="h-20 px-8 flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus className="text-primary w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-on-surface">Add Transaction</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 cursor-pointer rounded-full hover:bg-surface-bright transition-colors flex items-center justify-center text-on-surface-variant"
              >
                <X className="w-6 h-6" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
              {/* Type Toggle */}
              <div className="space-y-3">
                <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">Transaction Type</label>
                <div className="flex bg-surface-container-lowest p-1 rounded-[10px] border border-outline-variant/10">
                  <button className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold bg-surface-container text-on-surface shadow-sm">
                    <TrendingDown className="w-4 h-4" />
                    Expense
                  </button>
                  <button className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    <TrendingUp className="w-4 h-4" />
                    Income
                  </button>
                </div>
              </div>

              {/* Title & Amount */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">Transaction Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary/50 outline-none transition-all"
                    placeholder="e.g. Monthly Grocery"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-on-surface-variant">$</span>
                    <input 
                      type="number" 
                      className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg pl-8 pr-4 py-3 text-2xl font-bold text-on-surface focus:border-primary/50 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Dropdowns Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">Category</label>
                  <div className="relative group">
                    <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm cursor-pointer">
                      <option>Food & Dining</option>
                      <option>Transportation</option>
                      <option>Shopping</option>
                      <option>Entertainment</option>
                      <option>Utilities</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">Account</label>
                  <div className="relative group">
                    <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm cursor-pointer">
                      <option>Main Checking (***24)</option>
                      <option>Savings Vault</option>
                      <option>Credit Platinum</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Date & Status */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm"
                      defaultValue="2023-10-25"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">Status</label>
                  <div className="relative group">
                    <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all text-sm cursor-pointer">
                      <option>Completed</option>
                      <option>Pending</option>
                    </select>
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2.5">
                <label className="text-[0.65rem] uppercase tracking-widest font-bold text-on-surface-variant">Notes (Optional)</label>
                <textarea 
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary/50 outline-none transition-all text-sm resize-none"
                  placeholder="Add some details about this transaction..."
                  rows={3}
                ></textarea>
              </div>

              {/* Receipt Upload */}
              <div className="p-6 border-2 border-dashed border-outline-variant/20 rounded-xl flex flex-col items-center justify-center gap-3 group hover:border-primary/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-on-surface">Upload Receipt</p>
                  <p className="text-xs text-on-surface-variant">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <footer className="p-8 border-t border-outline-variant/10 flex items-center gap-4 bg-surface-container-lowest">
              <button 
                onClick={onClose}
                className="flex-1 py-3.5 cursor-pointer rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-bright transition-colors"
              >
                Cancel
              </button>
              <button className="flex-2 cursor-pointer py-3.5 rounded-lg primary-gradient text-sm font-bold text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                Save Transaction
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionDrawer;