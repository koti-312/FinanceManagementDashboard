# Personal Finance Management Dashboard - Frontend

A responsive Personal Finance Management Dashboard built with React.js. It allows users to manage income, expenses, transactions, budgets, view financial summaries and charts, and connect bank accounts using Plaid Sandbox.

## 🚀 Features

- User Registration and Login
- JWT-based Authentication
- Financial Dashboard
- Total Balance, Income, Expenses and Investments
- Monthly Income vs Expenses Chart
- Expense Breakdown Chart
- Bank Account Connection using Plaid
- Accounts Management
- Transaction Management
- Add, Edit and Delete Transactions
- Income and Expense Management
- Budget Management
- Loading and Error Handling
- Responsive UI


## 🛠️ Technologies Used

- React.js
- JavaScript (ES6+)
- React Router
- Recharts
- CSS3
- Plaid
- Vite
- Git & GitHub

## 📁 Project Structure

frontend/
│
├── public/
│   └── ...
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── SummaryCard/
│   │   ├── MonthlySummary/
│   │   ├── ExpenseBreakdown/
│   │   └── PlaidConnect.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Account.jsx
│   │   ├── Transaction.jsx
│   │   ├── Income.jsx
│   │   ├── Expense.jsx
│   │   └── Budget.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── package.json
└── README.md

## Plaid Integration

The application uses Plaid Sandbox for bank account connection. 
Frontend Flow: User → Plaid Link → Bank Connection → Public Token → Backend → Account and Transaction Data

## Backend API

The frontend communicates with the backend using REST APIs.
Local API URL:
http://localhost:4000/api

API sections:

/api/auth
/api/plaid
/api/accounts
/api/transactions
/api/dashboard
/api/budgets


## ⚙️ Installation

1. Clone the repository : https://github.com/koti-312/FinanceManagementDashboard.git  

2. Open the frontend folder:

```bash
cd frontend
```
3. Install dependencies:

```bash
npm install
```
4. Start the development server:

```bash
npm run dev
```
The frontend normally runs on:  http://localhost:5173

## Authentication

After login, the backend returns a JWT token. The frontend uses this token to access protected APIs.

## Build & Preview

1. To create a production build:

npm run build

This creates the optimized production files inside the `dist/` folder.

2. To preview the production build locally:

npm run preview

The production preview will normally run on:  http://localhost:4173


## Deployment

The frontend can be deployed using Vercel. Before deployment, update the API URL from: http://localhost:4000/api to the deployed backend URL.

## Project

Personal Finance Management (PFM) Dashboard A full-stack finance management application built using React.js, Node.js, Express.js, MongoDB, Mongoose and Plaid.