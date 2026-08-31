import Budget from "../models/Budget.js"
import Transaction from "../models/Transaction.js"

export const getBudget = async (req, res) => {
    try {
        const userId = req.user._id
        const month = req.query.month || new Date().toISOString().slice(0, 7)

        const budget = await Budget.findOne({
            user: userId,
            month
        })

        const startDate = new Date(`${month}-01T00:00:00.000Z`)
        const [year, monthNumber] = month.split("-")
        const endDate = new Date(Date.UTC(Number(year), Number(monthNumber), 1))

        const transactions = await Transaction.find({
            user: userId,
            type: "expense",
            date: {
                $gte: startDate,
                $lt: endDate
            }
        })

        const spent = transactions.reduce(
            (total, transaction) => total + transaction.amount,
            0
        )

        const limit = budget?.limit || 0
        const remaining = limit - spent
        const percentage = limit > 0 ? Math.round((spent / limit) * 100): 0
        return res.status(200).json({
            success: true,
            budget: budget || null,
            summary: {
                month,
                limit,
                spent,
                remaining,
                percentage
            }
        })
    } 
    catch (error) {
        console.error("Get Budget Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch budget"
        })
    }
}

export const createOrUpdateBudget = async (req, res) => {
    try {
        const userId = req.user._id
        const { month, limit } = req.body

        if (!month) {
            return res.status(400).json({
                success: false,
                message: "Month is required"
            })
        }

        if (limit === undefined || Number(limit) < 0) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid budget amount"
            })
        }

        const budget = await Budget.findOneAndUpdate(
            {
                user: userId,
                month
            },
            {
                user: userId,
                month,
                limit: Number(limit)
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        )

        return res.status(200).json({
            success: true,
            message: "Budget saved successfully",
            budget
        })
    } 
    catch (error) {
        console.error("Save Budget Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to save budget"
        })
    }
}

export const deleteBudget = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params

        const budget = await Budget.findOneAndDelete({
            _id: id,
            user: userId
        })

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Budget deleted successfully"
        })
    } 
    catch (error) {
        console.error("Delete Budget Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to delete budget"
        })
    }
}