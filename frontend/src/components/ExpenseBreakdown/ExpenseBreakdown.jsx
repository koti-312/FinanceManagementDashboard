import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

const ExpenseBreakdown = ({ data }) => {
  const COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444","#06b6d4","#8b5cf6",
    "#ec4899","#84cc16"]

  return (
    <div className="chart-card expense-chart-card">
      
      <div className="chart-header">
        <h3>Expense Breakdown</h3>
        <p>See where your money is being spent.</p>
      </div>
      {data.length > 0 ? (
        <div className="expense-chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={140}
                paddingAngle={2}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="no-expense-data">
          <p>No expense data available.</p>
        </div>
      )}
    </div>
  )
}

export default ExpenseBreakdown