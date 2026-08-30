import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"
import SummaryCard from "../components/SummaryCard/SummaryCard"
import MonthlySummary from "../components/MonthlySummary/MonthlySummary"
import ExpenseBreakdown from "../components/ExpenseBreakdown/ExpenseBreakdown"
import { getDashboardSummary, getMonthlySummary, getExpensesByCategory } from "../services/api"
import "./Dashboard.css"
import PlaidConnect from "../components/PlaidConnect"

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0, 
    totalExpenses: 0,
    totalInvestments: 0
  })
  const [monthlyData, setMonthlyData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError("")

        const [summaryData, monthlySummaryData, expenseCategoryData] = await Promise.all(
          [
            getDashboardSummary(),
            getMonthlySummary(),
            getExpensesByCategory()
          ])

        console.log("Dashboard Summary:", summaryData)
        console.log("Monthly Summary:", monthlySummaryData)
        console.log("Expenses By Category:", expenseCategoryData)

        setSummary({
          totalBalance: summaryData.summary.totalBalance || 0,
          totalIncome: summaryData.summary.totalIncome || 0,
          totalExpenses: summaryData.summary.totalExpenses || 0,
          totalInvestments: summaryData.summary.totalInvestments || 0
        })

        const monthlySummary = monthlySummaryData.monthlySummary || []

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        const currentYear = new Date().getFullYear()
        const fullYearData = monthNames.map((month, index) => {
          const monthNumber = String(index + 1).padStart(2, "0")
          const monthKey = `${currentYear}-${monthNumber}`

          const existingMonth = monthlySummary.find(item => item.month === monthKey)
          return {
            month,
            income: existingMonth?.income || 0,
            expenses: existingMonth?.expenses || 0
          }
        })
        setMonthlyData(fullYearData)

        const categoryData = Object.entries(expenseCategoryData.expensesByCategory || {})
          .map(([name, value]) => ({
            name,
            value
          }))
        setExpenseData(categoryData)
      }
       catch (error) {
        console.error("Dashboard Error:", error)
        setError(error.message)
      } 
      finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])


  return (
    <div className="dashboard-layout">
      
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <main className="dashboard-content">

          <div className="dashboard-header-flex"> 
            <div className="dashboard-header">
            <h2>Financial Overview</h2>
            <p>Track your personal finances in one place.</p>
          </div>
            <PlaidConnect/>
          </div>
          
          {loading && (
            <p className="dashboard-message">
              Loading dashboard...
            </p>
          )}

          {error && (
            <p className="dashboard-error">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="summary-grid">
                <SummaryCard
                  title="Total Balance"
                  amount={summary.totalBalance} />
                <SummaryCard
                  title="Total Income"
                  amount={summary.totalIncome} />
                <SummaryCard
                  title="Total Expenses"
                  amount={summary.totalExpenses} />
                <SummaryCard
                  title="Total Investments"
                  amount={summary.totalInvestments} />
              </div>

              <MonthlySummary data={monthlyData} />
              <ExpenseBreakdown data={expenseData} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard