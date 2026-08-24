import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { useFinance } from '../../context/FinanceContext';

const CARD_CLASSES = {
  balance: 'glass-card-balance',
  income: 'glass-card-income',
  expense: 'glass-card-expenses',
  profit: 'glass-card-profit',
  emerald: 'glass-card-profit',
  teal: 'glass-card-balance',
  blue: 'glass-card-income',
  rose: 'glass-card-expenses',
  amber: 'glass-card-balance',
  purple: 'glass-card-income',
};

const StatCard = ({
  title,
  amount,
  isCurrency = true,
  variant = 'balance',
  subtitle = '',
  icon: Icon,
  className = '',
  onClick,
}) => {
  const { currency } = useFinance();
  const cardClass = CARD_CLASSES[variant] || 'glass-card-balance';

  const displayAmount = typeof amount === 'number' && isCurrency
    ? formatCurrency(amount, currency)
    : amount;

  return (
    <div
      onClick={onClick}
      className={`px-5 py-4 flex flex-col justify-center min-h-[96px] ${cardClass} ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      } ${className} transition-all duration-200`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">
          {title}
        </p>
        {Icon && (
          <div className="p-1.5 rounded-xl bg-white/40 dark:bg-slate-800/40 text-teal-600 dark:text-teal-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <h3 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white font-display leading-tight mt-0.5">
        {displayAmount}
      </h3>

      {subtitle && (
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
