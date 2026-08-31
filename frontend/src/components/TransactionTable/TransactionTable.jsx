import "./TransactionTable.css"

import { Pencil, Trash2 } from "lucide-react"

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  
  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  const formatDate = (date) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  return (
    <div className="transactions-table-container">

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Category</th>
            <th>Account</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>
                <strong>
                  {transaction.merchantName || transaction.description || "Unknown"}
                </strong>
              </td>
              <td>{transaction.category || "Other"}</td>
              <td>{transaction.account?.accountName || "Unknown Account"}</td>
              <td>
                <span className={`transaction-type ${transaction.type}`}>
                  {transaction.type}
                </span>
              </td>
              <td>
                <span className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : ""}
                  {formatAmount(transaction.amount)}
                </span>
              </td>
              <td>{formatDate(transaction.date)}</td>
              <td>
                <div className="transaction-actions">
                  <button className="edit-btn" onClick={() => onEdit(transaction)} title="Edit">
                    <Pencil size={16} />
                  </button>

                  <button className="delete-btn" onClick={() => onDelete(transaction)} title="Delete" >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable