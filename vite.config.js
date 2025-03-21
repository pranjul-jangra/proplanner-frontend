import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';


export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress' })
  ],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
    output: {
      manualChunks(id) {
        if (id.includes("node_modules")) {
          return "vendor";
        }
      },
    },
  },
});

