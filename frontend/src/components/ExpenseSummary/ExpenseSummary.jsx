import "./ExpenseSummary.css"

const ExpenseSummary = ({ totalExpenses }) => {
  return (
    <div className="expense-summary-card">
      <div>
        <p>Total Expenses</p>
        <h3>
          ₹{Number(totalExpenses).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </h3>
      </div>
      <div className="expense-summary-icon">₹</div>
    </div>
  )
}

export default ExpenseSummary