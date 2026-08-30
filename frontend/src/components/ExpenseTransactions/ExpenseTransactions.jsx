import "./ExpenseTransactions.css"

const ExpenseTransactions = ({ transactions }) => {

  return (
    <div className="expense-transactions-card">

      <div className="expense-transactions-header">
        <h3>Expense Transactions</h3>
        <p>Recent expenses.</p>
      </div>
      {transactions.length === 0 ? (
        <div className="expense-empty">No expense transactions found.</div>
      ) : (
        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
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
                  <td className="expense-amount">
                    -₹{Number(transaction.amount).toLocaleString("en-IN", {
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

export default ExpenseTransactions