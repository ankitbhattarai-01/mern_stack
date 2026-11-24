import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { formatToday } from '../utils/product.js'

const getPageTitle = (pathname) => {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/about') return 'About'
  if (pathname === '/products/new') return 'Add Product'
  if (pathname.endsWith('/edit')) return 'Edit Product'
  if (pathname === '/products') return 'Products'
  if (pathname.startsWith('/products/')) return 'Product Details'
  return 'Page Not Found'
}

const Navbar = ({ onMenuClick }) => {
  const { pathname } = useLocation()

  return (
    <header className="navbar">
      <button
        type="button"
        className="icon-button navbar-menu"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <h1 className="navbar-title">{getPageTitle(pathname)}</h1>
      <p className="navbar-date">{formatToday()}</p>
    </header>
  )
}

export default Navbar
