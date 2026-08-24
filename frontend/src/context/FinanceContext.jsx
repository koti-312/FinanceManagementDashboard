import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from '../data/mockData';
import { getMonthName } from '../utils/formatters';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch (e) {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_budgets');
      return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
    } catch (e) {
      return INITIAL_BUDGETS;
    }
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('finance_currency') || 'USD';
  });

  const [timeFrame, setTimeFrame] = useState('monthly'); // 'daily' | 'weekly' | 'monthly' | 'yearly'

  // Persist state
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finance_currency', currency);
  }, [currency]);

  // Transaction CRUD
  const addTransaction = useCallback((data) => {
    const newTransaction = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      date: data.date || new Date().toISOString(),
      type: data.type || 'expense',
      category: data.category || (data.type === 'income' ? 'Salary' : 'Food & Dining'),
      description: data.description || '',
      amount: parseFloat(data.amount) || 0,
      notes: data.notes || '',
      paymentMethod: data.paymentMethod || 'Card',
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates, amount: parseFloat(updates.amount) || t.amount } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateBudget = useCallback((category, limit) => {
    setBudgets(prev => ({
      ...prev,
      [category]: parseFloat(limit) || 0,
    }));
  }, []);

  const resetToMockData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    localStorage.removeItem('finance_transactions');
    localStorage.removeItem('finance_budgets');
  }, []);

  const clearAllData = useCallback(() => {
    setTransactions([]);
  }, []);

  // Timeframe Date Boundary
  const dateRange = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    if (timeFrame === 'daily') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (timeFrame === 'weekly') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (timeFrame === 'monthly') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else if (timeFrame === 'yearly') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  }, [timeFrame]);

  // Filter transactions within selected timeframe
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= dateRange.start && tDate <= dateRange.end;
    });
  }, [transactions, dateRange]);

  // Aggregate Metrics (Overall & Current Timeframe)
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    filteredTransactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
        incomeCount += 1;
      } else {
        totalExpense += amt;
        expenseCount += 1;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;
    const averageIncome = incomeCount > 0 ? totalIncome / incomeCount : 0;
    const averageExpense = expenseCount > 0 ? totalExpense / expenseCount : 0;

    // Lifetime balance
    let allIncome = 0;
    let allExpense = 0;
    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') allIncome += amt;
      else allExpense += amt;
    });
    const totalBalance = allIncome - allExpense;

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate: Number(savingsRate),
      averageIncome,
      averageExpense,
      incomeCount,
      expenseCount,
      totalTransactions: filteredTransactions.length,
    };
  }, [filteredTransactions, transactions]);

  // Chart Data Preparation (Hourly, Daily, Monthly, Yearly)
  const chartData = useMemo(() => {
    const now = new Date();

    if (timeFrame === 'daily') {
      // 24 hour slots: 00:00 to 23:00
      const slots = [];
      for (let h = 0; h < 24; h += 2) {
        const hourLabel = `${h.toString().padStart(2, '0')}:00`;
        slots.push({
          label: hourLabel,
          hour: h,
          income: 0,
          expense: 0,
        });
      }

      filteredTransactions.forEach(t => {
        const d = new Date(t.date);
        const h = d.getHours();
        const slotIdx = Math.floor(h / 2);
        if (slots[slotIdx]) {
          if (t.type === 'income') slots[slotIdx].income += Number(t.amount);
          else slots[slotIdx].expense += Number(t.amount);
        }
      });
      return slots;
    }

    if (timeFrame === 'weekly') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const slots = days.map(d => ({ label: d, income: 0, expense: 0 }));

      filteredTransactions.forEach(t => {
        const d = new Date(t.date);
        const dayIdx = (d.getDay() + 6) % 7; // 0 for Mon
        if (slots[dayIdx]) {
          if (t.type === 'income') slots[dayIdx].income += Number(t.amount);
          else slots[dayIdx].expense += Number(t.amount);
        }
      });
      return slots;
    }

    if (timeFrame === 'monthly') {
      // Group by days of the month (1st through 31st or 5-day buckets for clean rendering)
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const slots = [];

      for (let day = 1; day <= daysInMonth; day++) {
        slots.push({
          label: `${day} ${getMonthName(now.getMonth())}`,
          day,
          income: 0,
          expense: 0,
          isCurrent: day === now.getDate(),
        });
      }

      filteredTransactions.forEach(t => {
        const d = new Date(t.date);
        const day = d.getDate();
        if (slots[day - 1]) {
          if (t.type === 'income') slots[day - 1].income += Number(t.amount);
          else slots[day - 1].expense += Number(t.amount);
        }
      });

      return slots;
    }

    if (timeFrame === 'yearly') {
      const slots = [];
      for (let m = 0; m < 12; m++) {
        slots.push({
          label: getMonthName(m),
          month: m,
          income: 0,
          expense: 0,
          isCurrent: m === now.getMonth(),
        });
      }

      filteredTransactions.forEach(t => {
        const d = new Date(t.date);
        const m = d.getMonth();
        if (slots[m]) {
          if (t.type === 'income') slots[m].income += Number(t.amount);
          else slots[m].expense += Number(t.amount);
        }
      });

      return slots;
    }

    return [];
  }, [filteredTransactions, timeFrame]);

  // Category breakdown for expenses
  const expenseCategoryBreakdown = useMemo(() => {
    const map = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category || 'Other';
        map[cat] = (map[cat] || 0) + Number(t.amount);
      });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Category breakdown for income
  const incomeCategoryBreakdown = useMemo(() => {
    const map = {};
    filteredTransactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        const cat = t.category || 'Other';
        map[cat] = (map[cat] || 0) + Number(t.amount);
      });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        filteredTransactions,
        budgets,
        currency,
        setCurrency,
        timeFrame,
        setTimeFrame,
        dateRange,
        metrics,
        chartData,
        expenseCategoryBreakdown,
        incomeCategoryBreakdown,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        resetToMockData,
        clearAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
