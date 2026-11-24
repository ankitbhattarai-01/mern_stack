import '@fontsource/young-serif'
import '@fontsource-variable/doto'
import { ArrowRight, BellRing } from 'lucide-react'
import { Link } from 'react-router-dom'
import dashboardScreenshot from '../assets/dashboard-screenshot.png'
import PantryShelf from '../components/PantryShelf.jsx'
import { CATEGORIES, formatToday } from '../utils/product.js'
import './Landing.css'

const RECEIPT_EXTRAS = [
  ['Search by name', 'YES'],
  ['Filter by status', 'YES'],
  ['Sort by date', 'YES'],
  ['Sign-up needed', 'NO'],
]

const Landing = () => {
  return (
    <div className="landing">
      <section className="hero">
        <header className="hero-bar">
          <span className="hero-brand">
            <BellRing size={22} />
            ExpiryAlert
          </span>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Nobody reads the date until the milk smells.</h1>
            <p>
              ExpiryAlert keeps the dates on your food, medicine and cosmetics
              in one place, so you can see what needs using this week before
              it ends up in the bin.
            </p>
            <Link to="/dashboard" className="hero-button">
              Open the dashboard <ArrowRight size={20} />
            </Link>
          </div>

          <PantryShelf />
        </div>
      </section>

      <section className="rule">
        <h2>How a product gets its label</h2>
        <p className="rule-intro">
          You only enter the date printed on the pack. ExpiryAlert compares it
          with today, every time you look.
        </p>

        <div className="ruler">
          <div className="ruler-zone ruler-expired">
            <span>Expired</span>
          </div>
          <div className="ruler-zone ruler-soon">
            <span>Expiring Soon</span>
          </div>
          <div className="ruler-zone ruler-safe">
            <span>Safe</span>
          </div>
          <b className="ruler-mark ruler-mark-today">Today</b>
          <b className="ruler-mark ruler-mark-seven">+7 days</b>
        </div>

        <p className="rule-note">
          &ldquo;Today&rdquo; means today in Nepal, so labels change at midnight
          in Kathmandu.
        </p>
      </section>

      <section className="desk">
        <div className="desk-photo">
          <span className="desk-tape" />
          <img
            src={dashboardScreenshot}
            alt="The ExpiryAlert dashboard showing counts of total, expired, expiring soon and safe products, with lists of each."
            width="1280"
            height="965"
            loading="lazy"
          />
          <p>The real dashboard, with sample products.</p>
        </div>

        <div className="desk-side">
          <h2>Then it&rsquo;s all on one page</h2>
          <p>
            Four counts at the top, then what is about to go off, what already
            has, and what you added last. Click a count to open that list.
          </p>

          <div className="receipt">
            <h3>EXPIRYALERT</h3>
            <p>{formatToday()}</p>
            <hr />
            <ul>
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <span>{category}</span>
                  <span>TRACKED</span>
                </li>
              ))}
            </ul>
            <hr />
            <ul>
              {RECEIPT_EXTRAS.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
            <hr />
            <p>PLEASE USE BY DATE SHOWN</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        ExpiryAlert. Built with MongoDB, Express.js, React and Node.js.
      </footer>
    </div>
  )
}

export default Landing
