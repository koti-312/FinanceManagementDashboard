import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../services/api"
import "./Login.css"

const LoginPage = () => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
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
            const data = await loginUser(
                formData.email,
                formData.password
            )
            console.log("Login response:", data)
            const token = data.token || data.accessToken

            if (token) {
                localStorage.setItem("token", token)
            }
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user))
            }
            navigate("/dashboard")
        }
        catch (error) {
            setError(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Login to your Personal Finance Dashboard</p>
                </div>

                <div className="login-body">
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>

                            <input id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>

                            <input id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required />
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="login-footer">
                        Don't have an account?{" "}
                        <Link to="/register">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage