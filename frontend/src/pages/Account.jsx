import { useEffect, useState } from "react"
import { getAccounts } from "../services/api"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"
import "./Account.css"

const Accounts = () => {

  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {

    const fetchAccounts = async () => {

      try {
        setLoading(true)
        setError("")

        const data = await getAccounts()
        console.log("Accounts:", data)
        setAccounts(data.accounts || [])
      } 
      catch (error) {
        console.error("Accounts Error:", error)
        setError(error.message)
      } 
      finally {
        setLoading(false)
      }
    }
    fetchAccounts()
  }, [])

  return (

    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <main className="dashboard-content">
          <div className="dashboard-header">
            <h2>Accounts</h2>
            <p>
              View all your connected financial accounts.
            </p>
          </div>

          {loading && (
            <p className="dashboard-message">
              Loading accounts...
            </p>
          )}

          {error && (
            <p className="dashboard-error">
              {error}
            </p>
          )}

          {!loading && !error && accounts.length === 0 && (

            <p className="dashboard-message">
              No accounts found. Connect a bank account first.
            </p>
          )}

          {!loading && !error && accounts.length > 0 && (
            <div className="accounts-grid">
              {accounts.map((account) => (
                <div className="account-card" key={account._id}>
                  <div className="account-card-header">
                    <div>

                      <h3>
                        {account.accountName}
                      </h3>
                      <p>
                        {account.bankName}
                      </p>

                    </div>
                  </div>
                  <div className="account-card-body">
                    <p className="account-type">
                      {account.accountType.replace("_", " ").toUpperCase()}
                    </p>
                    <h2>
                      ₹{Number(account.balance || 0).toLocaleString("en-IN")}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>

  )
}

export default Accounts