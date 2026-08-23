import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  DollarSign,
  Plus,
  BarChart2,
  Layers,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/common/StatCard';
import TimeFrameToggle from '../components/common/TimeFrameToggle';
import ExportButton from '../components/common/ExportButton';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionItem from '../components/transactions/TransactionItem';
import TransactionFormModal from '../components/common/TransactionFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatCurrency } from '../utils/formatters';

const CustomExpenseTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 liquid-glass-card shadow-2xl text-xs space-y-1 border border-rose-500/20">
        <p className="font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <p className="font-bold text-rose-600 dark:text-rose-400 font-display text-sm">
          -{formatCurrency(payload[0].value, currency)}
        </p>
      </div>
    );
  }
  return null;
};

const ExpensePage = () => {
  const {
    transactions,
    metrics,
    chartData,
    timeFrame,
    setTimeFrame,
    deleteTransaction,
    currency,
  } = useFinance();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const allExpenseTransactions = useMemo(() => {
    return transactions.filter((t) => t.type === 'expense');
  }, [transactions]);

  const processedExpenses = useMemo(() => {
    let list = allExpenseTransactions;

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

    if (selectedCategory !== 'all') {
      list = list.filter((t) => (t.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
      if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
      return 0;
    });
  }, [allExpenseTransactions, searchQuery, selectedCategory, sortBy]);

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

  const axisTickColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 text-white shadow-xl shadow-rose-700/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Outflow Tracking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Expense Management
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            Control monthly burn rate, categorize living expenses, and pinpoint spending leaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton
            data={processedExpenses}
            fileName="FinanceFlow_Expenses"
            sheetName="Expenses"
          />

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-rose-800 hover:bg-rose-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Expenses"
          amount={metrics.totalExpense}
          icon={TrendingDown}
          variant="expense"
          subtitle={`Across ${metrics.expenseCount} expenses`}
        />

        <StatCard
          title="Average per Expense"
          amount={metrics.averageExpense}
          icon={DollarSign}
          variant="balance"
          subtitle="Average amount per transaction"
        />

        <StatCard
          title="Total Expense Entries"
          amount={metrics.expenseCount}
          isCurrency={false}
          icon={Layers}
          variant="income"
          subtitle="Logged expense transactions"
        />
      </div>

      {/* Expense Trend Graph */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-rose-500" />
              <span>Expense Trends ({timeFrame})</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Visual spending pattern over selected timeframe</p>
          </div>

          <TimeFrameToggle timeFrame={timeFrame} setTimeFrame={setTimeFrame} color="rose" size="sm" />
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="expenseBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                tick={{ fill: axisTickColor, fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: axisTickColor, fontSize: 11 }}
                tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomExpenseTooltip currency={currency} />} />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="url(#expenseBarGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Bar */}
      <TransactionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        typeFilterLocked={true}
        targetType="expense"
      />

      {/* Expense Records List */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
            Expense Entries ({processedExpenses.length})
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">Click entry or edit icon to modify</span>
        </div>

        {processedExpenses.length === 0 ? (
          <div className="py-14 text-center text-slate-400 dark:text-slate-500 text-sm">
            <TrendingDown className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No expense entries found matching your filters.
          </div>
        ) : (
          <div className="space-y-2.5">
            {processedExpenses.map((item) => (
              <TransactionItem
                key={item.id}
                transaction={item}
                onEditModal={handleEdit}
                onDeleteRequest={(id) => setDeletingId(id)}
                allowInlineEdit={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        editItem={editingItem}
        initialType="expense"
        lockType={true}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Record"
        message="Are you sure you want to delete this expense record? This action will adjust your balance."
      />
    </div>
  );
};

export default ExpensePage;
