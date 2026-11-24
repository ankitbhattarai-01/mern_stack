import { useState } from 'react'
import { getErrorMessage } from '../services/api.js'
import { CATEGORIES } from '../utils/product.js'

const EMPTY_PRODUCT = {
  name: '',
  category: '',
  quantity: '',
  expiryDate: '',
  description: '',
}

const validate = ({ name, category, quantity, expiryDate }) => {
  const errors = {}

  if (!name.trim()) errors.name = 'Product name is required'
  if (!category) errors.category = 'Choose a category'
  if (quantity === '' || Number(quantity) < 0) {
    errors.quantity = 'Quantity must be 0 or more'
  }
  if (!expiryDate) errors.expiryDate = 'Expiry date is required'

  return errors
}

// Used by both Add Product and Edit Product. The page decides what happens on
// submit through onSubmit, and Edit passes in the existing values to fill the form.
const ProductForm = ({
  initialValues = EMPTY_PRODUCT,
  submitLabel,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  // One handler for every field: input "name" attributes match the keys in values.
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formErrors = validate(values)
    setErrors(formErrors)
    if (Object.keys(formErrors).length > 0) return

    setSaving(true)
    setServerError('')
    try {
      await onSubmit({ ...values, quantity: Number(values.quantity) })
    } catch (err) {
      setServerError(getErrorMessage(err))
      setSaving(false)
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      {serverError && <p className="form-error">{serverError}</p>}

      <div className="field">
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={100}
          placeholder="e.g. Fresh Milk 1L"
          value={values.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="field-error">{errors.category}</p>}
        </div>

        <div className="field">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={values.quantity}
            onChange={handleChange}
            aria-invalid={Boolean(errors.quantity)}
          />
          {errors.quantity && <p className="field-error">{errors.quantity}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="expiryDate">Expiry Date</label>
        <input
          id="expiryDate"
          name="expiryDate"
          type="date"
          value={values.expiryDate}
          onChange={handleChange}
          aria-invalid={Boolean(errors.expiryDate)}
        />
        {errors.expiryDate && (
          <p className="field-error">{errors.expiryDate}</p>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">
          Description <span className="field-optional">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={500}
          placeholder="Storage notes, brand, or anything else useful"
          value={values.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="button button-primary"
          disabled={saving}
        >
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
