import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDaysLeft, formatExpiryDate } from '../utils/product.js'
import StatusBadge from './StatusBadge.jsx'

// One titled list on the dashboard, such as "Expiring Soon".
const ProductSection = ({ title, products, emptyText, viewAllTo }) => {
  return (
    <section className="section-card">
      <div className="section-header">
        <h2>{title}</h2>
        <Link to={viewAllTo} className="section-link">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="section-empty">{emptyText}</p>
      ) : (
        <ul className="section-list">
          {products.map((product) => (
            <li key={product._id}>
              <Link to={`/products/${product._id}`} className="section-item">
                <span className="section-item-text">
                  <span className="section-item-name">{product.name}</span>
                  <span className="cell-note">
                    {formatExpiryDate(product.expiryDate)} ·{' '}
                    {formatDaysLeft(product.daysLeft)}
                  </span>
                </span>
                <StatusBadge status={product.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ProductSection
