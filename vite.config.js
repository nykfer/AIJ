import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/articles': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // ensure redirects from backend for /articles/latest to /articles/:id are followed by browser
        rewrite: (path) => path
      }
    }
  }
})
