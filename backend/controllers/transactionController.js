import { plaidClient } from "../config/plaid.js"
import User from "../models/user.js"
import Account from "../models/Account.js"
import Transaction from "../models/Transaction.js"

export const getTransactions = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        if (!user.plaidAccessToken) {
            return res.status(400).json({
                success: false,
                message: "No Plaid account connected"
            })
        }

        const response = await plaidClient.transactionsSync({
            access_token: user.plaidAccessToken
        })
    
        const plaidTransactions = response.data.added
        const savedTransactions = []

        for (const plaidTransaction of plaidTransactions) {

            const account = await Account.findOne({
                user: user._id,
                plaidAccountId: plaidTransaction.account_id
            })

            if (!account) {
                console.log(`Account not found for Plaid account ID: ${plaidTransaction.account_id}`)
                continue
            }

            let transactionType = "expense"
            if (plaidTransaction.amount < 0) {
                transactionType = "income"
            }

            if (account.accountType === "investment") {
                transactionType = "investment"
            }

            const amount = Math.abs(plaidTransaction.amount)
            const category =plaidTransaction.personal_finance_category?.primary ||
                plaidTransaction.category?.[0] || "Other"

            const existingTransaction = await Transaction.findOne({
                user: user._id,
                plaidTransactionId: plaidTransaction.transaction_id
            })

            if (existingTransaction) {
                savedTransactions.push(existingTransaction);
                continue
            }

            const transaction = await Transaction.create({
                user: user._id,
                account: account._id,
                amount: amount,
                type: transactionType,
                category: category,
                merchantName: plaidTransaction.merchant_name || "",
                description: plaidTransaction.name || "",
                date: new Date(plaidTransaction.date),
                plaidTransactionId: plaidTransaction.transaction_id
            })

            savedTransactions.push(transaction)
        }
        return res.status(200).json({
            success: true,
            message: "Transactions fetched successfully",
            transactions: savedTransactions
        })
    } 
    catch (error) {

        console.error("Get Transactions Error:", error.response?.data || error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions"
        })
    }
}