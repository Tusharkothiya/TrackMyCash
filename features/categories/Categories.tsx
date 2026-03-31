"use client";

import  { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryCard } from './components/CategoryCard';
import { InsightFooter } from './components/InsightFooter';
import { AddCategoryModal } from './components/AddCategoryModal';

export type CategoryIcon = 
  | 'layout-grid' 
  | 'receipt' 
  | 'wallet' 
  | 'bar-chart' 
  | 'settings' 
  | 'log-out' 
  | 'search' 
  | 'bell' 
  | 'plus-circle' 
  | 'edit' 
  | 'trash-2' 
  | 'sparkles' 
  | 'server' 
  | 'megaphone' 
  | 'briefcase' 
  | 'plane' 
  | 'banknote' 
  | 'lightbulb' 
  | 'more-horizontal'
  | 'shopping-cart'
  | 'home'
  | 'activity'
  | 'graduation-cap'
  | 'clapperboard'
  | 'piggy-bank'
  | 'theater'
  | 'paw-print'
  | 'layers';


export interface Category {
  id: string;
  name: string;
  icon: CategoryIcon;
  color: string;
  transactionCount: number;
  amount: number;
  type: 'expense' | 'income';
  overline?: string;
}

const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Infrastructure',
    icon: 'server',
    color: '#b4c5ff',
    transactionCount: 12,
    amount: 4850.00,
    type: 'expense',
  },
  {
    id: '2',
    name: 'Marketing',
    icon: 'megaphone',
    color: '#ffb596',
    transactionCount: 28,
    amount: 12300.00,
    type: 'expense',
  },
  {
    id: '3',
    name: 'Operations',
    icon: 'briefcase',
    color: '#fb923c', // orange-400
    transactionCount: 45,
    amount: 8120.00,
    type: 'expense',
  },
  {
    id: '4',
    name: 'Travel',
    icon: 'plane',
    color: '#2dd4bf', // teal-400
    transactionCount: 6,
    amount: 2400.50,
    type: 'expense',
  },
  {
    id: '5',
    name: 'Income',
    icon: 'banknote',
    color: '#34d399', // emerald-400
    transactionCount: 18,
    amount: 24000.00,
    type: 'income',
  },
  {
    id: '6',
    name: 'Consulting',
    icon: 'lightbulb',
    color: '#f472b6', // pink-400
    transactionCount: 14,
    amount: 5900.00,
    type: 'expense',
  },
  {
    id: '7',
    name: 'Other',
    icon: 'more-horizontal',
    color: '#8d90a0',
    transactionCount: 32,
    amount: 1240.00,
    type: 'expense',
  }
];


const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategory = (newCat: Omit<Category, 'id' | 'transactionCount' | 'amount'>) => {
    const category: Category = {
      ...newCat,
      id: Math.random().toString(36).substring(2, 9),
      transactionCount: 0,
      amount: 0,
    };
    setCategories(prev => [...prev, category]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      
      <main className="min-h-screen">
        
        <div className="pt-24 pb-12 px-8 md:px-12 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-[0.7rem] font-bold tracking-[0.2em] text-primary uppercase block mb-2">
                Portfolio Management
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface">
                Categories
              </h2>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 cursor-pointer bg-linear-to-br from-primary-container to-primary text-on-primary-fixed font-bold rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/10 active:scale-95"
            >
              <PlusCircle size={20} />
              Add Category
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                >
                  <CategoryCard 
                    category={category} 
                    onDelete={handleDeleteCategory}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add New Category Placeholder */}
            <motion.button 
              whileHover={{ y: -4 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-surface-container-lowest cursor-pointer border-2 border-dashed border-outline-variant/20 rounded-2xl p-6 flex flex-col items-center justify-center text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all group min-h-60"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle size={32} />
              </div>
              <span className="font-bold text-sm tracking-wide">Create Custom Category</span>
              <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase tracking-widest font-bold">Define a new tracking group</p>
            </motion.button>
          </div>

          {/* Footer Insight */}
          <InsightFooter />
        </div>
      </main>

      <AddCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCategory}
      />
    </div>
  );
}

export default Categories;