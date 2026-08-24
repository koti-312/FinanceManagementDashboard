import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { exportToExcel, exportToCSV } from '../../utils/exportUtils';

const ExportButton = ({
  data = [],
  fileName = 'Transactions',
  sheetName = 'Sheet1',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExcel = () => {
    exportToExcel(data, fileName, sheetName);
    setIsOpen(false);
  };

  const handleCSV = () => {
    exportToCSV(data, fileName);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-teal-500/20 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all shadow-xs"
      >
        <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span>Export</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-2xl bg-white dark:bg-slate-900 p-1.5 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 border border-slate-100 dark:border-teal-500/20 modal-animate">
          <button
            type="button"
            onClick={handleExcel}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 dark:hover:text-teal-300 rounded-xl transition-colors text-left"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="flex flex-col">
              <span className="font-semibold">Excel Sheet</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">.xlsx format</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleCSV}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:text-cyan-700 dark:hover:text-cyan-300 rounded-xl transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <div className="flex flex-col">
              <span className="font-semibold">CSV File</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Plain text data</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
