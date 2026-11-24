import { useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../services/api.js'

// Uses the browser's <dialog> element, which keeps keyboard focus inside the
// popup and closes on Escape. The parent renders this only while it is needed.
const ConfirmDialog = ({ title, message, onCancel, onConfirm }) => {
  const dialogRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  const handleConfirm = async () => {
    setBusy(true)
    setError('')
    try {
      await onConfirm()
    } catch (err) {
      setError(getErrorMessage(err))
      setBusy(false)
    }
  }

  const handleEscape = (e) => {
    e.preventDefault()
    if (!busy) onCancel()
  }

  return (
    <dialog ref={dialogRef} className="dialog" onCancel={handleEscape}>
      <h2>{title}</h2>
      <p>{message}</p>
      {error && <p className="form-error">{error}</p>}
      <div className="dialog-actions">
        <button
          type="button"
          className="button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          type="button"
          className="button button-danger"
          onClick={handleConfirm}
          disabled={busy}
        >
          {busy ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
