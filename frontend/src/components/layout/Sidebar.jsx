import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  ReceiptText,
  Target,
  Settings,
  LogOut,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutGrid,
  },
  {
    path: '/income',
    label: 'Income Analytics',
    icon: TrendingUp,
  },
  {
    path: '/expense',
    label: 'Expense Tracking',
    icon: TrendingDown,
  },
  {
    path: '/transactions',
    label: 'Transactions Ledger',
    icon: ReceiptText,
  },
  {
    path: '/budgets',
    label: 'Budgets & Goals',
    icon: Target,
  },
  {
    path: '/settings',
    label: 'Preferences & Theme',
    icon: Settings,
  },
];

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Floating Left Capsule Dock */}
      <aside
        className={`fixed top-5 left-4 z-50 w-[64px] h-[calc(100vh-40px)] max-h-[860px] liquid-glass-dock flex flex-col items-center justify-between py-4 px-2 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-32'
        }`}
      >
        {/* Top FinanceFlow Brand Logo Icon */}
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="group relative flex items-center justify-center p-1.5 rounded-2xl hover:scale-105 transition-transform"
          title="FinanceFlow"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/35 ring-1 ring-white/40">
            <Wallet className="w-5 h-5 stroke-[2.25]" />
          </div>
        </NavLink>

        {/* Navigation Dock Icons */}
        <nav className="flex flex-col items-center gap-4 my-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onCloseMobile}
                title={item.label}
                className={({ isActive }) =>
                  `relative flex items-center justify-center w-11 h-11 rounded-[15px] transition-all duration-200 ${
                    isActive
                      ? 'dock-item-glowing scale-105'
                      : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-white/50 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left Active Cyan/Teal Indicator Bar on Dock Edge */}
                    {isActive && (
                      <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-[4px] h-6 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full shadow-[0_0_12px_2px_rgba(6,182,212,0.7)]" />
                    )}
                    <Icon
                      className={`w-[20px] h-[20px] stroke-[2] ${
                        isActive ? 'text-white drop-shadow-sm' : ''
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Exit Icon */}
        <button
          type="button"
          onClick={logout}
          title="Sign Out"
          className="flex items-center justify-center w-10 h-10 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 rounded-2xl transition-colors"
        >
          <LogOut className="w-5 h-5 stroke-[1.75]" />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
