import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_HOST || '0.0.0.0',
    port: parseInt(process.env.VITE_PORT) || 3030,
    watch: {
      usePolling: true
    },
    // Only restrict hosts in production
    ...(isProduction && {
      allowedHosts: ['pickle.compound-interests.com', 'localhost', '127.0.0.1']
    })
  },
  preview: {
    host: process.env.VITE_HOST || '0.0.0.0',
    port: parseInt(process.env.VITE_PORT) || 3030,
    strictPort: true,
    allowedHosts: ['pickle.compound-interests.com', 'localhost', '127.0.0.1']
  }
})