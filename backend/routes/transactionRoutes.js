import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { addTransaction, deleteTransaction, getTransactions, updateTransaction } from "../controllers/transactionController.js"

const router=express.Router()

router.get("/",authMiddleware,getTransactions)
router.post("/",authMiddleware,addTransaction)
router.put("/:id",authMiddleware,updateTransaction)
router.delete("/:id",authMiddleware,deleteTransaction)

export default router