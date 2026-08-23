import React from 'react';

const TimeFrameToggle = ({
  timeFrame,
  setTimeFrame,
  options = ['daily', 'weekly', 'monthly', 'yearly'],
  color = 'teal',
  size = 'md',
}) => {
  const activeColorClasses = {
    teal: 'bg-teal-600 text-white shadow-md shadow-teal-600/25',
    rose: 'bg-rose-600 text-white shadow-md shadow-rose-600/25',
    orange: 'bg-orange-500 text-white shadow-md shadow-orange-500/25',
    indigo: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25',
  }[color] || 'bg-teal-600 text-white';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs sm:text-sm',
    lg: 'px-4 py-2 text-sm',
  }[size] || 'px-3 py-1.5 text-sm';

  return (
    <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-teal-500/20 shadow-inner">
      {options.map((opt) => {
        const isActive = timeFrame === opt;
        return (
          <button
            key={opt}
            onClick={() => setTimeFrame(opt)}
            type="button"
            className={`${sizeClasses} font-medium rounded-xl capitalize transition-all duration-200 ${
              isActive
                ? `${activeColorClasses} font-bold`
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};

export default TimeFrameToggle;
