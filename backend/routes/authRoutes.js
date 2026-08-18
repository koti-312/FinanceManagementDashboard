import express from "express"
import { loginUser, registerUser } from "../controllers/authcontroller.js"
import { authMiddleware } from "../middleware/authMiddleware.js"


const router=express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)

router.get("/me",authMiddleware,(req,res)=>{
    res.json({
        success:true,
        message: "User is authenticated",
        userId:req.user

    })
})
export default router