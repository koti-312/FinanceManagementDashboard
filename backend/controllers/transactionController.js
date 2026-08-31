import Transaction from "../models/Transaction.js"
import Account from "../models/Account.js"


export const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id
        const transactions = await Transaction.find({
            user: userId
        })
            .populate("account", "accountName accountType bankName")
            .sort({
                date: -1
            })

        return res.status(200).json({
            success: true,
            message: "Transactions fetched successfully",
            transactions
        })
    }
    catch (error) {
        console.error("Get Transactions Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions"
        })
    }
}

export const addTransaction = async (req, res) => {

    try {
        const userId = req.user.id
        const {
            account,
            amount,
            type,
            category,
            merchantName,
            description,
            date
        } = req.body

        if (
            !account ||
            amount === undefined ||
            !type ||
            !category ||
            !date
        ) {
            return res.status(400).json({
                success: false,
                message: "Account, amount, type, category and date are required"
            })
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            })
        }

        const validTypes = [
            "income",
            "expense",
            "investment"
        ]
        if (!validTypes.includes(type)) {

            return res.status(400).json({
                success: false,
                message: "Invalid transaction type"
            })
        }
        const userAccount = await Account.findOne({
            _id: account,
            user: userId
        })

        if (!userAccount) {

            return res.status(404).json({
                success: false,
                message: "Account not found or does not belong to you"
            })
        }

        const transaction = await Transaction.create({

            user: userId,
            account: userAccount._id,
            amount: Number(amount),
            type,
            category,
            merchantName: merchantName?.trim() || "",
            description: description?.trim() || "",
            date: new Date(date),

            plaidTransactionId: null
        })

        const populatedTransaction = await Transaction.findById(
            transaction._id).populate(
                "account",
                "accountName accountType bankName"
            )

        return res.status(201).json({

            success: true,
            message: "Transaction added successfully",
            transaction: populatedTransaction
        })
    }
    catch (error) {
        console.error("Add Transaction Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to add transaction"
        })
    }
}

export const updateTransaction = async (req, res) => {

    try {
        const userId = req.user.id
        const { id } = req.params
        const {
            account,
            amount,
            type,
            category,
            merchantName,
            description,
            date
        } = req.body

        const transaction = await Transaction.findOne({
            _id: id,
            user: userId
        })

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            })
        }

        if (account) {
            const userAccount =await Account.findOne({
                    _id: account,
                    user: userId
                })

            if (!userAccount) {
                return res.status(404).json({
                    success: false,
                    message: "Account not found or does not belong to you"
                })
            }
            transaction.account = userAccount._id
        }

        if (amount !== undefined) {
            if (Number(amount) <= 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Amount must be greater than 0"
                })
            }
            transaction.amount = Number(amount)
        }

        if (type !== undefined) {
            const validTypes = [
                "income",
                "expense",
                "investment"
            ]

            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid transaction type"
                })
            }
            transaction.type = type
        }

        if (category !== undefined) {
            transaction.category = category
        }

        if (merchantName !== undefined) {
            transaction.merchantName = merchantName.trim()
        }

        if (description !== undefined) {
            transaction.description = description.trim()
        }

        if (date !== undefined) {
            transaction.date = new Date(date)
        }

        await transaction.save()
        const updatedTransaction = await Transaction.findById(transaction._id).populate(
            "account",
            "accountName accountType bankName"
        )

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction: updatedTransaction
        })

    }
    catch (error) {
        console.error("Update Transaction Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to update transaction"
        })
    }
}

export const deleteTransaction = async (req, res) => {

    try {
        const userId = req.user.id
        const { id } = req.params

        const transaction = await Transaction.findOneAndDelete({
            _id: id,
            user: userId
        })

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        })
    }
    catch (error) {
        console.error("Delete Transaction Error:", error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to delete transaction"
        })
    }
}
