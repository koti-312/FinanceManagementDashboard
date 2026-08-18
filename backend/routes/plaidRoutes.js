import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { createLinkToken } from "../controllers/plaidController.js"

const router=express.Router()

router.post("/create-link-token",authMiddleware,createLinkToken)

export default router