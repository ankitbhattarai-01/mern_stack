import { useEffect, useRef, useState } from 'react'
import { SHELF_ITEMS, STINK_LINES } from '../utils/shelfItems.js'

const MAX_DAYS = 40
const TICK_MS = 700
const SOON_DAYS = 7

const COLUMN_X = [95, 245, 395, 545]
const SHELF_Y = [226, 476]

// The same rule as backend/utils/expiry.js.
const getStatus = (daysLeft) => {
  if (daysLeft < 0) return 'Expired'
  if (daysLeft <= SOON_DAYS) return 'Expiring Soon'
  return 'Safe'
}

const STATUS_CLASS = {
  Expired: 'expired',
  'Expiring Soon': 'soon',
  Safe: 'safe',
}

const addDays = (date, days) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

const format = (date, options) => date.toLocaleDateString('en-GB', options)

const ShelfItem = ({ item, today, dayOffset, x, y }) => {
  const daysLeft = item.daysLeft - dayOffset
  const status = getStatus(daysLeft)
  const expiry = addDays(today, item.daysLeft)
  const statusClass = STATUS_CLASS[status]
  const { shapes, lines, spoil, stink, text } = item

  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`shelf-item shelf-item-${statusClass}`}>
        {/* The colour sits slightly off the outline, like cheap print. */}
        <g transform="translate(4 3)">
          {shapes.map(({ d, fill }) => (
            <path key={d} d={d} fill={fill} />
          ))}
        </g>
        <g className="shelf-ink">
          {shapes.map(({ d }) => (
            <path key={d} d={d} />
          ))}
          {lines.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {text && (
          <text
            className="shelf-item-text"
            y={text.y}
            fontSize={text.size}
            fill={text.fill ?? '#17212e'}
          >
            {text.value}
          </text>
        )}
        {status === 'Expired' && (
          <g className="shelf-spoil">
            {spoil.map(({ d, fill }) => (
              <path key={d} d={d} fill={fill} />
            ))}
            {stink &&
              STINK_LINES.map((d) => (
                <path key={d} d={d} className="shelf-stink" />
              ))}
          </g>
        )}
      </g>

      {/* The key restarts the swing whenever the status changes. */}
      <g key={status} className="shelf-label">
        <rect
          x="-63"
          y="4"
          width="126"
          height="56"
          rx="3"
          className={`shelf-label-card shelf-label-${statusClass}`}
        />
        <text y="28" className="shelf-label-date">
          {format(expiry, { day: 'numeric', month: 'short' })}
        </text>
        <text y="49" className={`shelf-label-status shelf-text-${statusClass}`}>
          {status}
        </text>
      </g>
    </g>
  )
}

const PantryShelf = () => {
  const [today] = useState(() => new Date())
  const [dayOffset, setDayOffset] = useState(0)
  const timer = useRef(null)

  // The shelf ages by itself until the visitor takes over the slider.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timer.current = setInterval(() => {
      setDayOffset((day) => (day >= MAX_DAYS ? 0 : day + 1))
    }, TICK_MS)
    return () => clearInterval(timer.current)
  }, [])

  const stopAutoplay = () => clearInterval(timer.current)

  const counts = { Expired: 0, 'Expiring Soon': 0, Safe: 0 }
  SHELF_ITEMS.forEach((item) => {
    counts[getStatus(item.daysLeft - dayOffset)] += 1
  })

  const shownDate = addDays(today, dayOffset)
  const dayLabel = dayOffset === 0 ? 'Today' : `${dayOffset} days from now`

  return (
    <figure className="shelf">
      <svg
        className="shelf-scene"
        viewBox="0 -44 640 584"
        role="img"
        aria-label="A drawing of a pantry shelf holding eight products, each with a date label."
      >
        <defs>
          {/* Three slightly different wobbles, swapped in CSS to make the
              outlines shimmer like hand-drawn animation. */}
          {[3, 11, 27].map((seed, index) => (
            <filter key={seed} id={`rough-${index}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035"
                numOctaves="2"
                seed={seed}
              />
              <feDisplacementMap in="SourceGraphic" scale="3.5" />
            </filter>
          ))}
        </defs>

        <g className="shelf-rough">
          <rect className="shelf-back" x="14" y="4" width="612" height="530" />
          <path className="shelf-back-boards" d="M165 4 V534 M320 4 V534 M475 4 V534" />
          <rect className="shelf-wood" x="4" y="-8" width="632" height="18" />
          <rect className="shelf-wood" x="4" y="0" width="16" height="540" />
          <rect className="shelf-wood" x="620" y="0" width="16" height="540" />
          <rect className="shelf-wood" x="4" y="226" width="632" height="42" />
          <rect className="shelf-wood" x="4" y="476" width="632" height="62" />

          {SHELF_ITEMS.map((item, index) => (
            <ShelfItem
              key={item.id}
              item={item}
              today={today}
              dayOffset={dayOffset}
              x={COLUMN_X[index % 4]}
              y={SHELF_Y[index < 4 ? 0 : 1]}
            />
          ))}

          {/* A little desk bell on top of the shelf. The key rings it
              whenever a product changes status. */}
          <g transform="translate(560 -8)">
            <g
              key={`${counts.Expired}-${counts.Safe}`}
              className="shelf-bell"
            >
              <path
                className="shelf-bell-body"
                d="M-24 0 Q-22 -32 0 -32 Q22 -32 24 0 Z"
              />
              <path className="shelf-bell-body" d="M-4 -32 V-36 H4 V-32 Z" />
            </g>
          </g>
        </g>

        {counts.Expired > 0 && (
          <g className="shelf-fly">
            <ellipse className="shelf-fly-wing" cx="-3" cy="-4" rx="5" ry="3" />
            <ellipse className="shelf-fly-wing" cx="3" cy="-4" rx="5" ry="3" />
            <ellipse cx="0" cy="0" rx="4" ry="3" fill="#17212e" />
          </g>
        )}
      </svg>

      <figcaption className="shelf-controls">
        <div key={dayOffset} className="tear-off" aria-hidden="true">
          <span className="tear-off-month">
            {format(shownDate, { month: 'short' })}
          </span>
          <span className="tear-off-day">{shownDate.getDate()}</span>
          <span className="tear-off-weekday">
            {format(shownDate, { weekday: 'short' })}
          </span>
        </div>

        <div className="shelf-slider">
          <label htmlFor="shelf-days">
            Drag to skip ahead: <strong>{dayLabel}</strong>
          </label>
          <input
            id="shelf-days"
            type="range"
            min="0"
            max={MAX_DAYS}
            value={dayOffset}
            aria-valuetext={dayLabel}
            onPointerDown={stopAutoplay}
            onKeyDown={stopAutoplay}
            onChange={(event) => setDayOffset(Number(event.target.value))}
          />
          <div className="shelf-counts">
            <span className="badge badge-safe">{counts.Safe} safe</span>
            <span className="badge badge-soon">
              {counts['Expiring Soon']} soon
            </span>
            <span className="badge badge-expired">
              {counts.Expired} expired
            </span>
          </div>
        </div>
      </figcaption>
    </figure>
  )
}

export default PantryShelf
