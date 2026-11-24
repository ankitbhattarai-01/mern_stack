import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

const AppLayout = () => {
  // Controls the slide-in sidebar on small screens.
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="layout-main">
        <Navbar onMenuClick={() => setMenuOpen(true)} />

        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
