import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 fixes relative path issues in production
  build: {
    outDir: 'dist',
  },
})
