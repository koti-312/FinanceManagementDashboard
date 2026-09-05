import { CountryCode, Products } from "plaid"
import { plaidClient } from "../config/plaid.js"
import User from "../models/User.js"
import Account from "../models/Account.js"
import Transaction from "../models/Transaction.js"

export const createLinkToken = async (req, res) => {

    try {
        const userId = req.user.id
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: userId.toString(),
            },
            client_name: "Personal Finance Management Dashboard",
            products: [Products.Transactions, Products.Investments],
            country_codes: [CountryCode.Us],
            language: "en",
        })
        res.status(200).json({
            success: true,
            link_token: response.data.link_token,
        })
    }
    catch (error) {
        console.error("Plaid Link Token Error:", error.response?.data || error)
        res.status(500).json({
            success: false,
            message: "Failed to create Plaid link token",
        })
    }
}


export const exchangePublictoken = async (req, res) => {
    const { public_token } = req.body

    if (!public_token) {
        return res.status(400).json({
            success: false,
            message: "Public token is required",
        })
    }

    try {
        const userId = req.user.id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token,
        })

        const accessToken = exchangeResponse.data.access_token
        const itemId = exchangeResponse.data.item_id

        user.plaidAccessToken = accessToken
        user.plaidItemId = itemId
        await user.save()

        const startDate = "2025-01-01"
        const endDate = new Date().toISOString().split("T")[0]

        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        })

        const plaidAccounts = accountsResponse.data.accounts
        const savedAccounts = []

        for (const plaidAccount of plaidAccounts) {

            let accountType = "bank"

            if (plaidAccount.type === "credit") {
                accountType = "credit_card"
            } else if (plaidAccount.type === "investment") {
                accountType = "investment"
            }

            let account = await Account.findOne({
                user: userId,
                plaidAccountId: plaidAccount.account_id,
            })

            if (!account) {
                account = await Account.create({
                    user: userId,
                    accountName: plaidAccount.name || plaidAccount.official_name || "Unknown Account",
                    accountType,
                    bankName: plaidAccount.institution_name || "Plaid Bank",
                    balance: plaidAccount.balances?.current || 0,
                    plaidAccountId: plaidAccount.account_id,
                })
            }
            else {
                account.accountName = plaidAccount.name || plaidAccount.official_name || account.accountName
                account.balance = plaidAccount.balances?.current || 0
                await account.save()
            }
            savedAccounts.push(account)
        }

        const transactionsResponse = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: startDate,
            end_date: endDate,
        })

        const plaidTransactions = transactionsResponse.data.transactions
        const savedTransactions = []

        for (const plaidTransaction of plaidTransactions) {
            const account = savedAccounts.find(
                (acc) => acc.plaidAccountId === plaidTransaction.account_id
            )

            if (!account) {
                continue
            }

            const existingTransaction = await Transaction.findOne({
                user: userId,
                plaidTransactionId: plaidTransaction.transaction_id,
            })

            if (existingTransaction) {
                continue
            }

            let transactionType = "expense"
            if (plaidTransaction.amount < 0) {
                transactionType = "income"
            }

            const transaction = await Transaction.create({
                user: userId,
                account: account._id,
                amount: Math.abs(plaidTransaction.amount),
                type: transactionType,
                category: plaidTransaction.personal_finance_category?.primary ||
                    plaidTransaction.category?.[0] || "OTHER",
                merchantName: plaidTransaction.merchant_name || plaidTransaction.name ||
                    "Unknown Merchant",
                description: plaidTransaction.name || "",
                date: new Date(plaidTransaction.date),
                plaidTransactionId:
                    plaidTransaction.transaction_id,
            })
            savedTransactions.push(transaction)
        }

        const investmentAccounts = savedAccounts.filter((account) =>
            account.accountType === "investment")
        
        const savedInvestmentTransactions = []

        if (investmentAccounts.length > 0) {
            const investmentResponse = await plaidClient.investmentsTransactionsGet({
                access_token: accessToken,
                start_date: startDate,
                end_date: endDate,
            })

            const investmentTransactions = investmentResponse.data.investment_transactions || []
            for (const investmentTransaction of investmentTransactions) {

                const account = investmentAccounts.find((acc) =>
                    acc.plaidAccountId === investmentTransaction.account_id
                )
                if (!account) {
                    continue
                }
                const existingTransaction = await Transaction.findOne({
                    user: userId,
                    plaidTransactionId: investmentTransaction.investment_transaction_id,
                })
                if (existingTransaction) {
                    continue
                }

                const transaction = await Transaction.create({
                    user: userId,
                    account: account._id,
                    amount: Math.abs(investmentTransaction.amount || 0),
                    type: "investment",
                    category: "INVESTMENT",
                    merchantName: investmentTransaction.name || investmentTransaction
                        .security_name || "Investment",
                    description: investmentTransaction.subtype || investmentTransaction.type || "",
                    date: new Date(investmentTransaction.date),
                    plaidTransactionId: investmentTransaction.investment_transaction_id,
                })
                savedInvestmentTransactions.push(transaction)
            }
        }
        res.status(200).json({
            success: true,
            message: "Plaid account connected successfully",
            data: {
                itemId,
                accountsCount: savedAccounts.length,
                transactionsCount: savedTransactions.length,
                investmentTransactionsCount: savedInvestmentTransactions.length
            },
        })

    }
    catch (error) {
        console.error("Plaid Token Exchange Error:", error.response?.data || error)
        res.status(500).json({
            success: false,
            message: "Failed to exchange public token",
        })
    }
}