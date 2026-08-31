import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"
import ExpenseSummary from "../components/ExpenseSummary/ExpenseSummary"
import MonthlyExpenseChart from "../components/MonthlyExpenseChart/MonthlyExpenseChart"
import ExpenseTransactions from "../components/ExpenseTransactions/ExpenseTransactions"
import { getDashboardSummary, getMonthlySummary, getTransactions } from "../services/api"
import "./Expense.css"

const Expense = () => {

  const [totalExpenses, setTotalExpenses] = useState(0)
  const [monthlyData, setMonthlyData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setLoading(true)
        setError("")

        const [summaryData, monthlyDataResponse, transactionsData] = await Promise.all([
          getDashboardSummary(),
          getMonthlySummary(),
          getTransactions()
        ])
        setTotalExpenses(summaryData.summary.totalExpenses || 0)
        const monthlySummary = monthlyDataResponse.monthlySummary || []
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentYear = new Date().getFullYear()

        const fullYearData = monthNames.map((month, index) => {
          const monthKey = `${currentYear}-${String(index + 1).padStart(2, "0")}`
          const existingMonth = monthlySummary.find(item => item.month === monthKey)
          return {
            month,
            expenses: existingMonth?.expenses || 0
          }
        })
        setMonthlyData(fullYearData)
        const expenseTransactions = (transactionsData.transactions || []).filter(transaction => transaction.type === "expense")
        setTransactions(expenseTransactions)
      }
      catch (error) {
        console.error("Expenses Error:", error)
        setError(error.message)
      }
      finally {
        setLoading(false)
      }
    }
    fetchExpenseData()
  }, [])

  return (
    <div className="expenses-layout">

      <Sidebar />
      <div className="expenses-main">
        <Navbar />
        <main className="expenses-content">

          <div className="expenses-header">
            <h2>Expenses</h2>
            <p>Track and manage your expenses.</p>
          </div>
          
          {loading && <p className="expenses-message">Loading expenses...</p>}
          {error && <p className="expenses-error">{error}</p>}

          {!loading && !error && (
            <>
              <ExpenseSummary totalExpenses={totalExpenses} />
              <MonthlyExpenseChart data={monthlyData} />
              <ExpenseTransactions transactions={transactions} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Expense