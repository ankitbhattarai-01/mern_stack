import { CircleAlert, LoaderCircle } from 'lucide-react'

// Small shared components for the loading, error and empty states of a page.

export const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="state" role="status">
      <LoaderCircle size={28} className="spinner" />
      <p>{text}</p>
    </div>
  )
}

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="state state-error" role="alert">
      <CircleAlert size={28} />
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export const EmptyState = ({ icon: Icon, title, text, children }) => {
  return (
    <div className="state">
      <Icon size={32} />
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </div>
  )
}
