import Account from "../models/Account.js"

export const getAccounts = async (req, res) => {
    try {
        const userId = req.user.id

        const accounts = await Account.find({
            user: userId
        }).sort({
            createdAt: -1
        })

        return res.status(200).json({
            success: true,
            message: "Accounts fetched successfully",
            accounts
        })
    } 
    catch (error) {
        console.error("Get Accounts Error:",error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch accounts"
        })
    }
}