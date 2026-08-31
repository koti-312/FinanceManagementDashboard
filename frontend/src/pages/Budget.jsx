import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"
import { getBudget, saveBudget, deleteBudget } from "../services/api"
import "./Budget.css"

const Budget = () => {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
    const [budget, setBudget] = useState(null)
    const [summary, setSummary] = useState({
        limit: 0,
        spent: 0,
        remaining: 0,
        percentage: 0
    })
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const fetchBudget = async () => {
        try {
            setLoading(true)
            setError("")

            const data = await getBudget(month)
            setBudget(data.budget)
            setSummary(data.summary)
            setAmount(data.summary.limit || "")
        } 
        catch (error) {
            console.error("Budget Error:", error)
            setError(error.message)
        } 
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBudget()
    }, [month])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid budget amount")
            return
        }
        try {
            setSaving(true)
            setError("")
            setSuccess("")
            await saveBudget(month, Number(amount))
            setSuccess("Budget saved successfully")
            await fetchBudget()
        } 
        catch (error) {
            console.error("Save Budget Error:", error)
            setError(error.message)
        } 
        finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!budget?._id) {
            return
        }
        try {
            setError("")
            setSuccess("")
            await deleteBudget(budget._id)
            setBudget(null)
            setAmount("")
            setSummary({
                limit: 0,
                spent: summary.spent,
                remaining: -summary.spent,
                percentage: 0
            })

            setSuccess("Budget deleted successfully")
        } 
        catch (error) {
            console.error("Delete Budget Error:", error)
            setError(error.message)
        }
    }

    const formatAmount = (value) => {
        return `₹${Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`
    }

    const progress = Math.min(summary.percentage, 100)
    const isOverBudget = summary.limit > 0 && summary.spent > summary.limit

    return (
        
        <div className="budget-page">
            <Sidebar />
            <div className="budget-main">
                <Navbar />
                <main className="budget-content">
                    <div className="budget-header">
                        <div>
                            <h2>Budget</h2>
                            <p>Set and manage your monthly spending limit.</p>
                        </div>
                        <div className="budget-month">
                            <label>Month</label>
                            <input
                                type="month"
                                value={month}
                                onChange={(event) => setMonth(event.target.value)}/>
                        </div>
                    </div>

                    {error && (
                        <div className="budget-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="budget-success">
                            {success}
                        </div>
                    )}

                    {loading ? (
                        <div className="budget-message">
                            Loading budget...
                        </div>
                    ) : (
                        <>
                            <div className="budget-grid">
                                <div className="budget-card">
                                    <span>Monthly Budget</span>
                                    <strong>{formatAmount(summary.limit)}</strong>
                                </div>

                                <div className="budget-card">
                                    <span>Spent</span>
                                    <strong className="spent">
                                        {formatAmount(summary.spent)}
                                    </strong>
                                </div>

                                <div className="budget-card">
                                    <span>Remaining</span>
                                    <strong className={isOverBudget ? "over-budget" : "remaining"}>
                                        {formatAmount(Math.abs(summary.remaining))}
                                    </strong>
                                </div>
                            </div>

                            <div className="budget-layout">
                                <div className="budget-panel">
                                    <div className="budget-panel-header">
                                        <div>
                                            <h3>
                                                {budget ? "Update Monthly Budget" : "Set Monthly Budget"}
                                            </h3>
                                            <p>
                                                Choose how much you want to spend this month.
                                            </p>
                                        </div>
                                    </div>

                                    <form className="budget-form" onSubmit={handleSubmit}>
                                        <div className="budget-form-group">
                                            <label>Monthly Limit</label>
                                            <div className="budget-input-wrapper">
                                                <span>₹</span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(event) => setAmount(event.target.value)}
                                                    placeholder="Enter budget amount"
                                                    min="1"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="budget-save-btn"
                                            disabled={saving}>

                                            {saving ? "Saving..." : budget ? "Update Budget" : "Set Budget"}
                                        </button>

                                        {budget && (
                                            <button type="button" className="budget-delete-btn" onClick={handleDelete}>
                                                Delete Budget
                                            </button>
                                        )}
                                    </form>
                                </div>

                                <div className="budget-panel">
                                    <div className="budget-panel-header">
                                        <div>
                                            <h3>Spending Progress</h3>
                                            <p>
                                                {isOverBudget ? "You have exceeded your monthly budget."
                                                    : "Track your spending against your limit."}
                                            </p>
                                        </div>
                                        <strong className={isOverBudget ? "over-budget" : ""}>
                                            {summary.percentage}%
                                        </strong>
                                    </div>

                                    <div className="budget-progress">
                                        <div className={`budget-progress-bar ${isOverBudget ? "danger" : ""}`}
                                            style={{ width: `${progress}%` }} />
                                    </div>

                                    <div className="budget-progress-details">
                                        <span>
                                            Spent: <strong>{formatAmount(summary.spent)}</strong>
                                        </span>
                                        <span>
                                            Limit: <strong>{formatAmount(summary.limit)}</strong>
                                        </span>
                                    </div>

                                    {summary.limit > 0 && (
                                        <div className={`budget-status ${isOverBudget ? "danger" : "safe"}`}>
                                            {isOverBudget
                                                ? `Over budget by ${formatAmount(summary.spent - summary.limit)}`
                                                : `${formatAmount(summary.remaining)} remaining`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Budget