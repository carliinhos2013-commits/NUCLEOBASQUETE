import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que variáveis de ambiente funcionem
    'process.env': process.env
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  }
});