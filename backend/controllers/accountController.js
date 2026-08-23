import { plaidClient } from "../config/plaid.js"
import User from "../models/user.js"
import Account from "../models/Account.js"

export const getAccounts = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
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

        const response = await plaidClient.accountsGet({
            access_token: user.plaidAccessToken
        })

        const plaidAccounts = response.data.accounts

        const savedAccounts = []

        for (const plaidAccount of plaidAccounts) {

            let accountType = "bank"

            if (plaidAccount.type === "credit") {
                accountType = "credit_card"
            } else if (plaidAccount.type === "investment") {
                accountType = "investment"
            }

            const account = await Account.findOneAndUpdate(
                {
                    user: userId,
                    plaidAccountId: plaidAccount.account_id
                },
                {
                    user: userId,
                    accountName: plaidAccount.name,
                    accountType: accountType,
                    bankName: "Plaid Sandbox",
                    balance: plaidAccount.balances.current || 0,
                    plaidAccountId: plaidAccount.account_id
                },
                {
                    new: true,
                    upsert: true
                }
            )

            savedAccounts.push(account)
        }

        return res.status(200).json({
            success: true,
            message: "Accounts fetched successfully",
            accounts: savedAccounts
        })

    } catch (error) {

        console.error("Get Accounts Error:", error.response?.data || error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch accounts"
        })
    }
}