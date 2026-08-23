import { CountryCode, Products } from "plaid"
import { plaidClient } from "../config/plaid.js"
import User from "../models/user.js"



export const createLinkToken = async (req, res) => {
    try {
        const userId = req.user.id
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: userId.toString()
            },
            client_name: "Personal Finance Management Dashboard",
            products: [Products.Transactions],
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
        });
    }

    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token,
        })

        const accessToken = response.data.access_token
        const itemId = response.data.item_id
        const userId = req.user.id
        const user = await User.findByIdAndUpdate(
            userId,
            {
                plaidAccessToken: accessToken,
                plaidItemId: itemId,
            },
            {
                new: true
            }
        )
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "Plaid account connected successfully",
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

export const sandboxCreatePublicToken = async (req, res) => {
  try {
    const response = await plaidClient.sandboxPublicTokenCreate({
      institution_id: "ins_109508", // Plaid's default sandbox test bank ("First Platypus Bank")
      initial_products: [Products.Transactions],
    });

    res.status(200).json({
      success: true,
      public_token: response.data.public_token,
    });
  } catch (error) {
    console.error("Sandbox Token Error:", error.response?.data || error);
    res.status(500).json({
      success: false,
      message: "Failed to create sandbox public token",
    });
  }
};