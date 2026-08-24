import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { getCategoryMeta } from '../../data/categories';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionItem = ({
  transaction,
  onEditModal,
  onDeleteRequest,
  allowInlineEdit = false,
}) => {
  const { updateTransaction, currency } = useFinance();
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [inlineDescription, setInlineDescription] = useState(transaction.description);
  const [inlineAmount, setInlineAmount] = useState(transaction.amount);

  const isIncome = transaction.type === 'income';
  const meta = getCategoryMeta(transaction.category, transaction.type);
  const Icon = meta.icon;

  const handleSaveInline = () => {
    if (!inlineDescription.trim() || isNaN(Number(inlineAmount)) || Number(inlineAmount) <= 0) {
      return;
    }
    updateTransaction(transaction.id, {
      description: inlineDescription.trim(),
      amount: parseFloat(inlineAmount),
    });
    setIsInlineEditing(false);
  };

  const handleCancelInline = () => {
    setInlineDescription(transaction.description);
    setInlineAmount(transaction.amount);
    setIsInlineEditing(false);
  };

  return (
    <div className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-teal-500/15 hover:border-teal-400/60 dark:hover:border-teal-400/40 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Left side: Icon & Info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div
          className="p-2.5 sm:p-3 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xs"
          style={{ backgroundColor: `${meta.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: meta.color }} />
        </div>

        <div className="min-w-0 flex-1">
          {isInlineEditing ? (
            <div className="space-y-1.5 pr-2">
              <input
                type="text"
                value={inlineDescription}
                onChange={(e) => setInlineDescription(e.target.value)}
                className="w-full px-2.5 py-1 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-teal-500/40 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500"
                placeholder="Description"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {transaction.description}
              </h5>
              <span
                className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600"
              >
                {transaction.category}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            <span>{formatDate(transaction.date)}</span>
            <span>•</span>
            <span className="sm:hidden font-medium text-slate-600 dark:text-slate-400">{transaction.category}</span>
            {transaction.paymentMethod && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-slate-500 dark:text-slate-400">{transaction.paymentMethod}</span>
              </>
            )}
            {transaction.notes && (
              <>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline italic text-slate-400 dark:text-slate-500 truncate max-w-[150px]">
                  "{transaction.notes}"
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Amount & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-3">
        {isInlineEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.01"
              value={inlineAmount}
              onChange={(e) => setInlineAmount(e.target.value)}
              className="w-20 px-2 py-1 text-sm font-bold text-right bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-teal-500/40 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500"
            />
            <button
              type="button"
              onClick={handleSaveInline}
              className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-xs"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCancelInline}
              className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <span
              className={`text-sm sm:text-base font-bold tracking-tight font-display ${
                isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(transaction.amount, currency)}
            </span>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => (allowInlineEdit ? setIsInlineEditing(true) : onEditModal(transaction))}
                className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-lg transition-colors"
                title="Edit entry"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onDeleteRequest(transaction.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                title="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
