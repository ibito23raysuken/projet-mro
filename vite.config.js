import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Charger les variables .env
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // ⚠ doit être une URL complète
          changeOrigin: true,
          headers: {
            'Accept': env.VITE_API_ACCEPT,
            'Content-Type': env.VITE_API_CONTENT_TYPE,
          },
        },
      },
    },
  }
})
