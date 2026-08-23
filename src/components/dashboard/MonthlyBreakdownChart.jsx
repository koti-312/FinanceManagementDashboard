import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const BREAKDOWN_DATA = [
  { month: 'Jan', savings: 1300, income: 2900 },
  { month: 'Feb', savings: 1500, income: 3100 },
  { month: 'Mar', savings: 1800, income: 3100 },
  { month: 'Apr', savings: 1400, income: 2900 },
  { month: 'May', savings: 2400, income: 3300 },
  { month: 'Jun', savings: 2100, income: 3100 },
  { month: 'Jul', savings: 2200, income: 3400 },
  { month: 'Aug', savings: 2500, income: 3600 },
];

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    return (
      <div className="p-3 liquid-glass-card shadow-2xl text-xs space-y-1.5 min-w-[140px] border border-teal-500/20">
        <p className="font-bold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
          {label} Breakdown
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white font-display">
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
        <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between font-bold text-slate-900 dark:text-white">
          <span>Total Pool:</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyBreakdownChart = () => {
  const { resolvedTheme } = useTheme();
  const { currency } = useFinance();
  const isDark = resolvedTheme === 'dark';

  const axisTickColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="liquid-glass-card p-5 pb-3 space-y-2">
      {/* Header with Title and Legend */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white font-display tracking-tight">
            Monthly Breakdown
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Savings retained vs operational revenue
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Savings</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 sm:h-[236px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={BREAKDOWN_DATA} margin={{ top: 8, right: 12, left: -16, bottom: -4 }} barCategoryGap="30%">
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: axisTickColor, fontSize: 11, fontWeight: 500 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: axisTickColor, fontSize: 11 }}
              tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              domain={[0, 7000]}
              tickMargin={6}
            />
            <Tooltip
              content={<CustomTooltip currency={currency} />}
              cursor={{ fill: isDark ? 'rgba(45, 212, 191, 0.08)' : 'rgba(13, 148, 136, 0.06)' }}
            />

            {/* Stacked Bars — Teal base, Cyan top */}
            <Bar
              dataKey="income"
              name="Income"
              stackId="a"
              fill="#0d9488"
              maxBarSize={28}
              isAnimationActive={false}
            />
            <Bar
              dataKey="savings"
              name="Savings"
              stackId="a"
              fill="#22d3ee"
              radius={[8, 8, 0, 0]}
              maxBarSize={28}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBreakdownChart;
