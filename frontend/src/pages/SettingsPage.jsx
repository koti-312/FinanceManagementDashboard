import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  DollarSign,
  Save,
  RotateCcw,
  Trash2,
  Download,
  Check,
  Shield,
  Palette,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { CURRENCIES } from '../utils/formatters';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { exportToExcel } from '../utils/exportUtils';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

const SettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const {
    currency,
    setCurrency,
    transactions,
    resetToMockData,
    clearAllData,
  } = useFinance();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || PRESET_AVATARS[0]);
  const [savingsTarget, setSavingsTarget] = useState(user?.monthlySavingsTarget || 2500);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      avatar,
      monthlySavingsTarget: Number(savingsTarget) || 2000,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    exportToExcel(transactions, 'FinanceFlow_Full_Backup', 'All_Transactions');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="flex items-center gap-3.5 p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-teal-500/20 shadow-xs">
        <div className="p-3 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-2xl">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
            Preferences & Appearance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your personal profile, theme mode, currency format, and data ledger storage
          </p>
        </div>
      </div>

      {/* Appearance & Theme Section */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
            Appearance & Theme
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select your preferred interface style. Choose between Dark Mode, Light Mode, or automatic System synchronization.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              theme === 'dark'
                ? 'bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/10'
                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-teal-400/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-slate-900 text-teal-400 border border-teal-500/30">
                <Moon className="w-5 h-5" />
              </div>
              {theme === 'dark' && (
                <span className="p-1 bg-teal-500 text-white rounded-full">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode (Recommended)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Deep teal & slate ambience with luminous neon glass cards
              </p>
            </div>
          </button>

          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              theme === 'light'
                ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/10'
                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-teal-400/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-500 border border-amber-200">
                <Sun className="w-5 h-5" />
              </div>
              {theme === 'light' && (
                <span className="p-1 bg-teal-500 text-white rounded-full">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Crisp and bright canvas with clean frosted glass elements
              </p>
            </div>
          </button>

          {/* System Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              theme === 'system'
                ? 'bg-teal-950/40 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/40 shadow-lg shadow-teal-500/10'
                : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-teal-400/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Laptop className="w-5 h-5" />
              </div>
              {theme === 'system' && (
                <span className="p-1 bg-teal-500 text-white rounded-full">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">System Auto</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically matches your device operating system theme
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
              User Profile
            </h3>
          </div>
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Check className="w-3.5 h-3.5" /> Saved successfully
            </span>
          )}
        </div>

        {/* Avatar Picker */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Select Avatar
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {PRESET_AVATARS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatar(url)}
                className={`relative rounded-full transition-all ${
                  avatar === url
                    ? 'ring-4 ring-teal-500 scale-105 shadow-md'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-teal-500/25 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-teal-500/25 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40"
              placeholder="Your email"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Monthly Savings Target ({currency})
          </label>
          <input
            type="number"
            value={savingsTarget}
            onChange={(e) => setSavingsTarget(e.target.value)}
            className="w-full sm:w-1/2 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-teal-500/25 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40"
            placeholder="e.g. 2500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Currency & Localization */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
            Preferred Currency
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose your base currency. All calculations, chart tooltips, and transaction cards will adapt format instantly.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              className={`p-3 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between ${
                currency === c.code
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="text-left">
                <p className="text-sm font-bold font-display">{c.symbol}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{c.code}</p>
              </div>
              {currency === c.code && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Data Management Section */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-teal-500/15 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
            Data Storage & Backup
          </h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          {/* Backup Download */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Export Full Ledger</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Download complete financial dataset in Excel (.xlsx) format</p>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Export Excel</span>
            </button>
          </div>

          {/* Reset Mock Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40">
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-300">Reset Demo Starter Data</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80">Restore sample transactions, categories, and charts</p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Samples</span>
            </button>
          </div>

          {/* Clear All */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/40">
            <div>
              <p className="font-bold text-rose-900 dark:text-rose-300">Wipe All Transactions</p>
              <p className="text-xs text-rose-700/80 dark:text-rose-400/80">Delete all recorded transactions and start fresh</p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={resetToMockData}
        title="Reset to Sample Data"
        message="This will replace current entries with realistic starter financial sample records. Continue?"
        confirmText="Reset Now"
        type="warning"
      />

      <ConfirmDialog
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Transactions"
        message="Are you sure you want to delete all transaction records from your ledger? This action cannot be recovered."
        confirmText="Clear Everything"
        type="danger"
      />
    </div>
  );
};

export default SettingsPage;
