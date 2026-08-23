import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PlusCircle, Save, Calendar, DollarSign, Tag, FileText, CreditCard } from 'lucide-react';
import Modal from './Modal';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../data/categories';
import { useFinance } from '../../context/FinanceContext';

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Cash',
  'Apple Pay / Google Pay',
  'Stripe / PayPal',
  'Other',
];

const TransactionFormModal = ({
  isOpen,
  onClose,
  initialType = 'expense',
  editItem = null,
  lockType = false,
}) => {
  const { addTransaction, updateTransaction, currency } = useFinance();

  const [type, setType] = useState(initialType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editItem) {
      setType(editItem.type || initialType);
      setDescription(editItem.description || '');
      setAmount(editItem.amount ? String(editItem.amount) : '');
      setCategory(editItem.category || '');
      setDate(
        editItem.date
          ? new Date(editItem.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setPaymentMethod(editItem.paymentMethod || 'Credit Card');
      setNotes(editItem.notes || '');
    } else {
      setType(initialType);
      setDescription('');
      setAmount('');
      setCategory(initialType === 'income' ? 'Salary' : 'Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Credit Card');
      setNotes('');
    }
    setErrors({});
  }, [editItem, initialType, isOpen]);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('Salary');
    } else {
      setCategory('Food & Dining');
    }
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const newErrors = {};
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type,
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date(date + 'T12:00:00').toISOString(),
      paymentMethod,
      notes: notes.trim(),
    };

    if (editItem) {
      updateTransaction(editItem.id, payload);
    } else {
      addTransaction(payload);
      if (type === 'income') {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#0d9488', '#06b6d4', '#10b981'],
          });
        } catch (err) {}
      }
    }

    onClose();
  };

  const title = editItem
    ? `Edit ${type === 'income' ? 'Income Record' : 'Expense Record'}`
    : `Add ${type === 'income' ? 'New Income' : 'New Expense'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle (if not locked) */}
        {!lockType && !editItem && (
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-teal-500/20">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                type === 'income'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Amount ({currency}) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-teal-400/60">
              <DollarSign className="w-5 h-5" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.amount
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                  : type === 'income'
                  ? 'border-slate-200 dark:border-teal-500/30 focus:border-teal-500 focus:ring-teal-200 dark:focus:ring-teal-900/40'
                  : 'border-slate-200 dark:border-rose-500/30 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/40'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Description *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <FileText className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={type === 'income' ? 'e.g. Client Payment, Freelance Project' : 'e.g. Grocery store, Internet bill'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-teal-500/25 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40 transition-all ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : ''
              }`}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
          )}
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all text-left ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 font-bold ring-1 ring-teal-500/40 shadow-xs'
                      : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
          {errors.category && (
            <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
          )}
        </div>

        {/* Date and Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-teal-500/25 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-rose-500">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <CreditCard className="w-4 h-4" />
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-teal-500/25 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40 cursor-pointer"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm} className="dark:bg-slate-800">
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="Add invoice ID, merchant info, or extra details"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-teal-500/25 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/40"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${
              type === 'income'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-teal-600/25'
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-rose-600/25'
            }`}
          >
            {editItem ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{editItem ? 'Save Changes' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
