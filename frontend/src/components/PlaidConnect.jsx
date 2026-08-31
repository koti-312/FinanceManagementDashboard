import { useEffect, useState } from "react"
import { usePlaidLink } from "react-plaid-link"
import { createPlaidLinkToken, exchangePlaidPublicToken } from "../services/api"
import "./PlaidConnect.css"

const PlaidConnect = () => {

    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const getLinkToken = async () => {

            try {
                setLoading(true);
                const data = await createPlaidLinkToken()
                if (data.success) {
                    setLinkToken(data.link_token)
                }
            }
            catch (error) {
                console.error("Create Link Token Error:", error)
                setMessage("Failed to create Plaid Link")
            }
            finally {
                setLoading(false)
            }
        }
        getLinkToken()

    }, [])

    const onSuccess = async (public_token, metadata) => {

        console.log("Plaid Success:", public_token)
        console.log("Plaid Metadata:", metadata)

        try {
            setLoading(true)
            setMessage("Connecting your bank...")

            const data = await exchangePlaidPublicToken(public_token)
            console.log("Exchange Response:", data)
            if (data.success) {
                setMessage(`Bank connected successfully! ${data.data.accountsCount} accounts and ${data.data.transactionsCount} transactions synced.`)
            }
        }
        catch (error) {
            console.error("Exchange Token Error:", error)
            setMessage("Failed to connect bank")
        }
        finally {
            setLoading(false)
        }
    }

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess,
    })

    return (
        <div className="bank-connect">
            <button onClick={() => open()} disabled={!ready || loading} className="connect-btn">

                {loading ? "Connecting..." : "Connect Bank"}
            </button>

            {message && (
                <p>{message}</p>
            )}

        </div>
    )
}

export default PlaidConnect