import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-mui-icons': ['@mui/icons-material'],
          'vendor-utils': ['axios', 'zod', 'react-hook-form', '@hookform/resolvers'],
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          'vendor-syntax-highlighter': ['react-syntax-highlighter'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
