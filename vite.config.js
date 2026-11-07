import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  // Use root '/' when deployed on Netlify or custom domains, and '/parshva-portfolio/' on GitHub Pages
  const isNetlify = process.env.NETLIFY === 'true' || process.env.VITE_DEPLOY_TARGET === 'netlify'
  const base = isNetlify ? '/' : '/parshva-portfolio/'

  return {
    base,
    plugins: [react(), tailwindcss()],
  }
})
