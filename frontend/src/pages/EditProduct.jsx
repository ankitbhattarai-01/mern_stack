import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorMessage, Loading } from '../components/Feedback.jsx'
import ProductForm from '../components/ProductForm.jsx'
import { getErrorMessage, getProduct, updateProduct } from '../services/api.js'
import { toInputDate } from '../utils/product.js'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')

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

  const handleSubmit = async (values) => {
    await updateProduct(id, values)
    navigate(`/products/${id}`)
  }

  if (error) return <ErrorMessage message={error} />
  if (!product) return <Loading text="Loading product..." />

  return (
    <ProductForm
      initialValues={{
        name: product.name,
        category: product.category,
        quantity: String(product.quantity),
        expiryDate: toInputDate(product.expiryDate),
        description: product.description,
      }}
      submitLabel="Save Changes"
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/products/${id}`)}
    />
  )
}

export default EditProduct
