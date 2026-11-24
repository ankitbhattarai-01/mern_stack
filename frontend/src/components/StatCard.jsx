import { Link } from 'react-router-dom'

// Each card is a link, so clicking "Expired" opens the filtered product list.
const StatCard = ({ label, value, icon: Icon, tone, to }) => {
  return (
    <Link to={to} className="stat-card">
      <span className={`stat-icon stat-icon-${tone}`}>
        <Icon size={20} />
      </span>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </Link>
  )
}

export default StatCard
