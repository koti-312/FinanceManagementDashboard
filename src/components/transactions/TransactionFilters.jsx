import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../data/categories';

const TransactionFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  typeFilterLocked = false,
  targetType = 'all',
}) => {
  const categories =
    targetType === 'income'
      ? INCOME_CATEGORIES
      : targetType === 'expense'
      ? EXPENSE_CATEGORIES
      : [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  // Remove duplicates by ID
  const uniqueCategories = Array.from(new Map(categories.map(c => [c.id, c])).values());

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-white/80 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs">
      {/* Left: Search input */}
      <div className="relative flex-1 min-w-[220px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search by description, notes, method..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-teal-500/20 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right controls: Type, Category, Sort */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Type selector (if not locked) */}
        {!typeFilterLocked && (
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-teal-500/20 text-xs">
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                  selectedType === t
                    ? t === 'income'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : t === 'expense'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Category Dropdown */}
        <div className="relative min-w-[140px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-teal-500/20 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40 cursor-pointer appearance-none"
          >
            <option value="all" className="dark:bg-slate-900">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c.id} value={c.id} className="dark:bg-slate-900">
                {c.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative min-w-[140px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-teal-500/20 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40 cursor-pointer appearance-none"
          >
            <option value="date-desc" className="dark:bg-slate-900">Newest First</option>
            <option value="date-asc" className="dark:bg-slate-900">Oldest First</option>
            <option value="amount-desc" className="dark:bg-slate-900">Highest Amount</option>
            <option value="amount-asc" className="dark:bg-slate-900">Lowest Amount</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
