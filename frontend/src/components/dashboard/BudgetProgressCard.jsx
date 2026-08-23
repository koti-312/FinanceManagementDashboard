import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const BudgetProgressCard = () => {
  const { budgets, transactions, currency } = useFinance();

  // Calculate current month spending per budgeted category
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
  const overallPercentage = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;

  // Top 3 budget items
  const budgetList = Object.entries(budgets)
    .map(([cat, limit]) => {
      const spent = categorySpentMap[cat] || 0;
      const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      return { category: cat, limit, spent, percentage: pct };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  return (
    <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              Monthly Budget Status
            </h3>
            <p className="text-xs text-slate-400">Current month limit tracking</p>
          </div>
        </div>

        <Link
          to="/budgets"
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
        >
          <span>Manage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Overall Progress */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">Total Monthly Spending</span>
          <span className="font-bold text-slate-900 font-display">
            {formatCurrency(totalSpent, currency)} / {formatCurrency(totalBudget, currency)}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallPercentage >= 90
                ? 'bg-rose-500'
                : overallPercentage >= 75
                ? 'bg-amber-500'
                : 'bg-teal-500'
            }`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{overallPercentage}% utilized</span>
          <span>{formatCurrency(Math.max(0, totalBudget - totalSpent), currency)} remaining</span>
        </div>
      </div>

      {/* Category breakdown bars */}
      <div className="space-y-3 pt-1">
        {budgetList.map((item) => {
          const isOver = item.spent > item.limit;
          const isNear = item.percentage >= 80 && !isOver;

          return (
            <div key={item.category} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{item.category}</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(item.spent, currency)}
                  <span className="text-slate-400 font-normal"> / {formatCurrency(item.limit, currency)}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgressCard;
