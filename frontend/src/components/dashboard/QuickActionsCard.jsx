import React, { useState } from 'react';
import { Plus, ArrowDownRight, ArrowUpRight, Download, Receipt } from 'lucide-react';
import TransactionFormModal from '../common/TransactionFormModal';
import { useFinance } from '../../context/FinanceContext';
import { exportToExcel } from '../../utils/exportUtils';

const QuickActionsCard = () => {
  const { transactions } = useFinance();
  const [modalState, setModalState] = useState({ isOpen: false, type: 'expense' });

  const handleExport = () => {
    exportToExcel(transactions, 'FinanceFlow_Report', 'Transactions');
  };

  return (
    <div className="liquid-glass-card p-4 sm:p-5 flex flex-col justify-between min-h-[190px]">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-display tracking-tight">
          Quick Actions
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Fast record entry & data export
        </p>
      </div>

      {/* 2x2 Grid of Actions */}
      <div className="grid grid-cols-2 gap-2.5 my-auto pt-2">
        {/* + Add Expense */}
        <button
          type="button"
          onClick={() => setModalState({ isOpen: true, type: 'expense' })}
          className="glass-btn-primary flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold"
        >
          <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="truncate">Add Expense</span>
        </button>

        {/* + Add Income */}
        <button
          type="button"
          onClick={() => setModalState({ isOpen: true, type: 'income' })}
          className="glass-btn-secondary flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-teal-700 dark:text-teal-300"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 stroke-[2]" />
          <span className="truncate">Add Income</span>
        </button>

        {/* New Transfer */}
        <button
          type="button"
          onClick={() => setModalState({ isOpen: true, type: 'expense' })}
          className="glass-btn-secondary flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium"
        >
          <Receipt className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[1.75]" />
          <span className="truncate">Transfer</span>
        </button>

        {/* Export Report */}
        <button
          type="button"
          onClick={handleExport}
          className="glass-btn-secondary flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[1.75]" />
          <span className="truncate">Export Excel</span>
        </button>
      </div>

      <TransactionFormModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: 'expense' })}
        initialType={modalState.type}
      />
    </div>
  );
};

export default QuickActionsCard;
