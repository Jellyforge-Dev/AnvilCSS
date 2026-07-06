import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the sidebar as a single self-contained IIFE bundle that the AnvilCSS proxy
// injects into the real, unmodified jellyfin-web frontend (see server/injectHtml.js).
export default defineConfig({
  plugins: [react()],
  publicDir: 'src/renderer/public',
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist/anvil',
    emptyOutDir: true,
    lib: {
      entry: 'src/renderer/src/injector-entry.tsx',
      formats: ['iife'],
      name: 'AnvilCSSInjector',
      fileName: () => 'anvil-injector.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: 'anvil-injector.[ext]'
      }
    }
  }
});
