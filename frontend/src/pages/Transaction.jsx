import { useEffect, useState } from "react"
import { getTransactions, getAccounts, addTransaction, updateTransaction, deleteTransaction } from "../services/api"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"
import TransactionHeader from "../components/TransactionHeader/TransactionHeader"
import TransactionTable from "../components/TransactionTable/TransactionTable"
import TransactionModal from "../components/TransactionModal/TransactionModal"
import "./Transaction.css"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const [formData, setFormData] = useState({
    account: "",
    amount: "",
    type: "expense",
    category: "",
    merchantName: "",
    description: "",
    date: ""
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")

      const [transactionData, accountData] = await Promise.all([
        getTransactions(),
        getAccounts()
      ])

      setTransactions(transactionData.transactions || [])
      setAccounts(accountData.accounts || [])
    } 
    catch (error) {
      console.error("Transactions Page Error:", error)
      setError(error.message)
    } 
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const handleAddClick = () => {
    setEditingTransaction(null)
    setFormError("")
    setFormData({
      account: accounts[0]?._id || "",
      amount: "",
      type: "expense",
      category: "",
      merchantName: "",
      description: "",
      date: new Date().toISOString().split("T")[0]
    })
    setShowForm(true)
  }

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction)
    setFormError("")
    setFormData({
      account: transaction.account?._id || transaction.account || "",
      amount: transaction.amount || "",
      type: transaction.type || "expense",
      category: transaction.category || "",
      merchantName: transaction.merchantName || "",
      description: transaction.description || "",
      date: transaction.date
        ? new Date(transaction.date).toISOString().split("T")[0]
        : ""
    })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    if (formLoading) {
      return
    }
    setShowForm(false)
    setEditingTransaction(null)
    setFormError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")

    if (!formData.account) {
      setFormError("Please select an account")
      return
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setFormError("Please enter a valid amount")
      return
    }

    if (!formData.category.trim()) {
      setFormError("Please enter a category")
      return
    }

    if (!formData.date) {
      setFormError("Please select a date")
      return
    }

    try {
      setFormLoading(true)

      if (editingTransaction) {
        const data = await updateTransaction(editingTransaction._id, {
          account: formData.account,
          amount: Number(formData.amount),
          type: formData.type,
          category: formData.category.trim(),
          merchantName: formData.merchantName.trim(),
          description: formData.description.trim(),
          date: formData.date
        })

        setTransactions((previous) =>
          previous.map((transaction) =>
            transaction._id === editingTransaction._id ? data.transaction : transaction
          )
        )
      }
      else {
        const data = await addTransaction({
          account: formData.account,
          amount: Number(formData.amount),
          type: formData.type,
          category: formData.category.trim(),
          merchantName: formData.merchantName.trim(),
          description: formData.description.trim(),
          date: formData.date
        })

        setTransactions((previous) => [data.transaction, ...previous])
      }

      handleCloseForm()
    } 
    catch (error) {
      console.error("Transaction Save Error:", error)
      setFormError(error.message || "Failed to save transaction")
    } 
    finally {
      setFormLoading(false)
    }
  }

  const handleDeleteClick = async (transaction) => {
    try {
      await deleteTransaction(transaction._id)
      setTransactions((previous) =>
        previous.filter((item) => item._id !== transaction._id)
      )
    }
     catch (error) {
      console.error("Delete Transaction Error:", error)
      setError(error.message || "Failed to delete transaction")
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <main className="dashboard-content">
          <TransactionHeader onAdd={handleAddClick} />

          {error && <div className="transactions-error">{error}</div>}

          {loading && <p className="dashboard-message">Loading transactions...</p>}

          {!loading && !error && transactions.length === 0 && (
            <div className="empty-transactions">
              
              <h3>No transactions yet</h3>
              <p>Add your first transaction to get started.</p>
              
            </div>
          )}

          {!loading && transactions.length > 0 && (
            <TransactionTable
              transactions={transactions}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}

          {showForm && (
            <TransactionModal
              editingTransaction={editingTransaction}
              formData={formData}
              formError={formError}
              formLoading={formLoading}
              accounts={accounts}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClose={handleCloseForm}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default Transactions