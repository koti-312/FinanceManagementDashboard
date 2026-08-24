import React from 'react';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Home,
  DollarSign,
  PieChart,
  Utensils,
  ShoppingBag,
  Car,
  Tv,
  HeartPulse,
  GraduationCap,
  Plane,
  Zap,
  Coffee,
  ShieldAlert,
  CreditCard,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const INCOME_CATEGORIES = [
  { id: 'Salary', name: 'Salary', icon: Briefcase, color: '#10b981', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'Freelance', name: 'Freelance', icon: Laptop, color: '#06b6d4', bg: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  { id: 'Investment', name: 'Investment', icon: TrendingUp, color: '#8b5cf6', bg: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'Bonus', name: 'Bonus', icon: Gift, color: '#f59e0b', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'Rental', name: 'Rental Income', icon: Home, color: '#3b82f6', bg: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'Dividends', name: 'Dividends', icon: PieChart, color: '#14b8a6', bg: 'bg-teal-50 text-teal-600 border-teal-200' },
  { id: 'Other', name: 'Other Income', icon: DollarSign, color: '#64748b', bg: 'bg-slate-50 text-slate-600 border-slate-200' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'Food & Dining', name: 'Food & Dining', icon: Utensils, color: '#f97316', bg: 'bg-orange-50 text-orange-600 border-orange-200' },
  { id: 'Rent & Housing', name: 'Rent & Housing', icon: Home, color: '#ef4444', bg: 'bg-red-50 text-red-600 border-red-200' },
  { id: 'Groceries', name: 'Groceries', icon: Coffee, color: '#84cc16', bg: 'bg-lime-50 text-lime-600 border-lime-200' },
  { id: 'Utilities', name: 'Utilities & Bills', icon: Zap, color: '#eab308', bg: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { id: 'Transportation', name: 'Transportation', icon: Car, color: '#0284c7', bg: 'bg-sky-50 text-sky-600 border-sky-200' },
  { id: 'Entertainment', name: 'Entertainment', icon: Tv, color: '#ec4899', bg: 'bg-pink-50 text-pink-600 border-pink-200' },
  { id: 'Shopping', name: 'Shopping', icon: ShoppingBag, color: '#d946ef', bg: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200' },
  { id: 'Health & Fitness', name: 'Health & Medical', icon: HeartPulse, color: '#10b981', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'Education', name: 'Education', icon: GraduationCap, color: '#6366f1', bg: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { id: 'Travel', name: 'Travel', icon: Plane, color: '#06b6d4', bg: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  { id: 'Subscriptions', name: 'Subscriptions', icon: CreditCard, color: '#a855f7', bg: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'Other', name: 'Other Expenses', icon: Layers, color: '#64748b', bg: 'bg-slate-50 text-slate-600 border-slate-200' },
];

export const getCategoryMeta = (categoryId, type = 'expense') => {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const match = list.find(c => c.id.toLowerCase() === (categoryId || '').toLowerCase() || c.name.toLowerCase() === (categoryId || '').toLowerCase());
  
  if (match) return match;
  
  // Cross search
  const fallback = (type === 'income' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).find(
    c => c.id.toLowerCase() === (categoryId || '').toLowerCase()
  );
  if (fallback) return fallback;

  return {
    id: categoryId || 'Other',
    name: categoryId || 'Other',
    icon: HelpCircle,
    color: '#94a3b8',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
  };
};

export const getCategoryIcon = (categoryId, type = 'expense', className = 'w-5 h-5') => {
  const meta = getCategoryMeta(categoryId, type);
  const IconComponent = meta.icon;
  return <IconComponent className={className} style={{ color: meta.color }} />;
};
