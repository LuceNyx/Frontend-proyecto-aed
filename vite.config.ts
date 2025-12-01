import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxyear llamadas a /api al backend que corre en 0.0.0.0:18080
      '/api': {
        target: 'http://0.0.0.0:18080',
        changeOrigin: true,
        secure: false,
        // Reescribir '/api/check' -> '/check' en el backend
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
