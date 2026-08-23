import React from 'react';
import StatCard from '../components/common/StatCard';
import EarningsOverviewChart from '../components/dashboard/EarningsOverviewChart';
import MonthlyBreakdownChart from '../components/dashboard/MonthlyBreakdownChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import QuickActionsCard from '../components/dashboard/QuickActionsCard';
import RecentTransactionsList from '../components/dashboard/RecentTransactionsList';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

const DashboardPage = () => {
  const { metrics, transactions } = useFinance();

  const netBalance = metrics.totalBalance;
  const monthlyIncome = metrics.totalIncome;
  const monthlyExpense = metrics.totalExpense;
  const netSavings = metrics.netSavings;

  return (
    <div className="space-y-4">
      {/* Row 1: Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          amount={netBalance}
          variant="balance"
          icon={Wallet}
          subtitle="Net accumulated funds"
        />

        <StatCard
          title="Monthly Income"
          amount={monthlyIncome}
          variant="income"
          icon={TrendingUp}
          subtitle={`Across ${metrics.incomeCount} inflows`}
        />

        <StatCard
          title="Monthly Expenses"
          amount={monthlyExpense}
          variant="expense"
          icon={TrendingDown}
          subtitle={`Across ${metrics.expenseCount} outflows`}
        />

        <StatCard
          title="Net Profit / Savings"
          amount={netSavings}
          variant="profit"
          icon={PiggyBank}
          subtitle={`${metrics.savingsRate}% monthly savings rate`}
        />
      </div>

      {/* Row 2: Two Middle Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EarningsOverviewChart />
        <MonthlyBreakdownChart />
      </div>

      {/* Row 3: Bottom 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategoryPieChart />
        <QuickActionsCard />
        <RecentTransactionsList />
      </div>
    </div>
  );
};

export default DashboardPage;
