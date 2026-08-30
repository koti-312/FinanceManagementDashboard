import "./TransactionHeader.css"

const TransactionHeader = ({ onAdd }) => {
  return (
    <div className="transactions-header">

      <div>
        <h2>Transactions</h2>
        <p>Manage your income and expenses.</p>
      </div>
      <button className="add-transaction-btn" onClick={onAdd}>
        + Add Transaction
      </button>
      
    </div>
  )
}

export default TransactionHeader