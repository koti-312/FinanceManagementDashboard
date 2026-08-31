import "./IncomeTransaction.css"

const IncomeTransactions = ({ transactions }) => {
  return (
    <div className="income-transactions-card">
      
      <div className="income-transactions-header">
        <h3>Income Transactions</h3>
        <p>Recent income received.</p>
      </div>
      {transactions.length === 0 ? (
        <div className="income-empty">No income transactions found.</div>
      ) : (
        <div className="income-table-wrapper">
          <table className="income-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Category</th>
                <th>Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.date).toLocaleDateString("en-IN")}</td>
                  <td>{transaction.merchantName || transaction.description || "Unknown"}</td>
                  <td>{transaction.category || "Other"}</td>
                  <td>{transaction.account?.accountName || "Unknown"}</td>
                  <td className="income-amount">
                    +₹{Number(transaction.amount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default IncomeTransactions