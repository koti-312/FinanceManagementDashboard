import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const EARNINGS_DATA = [
  { month: 'Jan', income: 4200, expenses: 2100 },
  { month: 'Feb', income: 4600, expenses: 2300 },
  { month: 'Mar', income: 4900, expenses: 2500 },
  { month: 'Apr', income: 4300, expenses: 2800 },
  { month: 'May', income: 5700, expenses: 2900 },
  { month: 'Jun', income: 5200, expenses: 2400 },
  { month: 'Jul', income: 5600, expenses: 2600 },
  { month: 'Aug', income: 6100, expenses: 2700 },
  { month: 'Sep', income: 5870, expenses: 2074 },
];

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 liquid-glass-card shadow-2xl text-xs space-y-1.5 min-w-[140px] border border-teal-500/20">
        <p className="font-bold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
          {label} Overview
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium capitalize">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.stroke || entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white font-display">
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const EarningsOverviewChart = () => {
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
            Earnings Overview
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Monthly cash inflow vs outflow comparison
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Expenses</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 sm:h-[236px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={EARNINGS_DATA} margin={{ top: 8, right: 12, left: -16, bottom: -4 }}>
            <defs>
              <linearGradient id="liquidCyanWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.65} />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="liquidRoseWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.55} />
                <stop offset="60%" stopColor="#fb7185" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#fb7185" stopOpacity={0.0} />
              </linearGradient>
            </defs>

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
              cursor={{ stroke: isDark ? 'rgba(45, 212, 191, 0.25)' : 'rgba(15, 23, 42, 0.15)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#0d9488"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#liquidCyanWave)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#liquidRoseWave)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsOverviewChart;
