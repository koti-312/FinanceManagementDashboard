import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import "./SummaryCard.css"

const iconMap = {
  "Total Balance": { icon: Wallet, color: "#2563eb", bg: "#dbeafe" },
  "Total Income": { icon: TrendingUp, color: "#16a34a", bg: "#dcfce7" },
  "Total Expenses": { icon: TrendingDown, color: "#dc2626", bg: "#fee2e2" },
  "Total Investments": { icon: PiggyBank, color: "#9333ea", bg: "#f3e8ff" },
}

const SummaryCard = ({ title, amount }) => {
  const config = iconMap[title] || iconMap["Total Balance"]
  const Icon = config.icon

  return (
    <div className="summary-card">

      <div className="summary-card-top">
        <p className="summary-card-title">{title}</p>
        <div className="summary-card-icon" style={{ background: config.bg }}>
          <Icon size={18} color={config.color} />
        </div>
      </div>
      
      <h3 className="summary-card-amount">
        ₹{Number(amount || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </h3>

    </div>
  )
}

export default SummaryCard