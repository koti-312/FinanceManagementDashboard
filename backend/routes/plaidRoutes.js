import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { createLinkToken, exchangePublictoken, sandboxCreatePublicToken } from "../controllers/plaidController.js"

const router=express.Router()

router.post("/create-link-token",authMiddleware,createLinkToken)
router.post("/exchange-token",authMiddleware,exchangePublictoken)
router.post("/sandbox-public-token", authMiddleware,sandboxCreatePublicToken) 


export default router