import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api requests to the ASP.NET Core backend.
      // This makes the browser treat all requests as same-origin (localhost:5173),
      // which means cookies set by the backend flow back correctly in development.
      '/api': {
        target: 'http://localhost:5019',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
