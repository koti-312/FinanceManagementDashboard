import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js"
import {getBudget,createOrUpdateBudget, deleteBudget} from "../controllers/budgetController.js"

const router = express.Router()

router.get("/", authMiddleware, getBudget)
router.post("/", authMiddleware, createOrUpdateBudget)
router.delete("/:id", authMiddleware, deleteBudget)

export default router