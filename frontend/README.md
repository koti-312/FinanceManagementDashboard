# 💎 FinanceFlow - Personal Finance & Expense Management Dashboard

A modern, full-featured **Personal Finance Management Dashboard** built with **React 19**, **Vite**, **Tailwind CSS 4**, and **Recharts**. FinanceFlow features a liquid glassmorphic design system, intelligent analytics, comprehensive transaction management, category budgets, Excel/CSV exports, and seamless **Light & Dark Mode**.

---

## ✨ Features

- 🌓 **Dynamic Light & Dark Mode**: Persistent theme state with smooth transitions, custom ambient glow canvases, and system auto-sync.
- 📊 **Real-time Analytics & Charts**:
  - **Earnings Overview**: Cash inflow vs outflow wave area charts.
  - **Monthly Breakdown**: Savings retained vs operational revenue stacked bar charts.
  - **Category Spending Donut**: Interactive breakdown of expense categories.
  - **Flexible Timeframes**: Toggle between Daily, Weekly, Monthly, and Yearly intervals.
- 💳 **Transaction Ledger**:
  - Filter by type (Income/Expense), category, date, or amount.
  - Full-text search across descriptions, notes, and payment methods.
  - Inline record editing, pagination, and modal editors with celebratory confetti.
- 🎯 **Budgets & Goals**:
  - Category spending limit matrix with live utilization meters.
  - Financial health score calculation (Excellent, Moderate, Critical).
- ⚙️ **Customization & Data Storage**:
  - Profile customization & avatar picker.
  - Multi-currency support (USD `$`, EUR `€`, GBP `£`, JPY `¥`, CAD `$`, AUD `$`, INR `₹`, CHF `Fr`).
  - Full dataset backup export to **Excel (.xlsx)** and **CSV**.
  - Demo starter data restore and ledger reset.
- 🔐 **Authentication Flows**:
  - Sign In & Sign Up pages with client-side state management.
  - Instant one-click **Guest Demo Login**.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Vanilla CSS Glassmorphism
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Exporting**: [SheetJS (xlsx)](https://sheetjs.com/)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/koti-312/FinanceManagementDashboard.git
   cd FinanceManagementDashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Images & static media
│   ├── components/
│   │   ├── common/         # StatCard, Modal, ThemeToggle, ConfirmDialog, ExportButton
│   │   ├── dashboard/      # Analytical charts, Quick Actions, Recent Activity
│   │   ├── layout/         # Navbar, Sidebar dock, MainLayout
│   │   └── transactions/   # Filter bar, TransactionItem
│   ├── context/            # ThemeContext, AuthContext, FinanceContext
│   ├── data/               # Categories metadata, realistic mock datasets
│   ├── pages/              # Dashboard, Income, Expense, Transactions, Budgets, Settings, Auth
│   ├── utils/              # Currency/Date formatters, Excel export utilities
│   ├── App.jsx             # Route definitions & Provider wrappers
│   ├── index.css           # Design tokens, liquid glass cards, theme variables
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
