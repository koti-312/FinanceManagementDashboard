import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Account from "./pages/Account.jsx"
import Transaction from "./pages/Transaction.jsx"
import Income from "./pages/Income.jsx"
import Expense from "./pages/Expense.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import Budget from "./pages/Budget.jsx"

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Account/>} />
        <Route path="/transactions"element={<Transaction />}/>
        <Route path="/income" element={<Income/>}/>
        <Route path="/expenses" element={<Expense/>}/>
        <Route path="/budgets" element={<Budget/>}/>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App