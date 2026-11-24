import {
  BellRing,
  CirclePlus,
  Info,
  LayoutDashboard,
  Package,
  X,
} from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const Sidebar = ({ open, onClose }) => {
  const { pathname } = useLocation()

  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link nav-link-active' : 'nav-link'

  // /products/new belongs to "Add Product", not to "Products".
  const productsLinkClass = ({ isActive }) =>
    linkClass({ isActive: isActive && pathname !== '/products/new' })

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={open ? 'sidebar sidebar-open' : 'sidebar'}>
        <div className="sidebar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">
              <BellRing size={18} />
            </span>
            <span className="brand-name">ExpiryAlert</span>
          </Link>
          <button
            type="button"
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" onClick={onClose}>
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/products" className={productsLinkClass}>
            <Package size={18} /> Products
          </NavLink>
          <NavLink to="/products/new" className={linkClass}>
            <CirclePlus size={18} /> Add Product
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            <Info size={18} /> About
          </NavLink>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
