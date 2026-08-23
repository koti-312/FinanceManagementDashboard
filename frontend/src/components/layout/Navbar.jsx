import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Settings,
  LogOut,
  User,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import TransactionFormModal from '../common/TransactionFormModal';

const Navbar = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center gap-4 py-1.5 px-1">
      {/* Left: Mobile hamburger + Dashboard Title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 glass-btn-secondary rounded-xl lg:hidden transition-colors"
          title="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            FinanceFlow Dashboard
          </h1>
          <p className="hidden sm:block text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Real-time financial analytics & expense management
          </p>
        </div>
      </div>

      {/* Center: Frosted Glass Search Pill */}
      <div className="hidden md:flex flex-1 justify-center min-w-0 px-2">
        <div className="relative flex items-center w-full max-w-[320px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-teal-400/60">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search records, categories..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-search-input rounded-full text-[13px] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Bell Icon, User Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
        {/* Theme Toggle Button */}
        <ThemeToggle size="md" />

        {/* Notification Bell with pulse indicator */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white glass-btn-secondary rounded-full transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.75]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 dark:bg-teal-400 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 liquid-glass-card rounded-2xl p-3.5 shadow-2xl z-50 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] font-semibold bg-teal-100/80 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
                  1 New
                </span>
              </div>
              <div className="p-2.5 bg-white/50 dark:bg-slate-800/60 rounded-xl text-xs space-y-0.5 border border-white/60 dark:border-teal-500/10">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                  Monthly Payout Received
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Salary deposited to primary account.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Chevron */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-200/50 dark:hover:border-teal-500/20"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"}
              alt="User profile"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-teal-500/40 shadow-xs"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 liquid-glass-card rounded-2xl p-2 shadow-2xl z-50 space-y-1">
              <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Alex Johnson'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'alex.johnson@example.com'}
                </p>
              </div>

              <Link
                to="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Settings & Theme</span>
              </Link>

              <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialType="expense"
      />
    </header>
  );
};

export default Navbar;
