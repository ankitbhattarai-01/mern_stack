import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import About from './pages/About.jsx'
import AddProduct from './pages/AddProduct.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditProduct from './pages/EditProduct.jsx'
import Landing from './pages/Landing.jsx'
import NotFound from './pages/NotFound.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      {/* The landing page has its own full-width design, with no sidebar. */}
      <Route path="/" element={<Landing />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<AddProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/edit" element={<EditProduct />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
