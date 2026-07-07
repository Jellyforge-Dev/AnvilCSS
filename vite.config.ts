import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds AnvilCSS as a fully static, self-contained SPA — no server, no backend, no build-time
// tokens. `npm run build` emits plain HTML/JS/CSS into dist/ that can be served by any static
// file host (nginx, Portainer, GitHub Pages, ...).
export default defineConfig({
  plugins: [react()],
  publicDir: 'src/renderer/public',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
