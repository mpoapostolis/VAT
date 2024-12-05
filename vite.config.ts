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
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'utils': path.resolve(__dirname, './src/utils'),
      'types': path.resolve(__dirname, './src/types'),
      'styles': path.resolve(__dirname, './src/styles'),
      'pages': path.resolve(__dirname, './src/pages'),
    },
  },
});