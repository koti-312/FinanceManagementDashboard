import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { getAccounts } from "../controllers/accountController.js"

const router=express.Router()

router.get("/",authMiddleware,getAccounts)

export default router