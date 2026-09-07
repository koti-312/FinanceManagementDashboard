import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/api"
import "./Register.css"

const RegisterPage = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const data = await registerUser(
                formData.name,
                formData.email,
                formData.password
            )

            console.log("Register response:", data)
            navigate("/login")
        }
        catch (error) {
            setError(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <h1>Create Account</h1>
                    <p>Start managing your personal finances</p>
                </div>

                <div className="register-body">
                    {error && <div className="register-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="register-form">

                            <label htmlFor="name">Name</label>
                            <input id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required />

                            <label htmlFor="email">Email</label>
                            <input id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required />

                            <label htmlFor="password">Password</label>
                            <input id="password"
                                name="password"
                                type="password"
                                placeholder="Create a password (min 12 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={12}
                                required />

                        <button type="submit" className="register-button" disabled={loading}>
                            {loading ? "Creating Account..." : "Register"}
                        </button>
                    </form>

                    <p className="register-footer">
                        Already have an account?{" "}
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage