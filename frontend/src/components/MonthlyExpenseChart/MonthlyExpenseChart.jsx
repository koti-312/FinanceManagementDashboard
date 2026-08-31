import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import "./MonthlyExpenseChart.css"

const MonthlyExpenseChart = ({ data }) => {
  return (
    <div className="monthly-expense-card">

      <div className="monthly-expense-header">
        <h3>Monthly Expenses</h3>
        <p>View your expenses for each month.</p>
      </div>
      <div className="monthly-expense-chart">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={data} barCategoryGap="10%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" interval={0} axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: "#6b7280" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: "#6b7280" }} />
            <Tooltip
              cursor={false}
              contentStyle={{
                border: "none",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
              }}
              formatter={value =>
                `₹${Number(value).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              }
            />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default MonthlyExpenseChart