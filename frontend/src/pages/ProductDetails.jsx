import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { ErrorMessage, Loading } from '../components/Feedback.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { deleteProduct, getErrorMessage, getProduct } from '../services/api.js'
import {
  formatDaysLeft,
  formatExpiryDate,
  formatTimestamp,
} from '../utils/product.js'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadProduct = async () => {
      try {
        const result = await getProduct(id)
        if (!ignore) setProduct(result)
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err))
      }
    }

    loadProduct()
    return () => {
      ignore = true
    }
  }, [id])

  const handleDelete = async () => {
    await deleteProduct(id)
    navigate('/products')
  }

  if (error) return <ErrorMessage message={error} />
  if (!product) return <Loading text="Loading product..." />

  return (
    <>
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} /> Back to products
      </Link>

      <article className="details-card">
        <div className="details-header">
          <div className="details-title">
            <h2>{product.name}</h2>
            <StatusBadge status={product.status} />
          </div>
          <div className="details-actions">
            <Link to={`/products/${id}/edit`} className="button">
              <Pencil size={16} /> Edit
            </Link>
            <button
              type="button"
              className="button button-danger-outline"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        <dl className="details-grid">
          <div>
            <dt>Category</dt>
            <dd>{product.category}</dd>
          </div>
          <div>
            <dt>Quantity</dt>
            <dd>{product.quantity}</dd>
          </div>
          <div>
            <dt>Expiry Date</dt>
            <dd>{formatExpiryDate(product.expiryDate)}</dd>
          </div>
          <div>
            <dt>Time Remaining</dt>
            <dd>{formatDaysLeft(product.daysLeft)}</dd>
          </div>
          <div className="details-wide">
            <dt>Description</dt>
            <dd>{product.description || 'No description added.'}</dd>
          </div>
          <div>
            <dt>Added</dt>
            <dd>{formatTimestamp(product.createdAt)}</dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>{formatTimestamp(product.updatedAt)}</dd>
          </div>
        </dl>
      </article>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this product?"
          message={`"${product.name}" will be permanently removed.`}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}

export default ProductDetails
