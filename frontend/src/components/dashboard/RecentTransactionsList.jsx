import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryMeta } from '../../data/categories';
import { Link } from 'react-router-dom';
import { ArrowRight, ReceiptText } from 'lucide-react';

const RecentTransactionsList = () => {
  const { transactions, currency } = useFinance();

  const recentList = transactions.slice(0, 3);

  return (
    <div className="liquid-glass-card p-4 sm:p-5 flex flex-col justify-between min-h-[190px]">
      {/* Title + Link */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display tracking-tight">
            Recent Activity
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Latest income & expense postings
          </p>
        </div>

        <Link
          to="/transactions"
          className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Transactions Rows */}
      <div className="space-y-2.5 my-auto pt-2">
        {recentList.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400">
            <ReceiptText className="w-6 h-6 mx-auto mb-1 opacity-50" />
            No recent activity recorded.
          </div>
        ) : (
          recentList.map((item) => {
            const isIncome = item.type === 'income';
            const meta = getCategoryMeta(item.category, item.type);
            const Icon = meta.icon;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Icon/Avatar + Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${meta.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs leading-tight truncate">
                      {item.description}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-tight mt-0.5">
                      {item.category} • {formatDate(item.date)}
                    </p>
                  </div>
                </div>

                {/* Formatted Amount */}
                <div
                  className={`text-right flex-shrink-0 font-bold font-display text-xs sm:text-[13px] ${
                    isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(item.amount, currency)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentTransactionsList;
