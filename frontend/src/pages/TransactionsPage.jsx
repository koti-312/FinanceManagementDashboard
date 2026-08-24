import React, { useState, useMemo } from 'react';
import {
  ReceiptText,
  Plus,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionItem from '../components/transactions/TransactionItem';
import TransactionFormModal from '../components/common/TransactionFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ExportButton from '../components/common/ExportButton';
import { formatCurrency } from '../utils/formatters';

const ITEMS_PER_PAGE = 8;

const TransactionsPage = () => {
  const { transactions, deleteTransaction, currency } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filter and sort transactions
  const filteredList = useMemo(() => {
    let list = transactions;

    if (selectedType !== 'all') {
      list = list.filter((t) => t.type === selectedType);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((t) => (t.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          (t.description || '').toLowerCase().includes(q) ||
          (t.category || '').toLowerCase().includes(q) ||
          (t.notes || '').toLowerCase().includes(q) ||
          (t.paymentMethod || '').toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
      if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
      return 0;
    });
  }, [transactions, selectedType, selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteTransaction(deletingId);
      setDeletingId(null);
    }
  };

  // Summary counts for filtered list
  const summary = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filteredList.forEach((t) => {
      if (t.type === 'income') inc += Number(t.amount || 0);
      else exp += Number(t.amount || 0);
    });
    return { inc, exp, net: inc - exp };
  }, [filteredList]);

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-teal-500/20 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-2xl">
            <ReceiptText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Transactions History
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Master ledger of all income deposits and categorized expenses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton
            data={filteredList}
            fileName="FinanceFlow_Transactions"
            sheetName="Transactions"
          />

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Mini summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-200/80 dark:border-teal-500/15 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40">
          <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Filtered Incomes
          </span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 font-display text-sm">
            +{formatCurrency(summary.inc, currency)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-800/40">
          <span className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            Filtered Expenses
          </span>
          <span className="font-bold text-rose-700 dark:text-rose-400 font-display text-sm">
            -{formatCurrency(summary.exp, currency)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Filtered Net
          </span>
          <span
            className={`font-bold font-display text-sm ${
              summary.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {summary.net >= 0 ? '+' : ''}
            {formatCurrency(summary.net, currency)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(c) => {
          setSelectedCategory(c);
          setCurrentPage(1);
        }}
        selectedType={selectedType}
        setSelectedType={(t) => {
          setSelectedType(t);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        typeFilterLocked={false}
      />

      {/* Transactions List */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
            Records ({filteredList.length})
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Showing page {currentPage} of {totalPages}
          </span>
        </div>

        {paginatedList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">
            <ReceiptText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            No transaction records found matching your filters.
          </div>
        ) : (
          <div className="space-y-2.5">
            {paginatedList.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onEditModal={handleEdit}
                onDeleteRequest={(id) => setDeletingId(id)}
                allowInlineEdit={true}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`w-7 h-7 rounded-xl font-bold transition-all ${
                    currentPage === num
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        editItem={editingItem}
        initialType="expense"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction? Your balances and reports will update automatically."
      />
    </div>
  );
};

export default TransactionsPage;
