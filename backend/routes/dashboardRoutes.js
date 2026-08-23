import express from"express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { getDashboardSummary, getExpensesByCategory, getMonthlySummary, getRecentTransactions } from "../controllers/dashboardController.js"

const router=express.Router()

router.get("/summary",authMiddleware,getDashboardSummary)
router.get("/expense-by-category",authMiddleware,getExpensesByCategory)
router.get("/monthly-summary",authMiddleware,getMonthlySummary)
router.get("/recent-transactions",authMiddleware,getRecentTransactions)

export default router
