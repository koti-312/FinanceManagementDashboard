import "./IncomeSummary.css"

const IncomeSummary = ({ totalIncome }) => {
  return (
    <div className="income-summary-card">
      <div>
        <p>Total Income</p>
        <h3>
          ₹{Number(totalIncome).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </h3>
      </div>
      <div className="income-summary-icon">₹</div>
    </div>
  )
}

export default IncomeSummary