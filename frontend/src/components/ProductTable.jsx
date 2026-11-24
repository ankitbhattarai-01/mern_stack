import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDaysLeft, formatExpiryDate } from '../utils/product.js'
import StatusBadge from './StatusBadge.jsx'

// data-label supplies the column name when CSS turns rows into cards on phones.
const ProductTable = ({ products, onDelete }) => {
  const navigate = useNavigate()

  return (
    <div className="table-card">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Product Name</th>
            <th scope="col">Category</th>
            <th scope="col">Quantity</th>
            <th scope="col">Expiry Date</th>
            <th scope="col">Expiry Status</th>
            <th scope="col">
              <span className="actions-heading">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td data-label="Product" className="cell-name">
                <Link to={`/products/${product._id}`}>{product.name}</Link>
              </td>
              <td data-label="Category">{product.category}</td>
              <td data-label="Quantity">{product.quantity}</td>
              <td data-label="Expiry Date">
                <div>
                  <div>{formatExpiryDate(product.expiryDate)}</div>
                  <div className="cell-note">
                    {formatDaysLeft(product.daysLeft)}
                  </div>
                </div>
              </td>
              <td data-label="Status">
                <StatusBadge status={product.status} />
              </td>
              <td data-label="Actions">
                <div className="table-actions">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => navigate(`/products/${product._id}`)}
                    aria-label={`View ${product.name}`}
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => navigate(`/products/${product._id}/edit`)}
                    aria-label={`Edit ${product.name}`}
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-button icon-button-danger"
                    onClick={() => onDelete(product)}
                    aria-label={`Delete ${product.name}`}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
