import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"
import IncomeSummary from "../components/IncomeSummary/IncomeSummary"
import MonthlyIncomeChart from "../components/MonthlyIncomeChart/MonthlyIncomeChart"
import IncomeTransactions from "../components/IncomeTransaction/IncomeTransaction"
import { getDashboardSummary, getMonthlySummary, getTransactions } from "../services/api"
import "./Income.css"

const Income = () => {
  const [totalIncome, setTotalIncome] = useState(0)
  const [monthlyData, setMonthlyData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        setLoading(true)
        setError("")

        const [summaryData, monthlyDataResponse, transactionsData] = await Promise.all([
          getDashboardSummary(),
          getMonthlySummary(),
          getTransactions()
        ])
        setTotalIncome(summaryData.summary.totalIncome || 0)

        const monthlySummary = monthlyDataResponse.monthlySummary || []
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentYear = new Date().getFullYear()
        const fullYearData = monthNames.map((month, index) => {
          const monthKey = `${currentYear}-${String(index + 1).padStart(2, "0")}`
          const existingMonth = monthlySummary.find(item => item.month === monthKey)
          return {
            month,
            income: existingMonth?.income || 0
          }
        })
        setMonthlyData(fullYearData)

        const incomeTransactions = (transactionsData.transactions || []).filter(transaction => transaction.type === "income")
        setTransactions(incomeTransactions)
      }
       catch (error) {
        console.error("Income Error:", error)
        setError(error.message)
      } 
      finally {
        setLoading(false)
      }
    }
    fetchIncomeData()
  }, [])

  return (
    
    <div className="income-layout">
      <Sidebar />
      <div className="income-main">
        <Navbar />
        <main className="income-content">
          <div className="income-header">
            <h2>Income</h2>
            <p>Track and manage your income.</p>
          </div>
          {loading && <p className="income-message">Loading income...</p>}
          {error && <p className="income-error">{error}</p>}
          {!loading && !error && (
            <>
              <IncomeSummary totalIncome={totalIncome} />
              <MonthlyIncomeChart data={monthlyData} />
              <IncomeTransactions transactions={transactions} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Income