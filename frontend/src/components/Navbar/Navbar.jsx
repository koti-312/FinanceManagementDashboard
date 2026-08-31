import { useEffect, useState } from "react"
import "./Navbar.css"

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const initials = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U"

  return (
    <header className="navbar">

      <div className="navbar-title">
        <h1>Finance Management Dashboard</h1>
      </div>

      <div className="navbar-user">

        <div className="navbar-avatar" onClick={() => setShowDropdown((prev) => !prev)}>
          {initials}
        </div>
        <span className="navbar-username">{user?.name || "User"}</span>

        {showDropdown && (
          <div className="navbar-dropdown">
            <p className="navbar-dropdown-name">{user?.name || "User"}</p>
            <p className="navbar-dropdown-email">{user?.email || "No email found"}</p>
          </div>
        )}
      </div>

    </header >
  )
}

export default Navbar