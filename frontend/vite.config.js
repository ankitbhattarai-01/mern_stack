import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In development, send API calls to the local backend. On EC2, nginx does this.
    proxy: { '/api': 'http://localhost:5000' },
  },
})
