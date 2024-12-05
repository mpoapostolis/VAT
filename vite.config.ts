import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      src: '/src',
      components: '/src/components',
      hooks: '/src/hooks',
      utils: '/src/utils',
      types: '/src/types',
      styles: '/src/styles',
      pages: '/src/pages',
    
    },
  },
});