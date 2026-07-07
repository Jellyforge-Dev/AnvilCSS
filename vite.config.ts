import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const ENTRY = 'src/renderer/src/main.tsx';

// Tampermonkey/Violentmonkey metadata block. @match is intentionally broad — main.tsx itself
// verifies it is running on a real Jellyfin page (#reactRoot + window.ApiClient) before it
// injects anything, so a wide @match here just means "try on every page", not "run on every page".
const USERSCRIPT_HEADER = `// ==UserScript==
// @name         Jellyforge AnvilCSS
// @namespace    https://github.com/Jellyforge-Dev/AnvilCSS
// @version      1.0.0
// @description  Floating, live CSS theme builder sidebar for Jellyfin — edit colors, background, logos, typography and components and see them applied to your real Jellyfin instance instantly.
// @author       Jellyforge
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

`;

// `rollupOptions.output.banner` is silently dropped by Vite's lib-mode output resolution for
// single-format iife builds — prepending it in generateBundle is the reliable path instead.
function userscriptBanner(banner: string): Plugin {
  return {
    name: 'userscript-banner',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk') {
          file.code = banner + file.code;
        }
      }
    }
  };
}

export default defineConfig(({ command }) => ({
  plugins: [react(), ...(command === 'build' ? [userscriptBanner(USERSCRIPT_HEADER)] : [])],
  publicDir: false,
  build:
    command === 'build'
      ? {
          outDir: 'dist',
          emptyOutDir: true,
          assetsInlineLimit: Infinity,
          cssCodeSplit: false,
          minify: 'esbuild',
          lib: {
            entry: ENTRY,
            name: 'AnvilCSSInjector',
            formats: ['iife'],
            fileName: () => 'anvil-customizer.user.js'
          },
          rollupOptions: {
            output: {
              inlineDynamicImports: true
            }
          }
        }
      : undefined
}));
