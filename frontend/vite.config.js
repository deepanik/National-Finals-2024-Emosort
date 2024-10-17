// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', // Define global as window
    'process.env': {}, // Define process.env for compatibility
  },
  resolve: {
    alias: {
      buffer: 'buffer', // Ensure buffer is aliased correctly
    },
  },
});
