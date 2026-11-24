import { PackageOpen, Plus, Search, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback.jsx'
import ProductTable from '../components/ProductTable.jsx'
import {
  deleteProduct,
  getErrorMessage,
  getProducts,
} from '../services/api.js'
import { CATEGORIES, STATUSES } from '../utils/product.js'

// How long to wait after the last keystroke before searching.
const SEARCH_DELAY_MS = 250

const Products = () => {
  // These filters live in the URL, so a dashboard card can link straight to a
  // filtered list and a browser refresh keeps them.
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const status = searchParams.get('status') ?? ''
  const sort = searchParams.get('sort') ?? 'asc'

  // The URL updates slightly after each keystroke, which would lose letters
  // while typing quickly, so the search box uses normal state instead.
  const [search, setSearch] = useState('')
  const hasFilters = Boolean(search || category || status)

  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [productToDelete, setProductToDelete] = useState(null)

  useEffect(() => {
    let ignore = false

    const timer = setTimeout(async () => {
      try {
        const result = await getProducts({
          ...Object.fromEntries(searchParams),
          search,
        })
        if (!ignore) {
          setProducts(result)
          setError('')
        }
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err))
      }
    }, SEARCH_DELAY_MS)

    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [searchParams, search, reloadKey])

  const updateFilter = (name, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    setSearch('')
    setSearchParams({}, { replace: true })
  }

  const handleDelete = async () => {
    await deleteProduct(productToDelete._id)
    setProducts(products.filter((p) => p._id !== productToDelete._id))
    setProductToDelete(null)
  }

  const renderResults = () => {
    if (error) {
      return (
        <ErrorMessage
          message={error}
          onRetry={() => setReloadKey(reloadKey + 1)}
        />
      )
    }
    if (!products) return <Loading text="Loading products..." />

    if (products.length === 0 && hasFilters) {
      return (
        <EmptyState
          icon={SearchX}
          title="No matching products"
          text="Try a different search or clear the filters."
        >
          <button type="button" className="button" onClick={clearFilters}>
            Clear filters
          </button>
        </EmptyState>
      )
    }

    if (products.length === 0) {
      return (
        <EmptyState
          icon={PackageOpen}
          title="No products yet"
          text="Add your first product to start tracking its expiry date."
        >
          <Link to="/products/new" className="button button-primary">
            <Plus size={18} /> Add Product
          </Link>
        </EmptyState>
      )
    }

    return <ProductTable products={products} onDelete={setProductToDelete} />
  }

  return (
    <>
      <div className="page-header">
        <p className="page-intro">
          {products
            ? `${products.length} ${products.length === 1 ? 'product' : 'products'} shown`
            : 'Search, filter and manage your products.'}
        </p>
        <Link to="/products/new" className="button button-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search by name"
            aria-label="Search products by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by expiry status"
          value={status}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort by expiry date"
          value={sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
        >
          <option value="asc">Expiry: soonest first</option>
          <option value="desc">Expiry: latest first</option>
        </select>
      </div>

      {renderResults()}

      {productToDelete && (
        <ConfirmDialog
          title="Delete this product?"
          message={`"${productToDelete.name}" will be permanently removed.`}
          onCancel={() => setProductToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}

export default Products
