import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/Feedback.jsx'

const NotFound = () => {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      text="The page you are looking for does not exist."
    >
      <Link to="/dashboard" className="button button-primary">
        Go to Dashboard
      </Link>
    </EmptyState>
  )
}

export default NotFound
