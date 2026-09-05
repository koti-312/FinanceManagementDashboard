import "./TransactionModal.css"

const TransactionModal = ({editingTransaction,formData,formError,formLoading,accounts,
  onChange,onSubmit,onClose}) => {

  return (

    <div className="transaction-modal-overlay" onClick={onClose}>
      <div
        className="transaction-modal"
        onClick={(event) => event.stopPropagation()}>
        <div className="transaction-modal-header">
          <div>
            <h2>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
            <p>
              {editingTransaction
                ? "Update transaction details."
                : "Enter your transaction details."}
            </p>
          </div>
          <button className="close-modal-btn" onClick={onClose}> x</button>
        </div>

        {formError && <div className="form-error">{formError}</div>}

        <form className="transaction-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Account *</label>
            <select name="account" value={formData.account} onChange={onChange} required>
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.accountName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={onChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required />
            </div>

            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={formData.type} onChange={onChange} required>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="investment">Investment</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={onChange} required>
              <option value="">Select Category</option>
              <option value="FOOD_AND_DRINK">Food & Drink</option>
              <option value="TRANSPORTATION">Transportation</option>
              <option value="GENERAL_MERCHANDISE">Shopping</option>
              <option value="RENT_AND_UTILITIES">Rent & Utilities</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="PERSONAL_CARE">Personal Care</option>
              <option value="TRAVEL">Travel</option>
              <option value="HEALTHCARE">Healthcare</option>
              <option value="EDUCATION">Education</option>
              <option value="LOAN_PAYMENTS">Loan Payments</option>
              <option value="TRANSFER_OUT">Transfer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Merchant Name</label>
            <input
              type="text"
              name="merchantName"
              value={formData.merchantName}
              onChange={onChange}
              placeholder="e.g. Amazon" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Add a description"
              rows="3" />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              required />
          </div>

          <div className="transaction-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={formLoading}>
              Cancel
            </button>
            <button type="submit" className="save-transaction-btn" disabled={formLoading}>

              {formLoading ? "Saving..." : editingTransaction ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default TransactionModal