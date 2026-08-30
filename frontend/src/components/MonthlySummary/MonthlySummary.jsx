import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } 
from "recharts"

const MonthlySummary = ({ data }) => {
  return (

    <div className="chart-card">

      <div className="chart-header">
        <h3>Monthly Income vs Expenses</h3>
        <p>Compare your income and expenses each month.</p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>

          <BarChart data={data} barGap={2} barCategoryGap="3%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="month" interval={0} tick={{ fontSize: 14, fill: "#6b7280" }}
              axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 14, fill: "#6b7280" }} axisLine={false} tickLine={false} />

            <Tooltip cursor={false} contentStyle={{
              borderRadius: 8, border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              } />

            <Legend />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={22} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={22} />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default MonthlySummary