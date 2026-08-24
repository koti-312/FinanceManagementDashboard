import React, { useState } from 'react';
import {
  Target,
  Edit3,
  Save,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  PiggyBank,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../data/categories';
import { formatCurrency } from '../utils/formatters';

const BudgetsPage = () => {
  const { budgets, updateBudget, transactions, currency } = useFinance();
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempLimit, setTempLimit] = useState('');

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const categorySpentMap = {};
  let totalSpent = 0;
  currentMonthExpenses.forEach((t) => {
    const amt = Number(t.amount) || 0;
    categorySpentMap[t.category] = (categorySpentMap[t.category] || 0) + amt;
    totalSpent += amt;
  });

  const totalBudget = Object.values(budgets).reduce((acc, val) => acc + Number(val || 0), 0);
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const totalUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const handleStartEdit = (cat, currentVal) => {
    setEditingCategory(cat);
    setTempLimit(String(currentVal || 0));
  };

  const handleSaveBudget = (cat) => {
    if (!isNaN(Number(tempLimit)) && Number(tempLimit) >= 0) {
      updateBudget(cat, parseFloat(tempLimit));
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-800 via-cyan-800 to-slate-800 text-white shadow-xl shadow-teal-900/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            <Target className="w-3.5 h-3.5" />
            <span>Monthly Goals</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Budgets & Spending Limits
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Set maximum expenditure caps for each category to maintain healthy financial savings.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-teal-500/20 flex items-center gap-4">
          <div>
            <p className="text-[11px] font-semibold text-teal-200 uppercase">
              Total Monthly Budget
            </p>
            <p className="text-xl font-bold font-display">
              {formatCurrency(totalBudget, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-1.5">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Total Spent This Month
          </p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            {formatCurrency(totalSpent, currency)}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {totalUtilization}% of allocated budget utilized
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-1.5">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Remaining Budget
          </p>
          <h4
            className={`text-2xl font-bold font-display ${
              totalRemaining === 0 && totalSpent > totalBudget
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatCurrency(totalRemaining, currency)}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {totalSpent > totalBudget
              ? `Exceeded by ${formatCurrency(totalSpent - totalBudget, currency)}`
              : 'Safe spendable buffer'}
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-1.5">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Budget Health Score
          </p>
          <div className="flex items-center gap-2">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
              {totalUtilization <= 80 ? 'Excellent' : totalUtilization <= 100 ? 'Moderate' : 'Critical'}
            </h4>
            {totalUtilization <= 80 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : totalUtilization <= 100 ? (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500" />
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Based on active burn rate</p>
        </div>
      </div>

      {/* Category Budget Matrix */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
              Category Spending Limits
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Click edit on any category to adjust its monthly limit
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPENSE_CATEGORIES.map((cat) => {
            const limit = budgets[cat.id] ?? budgets[cat.name] ?? 0;
            const spent = categorySpentMap[cat.id] ?? categorySpentMap[cat.name] ?? 0;
            const pct = limit > 0 ? Math.round((spent / limit) * 100) : spent > 0 ? 100 : 0;
            const isOver = spent > limit && limit > 0;
            const isNear = pct >= 80 && !isOver;
            const Icon = cat.icon;
            const isEditing = editingCategory === cat.id;

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isOver
                    ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50'
                    : isNear
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
                    : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-teal-500/15 hover:border-teal-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="p-2.5 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Spent: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(spent, currency)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Limit & Edit */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="10"
                          min="0"
                          value={tempLimit}
                          onChange={(e) => setTempLimit(e.target.value)}
                          className="w-20 px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-teal-500 rounded-lg focus:outline-none text-right text-slate-900 dark:text-white"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveBudget(cat.id)}
                          className="p-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-xs"
                          title="Save"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-900 dark:text-white font-display">
                            {formatCurrency(limit, currency)}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">Limit</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat.id, limit)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit Limit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="w-full h-2 bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : isNear
                          ? 'bg-amber-500'
                          : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span
                      className={`font-semibold ${
                        isOver
                          ? 'text-rose-600 dark:text-rose-400'
                          : isNear
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {pct}% used
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {isOver
                        ? `Over by ${formatCurrency(spent - limit, currency)}`
                        : `${formatCurrency(Math.max(0, limit - spent), currency)} left`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;
