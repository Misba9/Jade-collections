import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to all IPs
    port: 5173,
    watch: {
      usePolling: true, // Critical fix for WebContainer environments
      interval: 100,
    },
    hmr: {
      clientPort: 443, // Ensures HMR works over the correct port in cloud IDEs
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
