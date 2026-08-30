import Account from "../models/Account.js"
import Transaction from "../models/Transaction.js"

export const getDashboardSummary = async (req, res) => {
    try {
        
        const userId = req.user._id
        console.log("User ID:", userId)
        const accounts = await Account.find({
            user: userId
        })
        console.log("Accounts found:", accounts.length)
        
        const transactions = await Transaction.find({
            user: userId
        })
         console.log("Transactions found:", transactions.length) 

        const totalBalance = accounts.reduce((total, account) => total + account.balance, 0)

        const totalIncome = transactions.filter(transaction => transaction.type === "income")
            .reduce((total, transaction) => total + transaction.amount, 0)

        const totalExpenses = transactions.filter(transaction => transaction.type === "expense")
            .reduce((total, transaction) => total + transaction.amount, 0)

        const totalInvestments = transactions.filter(transaction => transaction.type === "investment")
            .reduce((total, transaction) => total + transaction.amount, 0)

        console.log("Dashboard Totals:", {
            totalBalance,
            totalIncome,
            totalExpenses,
            totalInvestments
        });

        return res.status(200).json({
            success: true,
            summary: {
                totalBalance,
                totalIncome,
                totalExpenses,
                totalInvestments
            }
        })
    }
    catch (error) {
        console.error("Dashboard Summary Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard summary"
        })
    }
}


export const getExpensesByCategory = async (req, res) => {
    try {
        const userId = req.user._id
        const expenses = await Transaction.find({
            user: userId,
            type: "expense"
        })

        const categoryTotals = {}
        expenses.forEach((transaction) => {
            const category = transaction.category || "Other"

            if (!categoryTotals[category]) {
                categoryTotals[category] = 0
            }

            categoryTotals[category] += transaction.amount
        })

        return res.status(200).json({
            success: true,
            expensesByCategory: categoryTotals
        })
    }
    catch (error) {
        console.error("Expenses By Category Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch expenses by category"
        })
    }
}

export const getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user._id

        const transactions = await Transaction.find({
            user: userId,
            type: {
                $in: ["income", "expense"]
            }
        }).sort({ date: 1 })

        const monthlyData = {}

        transactions.forEach((transaction) => {

            const date = new Date(transaction.date)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const monthKey = `${year}-${month}`

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthKey,
                    income: 0,
                    expenses: 0
                }
            }

            if (transaction.type === "income") {
                monthlyData[monthKey].income += transaction.amount
            }

            if (transaction.type === "expense") {
                monthlyData[monthKey].expenses += transaction.amount
            }
        })

        const monthlySummary = Object.values(monthlyData)
        return res.status(200).json({
            success: true,
            monthlySummary
        })
    }
    catch (error) {
        console.error("Monthly Summary Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch monthly summary"
        })
    }
}

export const getRecentTransactions = async (req, res) => {
    try {
        const userId = req.user._id
        const transactions = await Transaction.find({
            user: userId
        })
            .populate("account", "accountName")
            .sort({ date: -1 })
            .limit(10)

        return res.status(200).json({
            success: true,
            transactions
        })
    } 
    catch (error) {
        console.error("Recent Transactions Error:",error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent transactions"
        })
    }
}