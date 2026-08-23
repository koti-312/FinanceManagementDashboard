import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Plus,
  BarChart2,
  Layers,
  ArrowUpRight,
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

const CustomIncomeTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 liquid-glass-card shadow-2xl text-xs space-y-1 border border-teal-500/20">
        <p className="font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <p className="font-bold text-emerald-600 dark:text-emerald-400 font-display text-sm">
          +{formatCurrency(payload[0].value, currency)}
        </p>
      </div>
    );
  }
  return null;
};

const IncomePage = () => {
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

  const allIncomeTransactions = useMemo(() => {
    return transactions.filter((t) => t.type === 'income');
  }, [transactions]);

  const processedIncomes = useMemo(() => {
    let list = allIncomeTransactions;

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
  }, [allIncomeTransactions, searchQuery, selectedCategory, sortBy]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white shadow-xl shadow-teal-700/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Inflow Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            Income Management
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Monitor earnings across salaries, freelancing, investments, and side ventures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton
            data={processedIncomes}
            fileName="FinanceFlow_Income"
            sheetName="Income"
          />

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          amount={metrics.totalIncome}
          icon={TrendingUp}
          variant="profit"
          subtitle={`Across ${metrics.incomeCount} records`}
        />

        <StatCard
          title="Average per Deposit"
          amount={metrics.averageIncome}
          icon={DollarSign}
          variant="balance"
          subtitle="Average revenue per transaction"
        />

        <StatCard
          title="Total Income Entries"
          amount={metrics.incomeCount}
          isCurrency={false}
          icon={Layers}
          variant="income"
          subtitle="Total recorded income streams"
        />
      </div>

      {/* Income Trend Graph */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-teal-500" />
              <span>Income Trends ({timeFrame})</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Visual breakdown over selected timeframe</p>
          </div>

          <TimeFrameToggle timeFrame={timeFrame} setTimeFrame={setTimeFrame} color="teal" size="sm" />
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#06b6d4" />
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
              <Tooltip content={<CustomIncomeTooltip currency={currency} />} />
              <Bar
                dataKey="income"
                name="Income"
                fill="url(#incomeBarGradient)"
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
        targetType="income"
      />

      {/* Income Records List */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
            Income Entries ({processedIncomes.length})
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">Click entry or edit icon to modify</span>
        </div>

        {processedIncomes.length === 0 ? (
          <div className="py-14 text-center text-slate-400 dark:text-slate-500 text-sm">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No income entries found matching your filters.
          </div>
        ) : (
          <div className="space-y-2.5">
            {processedIncomes.map((item) => (
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
        initialType="income"
        lockType={true}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Income Record"
        message="Are you sure you want to delete this income entry? This will adjust your total balance accordingly."
      />
    </div>
  );
};

export default IncomePage;
