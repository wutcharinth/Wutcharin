import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  build: {
    // Raise the warning threshold — the 500kB default is noise for a
    // content-rich portfolio where each chunk is well-scoped below.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split heavy vendor libs into their own cacheable chunks so
        // they don't bloat the initial bundle and can be cached across
        // deploys that don't touch them.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion', 'gsap', '@gsap/react', 'lenis'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei', 'maath'],
          'vendor-charts': ['recharts', 'd3-scale'],
          'vendor-ocr': ['tesseract.js'],
          'vendor-docs': ['xlsx', 'jspdf', 'html2canvas', 'docx', 'file-saver', 'pdf-parse'],
          'vendor-icons': ['lucide-react'],
          'vendor-ai': ['@google/generative-ai'],
        },
      },
    },
  },
})
