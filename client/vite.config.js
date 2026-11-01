import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // درخواست‌های /api به بک‌اند می‌رود تا کوکی refresh روی یک origin بماند.
    proxy: { '/api': 'http://localhost:5000' },
  },
});
