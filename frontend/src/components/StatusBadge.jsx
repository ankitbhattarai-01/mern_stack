const STATUS_CLASSES = {
  Expired: 'badge-expired',
  'Expiring Soon': 'badge-soon',
  Safe: 'badge-safe',
}

const StatusBadge = ({ status }) => {
  return <span className={`badge ${STATUS_CLASSES[status]}`}>{status}</span>
}

export default StatusBadge
