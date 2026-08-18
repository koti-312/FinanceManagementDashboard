import { CountryCode, Products } from "plaid"
import { plaidClient } from "../config/plaid.js"
import { CountryCodes } from "validator/lib/isISO31661Alpha2.js"



export const createLinkToken=async(req,res)=>{
    try{
        const userId=req.user.id
        const response=await plaidClient.linkTokenCreate({
            user:{
                client_user_id:userId.toString()
            },
            client_name:"Personal Finance Management Dashboard",
            products:[Products.Transactions],
            country_codes:[CountryCode.Us],
            language:"en",
        })
        res.status(200).json({
            success:true,
            link_token:response.data.link_token,
        })
    }
    catch(error){
        console.error("Plaid Link Token Error:",error.response?.data || error)

        res.status(500).json({
            success:false,
            message: "Failed to create Plaid link token",
        })

    }
}