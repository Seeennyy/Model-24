import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          charts: ['chart.js'],
          math: ['mathjs', 'ml-matrix', 'simple-statistics']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['three', 'chart.js', 'mathjs']
  },
  
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
