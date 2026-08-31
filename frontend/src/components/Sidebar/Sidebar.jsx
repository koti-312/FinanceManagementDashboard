import { NavLink, useNavigate } from "react-router-dom"
import "./Sidebar.css"

const Sidebar = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>PFM</h2>
                <p>Finance Manager</p>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Dashboard
                </NavLink>

                <NavLink to="/accounts" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Accounts
                </NavLink>

                <NavLink to="/transactions" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Transactions
                </NavLink>

                <NavLink to="/income" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Income
                </NavLink>

                <NavLink to="/expenses" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Expenses
                </NavLink>

                <NavLink to="/budgets" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}> Budget</NavLink>
            </nav>

            <div className="sidebar-bottom">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </aside>
    )
}

export default Sidebar