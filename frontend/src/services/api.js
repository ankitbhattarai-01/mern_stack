import axios from 'axios'

// Every request to the backend goes through this file, so components never
// need to know the server's address.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// The backend wraps its data as { success, message, result }.
const getResult = (response) => response.data.result

export const getProducts = (params) =>
  api.get('/products', { params }).then(getResult)

export const getProduct = (id) => api.get(`/products/${id}`).then(getResult)

export const createProduct = (product) =>
  api.post('/products', product).then(getResult)

export const updateProduct = (id, product) =>
  api.put(`/products/${id}`, product).then(getResult)

export const deleteProduct = (id) => api.delete(`/products/${id}`)

export const getDashboardStats = () => api.get('/dashboard/stats').then(getResult)

export const getExpiringProducts = () =>
  api.get('/dashboard/expiring').then(getResult)

export const getExpiredProducts = () =>
  api.get('/dashboard/expired').then(getResult)

export const getRecentProducts = () => api.get('/dashboard/recent').then(getResult)

// Uses the backend's message when there is one. No response at all means the
// server could not be reached.
export const getErrorMessage = (error) =>
  error.response?.data?.message ??
  'Cannot reach the server. Check that the backend is running.'
