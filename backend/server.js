import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import plaidRoutes from "./routes/plaidRoutes.js"
import accountRoutes from "./routes/accountRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import budgetRoutes from "./routes/budgetRoutes.js"


const port = process.env.PORT || 4000
const app = express()

// MongoDB connection
connectDB()

app.use(express.json())
app.use(cors())

app.use("/api/auth",authRoutes)
app.use("/api/plaid",plaidRoutes)
app.use("/api/accounts",accountRoutes)
app.use("/api/transactions",transactionRoutes)
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/budgets",budgetRoutes)


app.get("/", (req, res) => {
    res.json("Express is running")
})



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);

})
