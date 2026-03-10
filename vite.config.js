import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/BAYANUL-ULOOOM-KUNNATH-DARS/', // Base URL of your GitHub Pages site
})
