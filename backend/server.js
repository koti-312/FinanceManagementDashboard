import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import { connectDB } from "./config/db.js"
import Account from "./models/Account.js"
import authRoutes from "./routes/authRoutes.js"
import plaidRoutes from "./routes/plaidRoutes.js"

const port = 4000
const app = express()

// MongoDB connection
connectDB()

app.use(express.json())
app.use(cors())

app.use("/api/auth",authRoutes)
app.use("/api/plaid",plaidRoutes)


app.get("/", (req, res) => {
    res.json("Express is running")
})





app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);

})
