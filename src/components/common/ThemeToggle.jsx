import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({
  variant = 'icon', // 'icon' | 'pill' | 'segmented'
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-teal-500/20 backdrop-blur-md shadow-inner transition-colors ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
            theme === 'light'
              ? 'bg-white text-teal-700 shadow-sm shadow-teal-500/10'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Light Theme"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Dark Theme"
        >
          <Moon className="w-3.5 h-3.5 text-teal-200" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
            theme === 'system'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="System Sync"
        >
          <Laptop className="w-3.5 h-3.5 text-slate-400" />
          <span>Auto</span>
        </button>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
          isDark
            ? 'bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-500/10'
            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
        } ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
            <span>Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
            <span>Light</span>
          </>
        )}
      </button>
    );
  }

  // Default icon variant
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-9 h-9 p-2',
    lg: 'w-10 h-10 p-2.5',
  }[size] || 'w-9 h-9 p-2';

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
  }[size] || 'w-4.5 h-4.5';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${sizeClasses} ${
        isDark
          ? 'bg-slate-800/80 hover:bg-slate-700/80 text-teal-300 border border-teal-500/30 shadow-lg shadow-teal-500/15'
          : 'bg-white/80 hover:bg-white text-amber-600 border border-slate-200/90 shadow-sm hover:shadow'
      } backdrop-blur-md ${className}`}
      title={`Toggle theme (Current: ${isDark ? 'Dark' : 'Light'})`}
      aria-label={`Toggle theme (Current: ${isDark ? 'Dark' : 'Light'})`}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        {isDark ? (
          <Moon className={`${iconSizes} text-teal-300 transition-transform duration-300 rotate-0`} />
        ) : (
          <Sun className={`${iconSizes} text-amber-500 transition-transform duration-300 rotate-0`} />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
