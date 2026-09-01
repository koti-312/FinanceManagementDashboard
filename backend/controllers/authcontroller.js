import User from "../models/User.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })

// Register user

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    })
  }
  const normalEmail = email.trim().toLowerCase();


  if (!validator.isEmail(normalEmail)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    })
  }

  if (password.length < 12) {
    return res.status(400).json({
      success: false,
      message: "Password must start with an uppercase letter",
    })
  }

  if (!/^[A-Z]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must start with an uppercase letter",
    });
  }

  if (!/\d/.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least one number",
    });
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least one special character",
    });
  }

  try {
    if (await User.findOne({ email: normalEmail })) {
      return res.status(409).json({
        success: false,
        message: "User already registered this emailID",
      })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalEmail,
      password: hashPassword
    })

    const token = createToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    })
  }
}

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Both fields are required",
    })
  }
  const normalEmail = email.trim().toLowerCase();


  if (!validator.isEmail(normalEmail)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    })
  }

  try {
    const user = await User.findOne({ email: normalEmail })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server",
    })
  }
}