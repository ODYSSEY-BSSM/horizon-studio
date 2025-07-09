import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@emotion/styled', 'framer-motion'],
          flow: ['@xyflow/react'],
          query: ['@tanstack/react-query'],
          zustand: ['zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
