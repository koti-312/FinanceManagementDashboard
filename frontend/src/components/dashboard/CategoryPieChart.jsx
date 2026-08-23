import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../data/categories';

// Dynamic donut items matching FinanceFlow theme
const DONUT_DATA = [
  { name: 'Housing & Rent', value: 35, color: '#0d9488' },
  { name: 'Food & Dining', value: 25, color: '#06b6d4' },
  { name: 'Transport', value: 18, color: '#f59e0b' },
  { name: 'Entertainment', value: 12, color: '#ec4899' },
  { name: 'Other', value: 10, color: '#8b5cf6' },
];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="p-2.5 liquid-glass-card shadow-xl text-xs space-y-0.5 border border-teal-500/20">
        <p className="font-bold text-slate-900 dark:text-white">{data.name}</p>
        <p className="font-bold text-teal-600 dark:text-teal-400 font-display">
          {data.value}% of budget
        </p>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = () => {
  return (
    <div className="liquid-glass-card p-4 sm:p-5 flex flex-col justify-between min-h-[190px]">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-display tracking-tight">
          Spending Breakdown
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Distribution across key categories
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 my-auto pt-1">
        {/* Donut Ring */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 relative flex items-center justify-center flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={DONUT_DATA}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={4}
                cornerRadius={5}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
              >
                {DONUT_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend on Right */}
        <div className="space-y-1.5 text-xs font-medium min-w-0 flex-1 pl-1">
          {DONUT_DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 dark:text-slate-300 truncate text-[11px]">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-display text-[11px]">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
