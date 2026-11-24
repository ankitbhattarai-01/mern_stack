export const CATEGORIES = [
  'Food',
  'Dairy',
  'Beverages',
  'Medicine',
  'Cosmetics',
  'Household',
  'Other',
]

export const STATUSES = ['Expired', 'Expiring Soon', 'Safe']

// Expiry dates are stored as midnight UTC, so they must be displayed in UTC
// too. Otherwise a browser in another timezone could show the wrong day.
const expiryFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const timestampFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Asia/Kathmandu',
})

const todayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kathmandu',
})

export const formatExpiryDate = (date) => expiryFormat.format(new Date(date))

export const formatTimestamp = (date) => timestampFormat.format(new Date(date))

export const formatToday = () => todayFormat.format(new Date())

// An <input type="date"> needs YYYY-MM-DD, the first 10 characters of the ISO date.
export const toInputDate = (date) => date.slice(0, 10)

export const formatDaysLeft = (daysLeft) => {
  if (daysLeft === 0) return 'Expires today'
  if (daysLeft === 1) return 'Expires tomorrow'
  if (daysLeft === -1) return 'Expired yesterday'
  if (daysLeft > 0) return `${daysLeft} days left`
  return `Expired ${Math.abs(daysLeft)} days ago`
}
