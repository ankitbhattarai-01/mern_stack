import { Boxes, Clock, Plus, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage, Loading } from '../components/Feedback.jsx'
import ProductSection from '../components/ProductSection.jsx'
import StatCard from '../components/StatCard.jsx'
import {
  getDashboardStats,
  getErrorMessage,
  getExpiredProducts,
  getExpiringProducts,
  getRecentProducts,
} from '../services/api.js'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // If the user leaves the page first, ignore the late response.
    let ignore = false

    const loadDashboard = async () => {
      try {
        const [stats, expiring, expired, recent] = await Promise.all([
          getDashboardStats(),
          getExpiringProducts(),
          getExpiredProducts(),
          getRecentProducts(),
        ])
        if (!ignore) {
          setData({ stats, expiring, expired, recent })
          setError('')
        }
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err))
      }
    }

    loadDashboard()
    return () => {
      ignore = true
    }
  }, [reloadKey])

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey(reloadKey + 1)}
      />
    )
  }
  if (!data) return <Loading text="Loading dashboard..." />

  const { stats, expiring, expired, recent } = data

  return (
    <>
      <div className="page-header">
        <p className="page-intro">An overview of everything you are tracking.</p>
        <Link to="/products/new" className="button button-primary">
          <Plus size={18} /> Quick Add Product
        </Link>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Total Products"
          value={stats.total}
          icon={Boxes}
          tone="total"
          to="/products"
        />
        <StatCard
          label="Expired"
          value={stats.expired}
          icon={TriangleAlert}
          tone="expired"
          to="/products?status=Expired"
        />
        <StatCard
          label="Expiring Soon"
          value={stats.expiringSoon}
          icon={Clock}
          tone="soon"
          to="/products?status=Expiring+Soon"
        />
        <StatCard
          label="Safe"
          value={stats.safe}
          icon={ShieldCheck}
          tone="safe"
          to="/products?status=Safe"
        />
      </div>

      <div className="section-grid">
        <ProductSection
          title="Products Expiring Soon"
          products={expiring}
          emptyText="Nothing expires in the next 7 days."
          viewAllTo="/products?status=Expiring+Soon"
        />
        <ProductSection
          title="Recently Expired Products"
          products={expired}
          emptyText="No products have expired."
          viewAllTo="/products?status=Expired&sort=desc"
        />
        <ProductSection
          title="Recently Added Products"
          products={recent}
          emptyText="Products you add will appear here."
          viewAllTo="/products"
        />
      </div>
    </>
  )
}

export default Dashboard
