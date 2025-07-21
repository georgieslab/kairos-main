import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, '/v1/messages'),
        secure: true,
        logLevel: 'debug'  // Logs proxy requests for debugging
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 3000
  }
});