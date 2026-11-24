import { useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm.jsx'
import { createProduct } from '../services/api.js'

const AddProduct = () => {
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    const product = await createProduct(values)
    navigate(`/products/${product._id}`)
  }

  return (
    <ProductForm
      submitLabel="Add Product"
      onSubmit={handleSubmit}
      onCancel={() => navigate('/products')}
    />
  )
}

export default AddProduct
