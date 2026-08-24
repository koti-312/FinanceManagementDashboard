import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

const LoginPage = () => {
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.johnson@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    login(email, password);
    navigate('/');
  };

  const handleGuestDemo = () => {
    guestLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-teal-50 to-slate-200 dark:from-slate-950 dark:via-teal-950 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Glow decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle size="md" />
      </div>

      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/60 dark:border-teal-500/20 relative z-10 space-y-6 transition-all duration-300">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/30 mb-2">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold font-logo bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 dark:from-teal-400 dark:via-cyan-300 dark:to-teal-300 bg-clip-text text-transparent">
            FinanceFlow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to track your expenses and financial health
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-teal-500/25 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-teal-500/25 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
              <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.01]"
          >
            Sign In
          </button>
        </form>

        {/* Demo Fast Track Login */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button
            type="button"
            onClick={handleGuestDemo}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors border border-slate-200/60 dark:border-teal-500/20"
          >
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Instant Guest Demo Login</span>
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
