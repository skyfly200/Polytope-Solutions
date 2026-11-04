import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    // Precaching service worker, registered from src/registerServiceWorker.ts
    VitePWA({
      filename: "service-worker.js",
      injectRegister: false,
      manifest: false,
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "img/icons/*.png", "img/icons/*.svg"],
      workbox: {
        // Keep the font files out of the precache; they are fetched on demand.
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    outDir: "dist",
    target: "es2015",
    commonjsOptions: {
      // vue-class-component only ships CJS and requires "vue"; without this the
      // bundled require("vue") yields the ESM namespace rather than Vue itself.
      requireReturnsDefault: "preferred",
    },
  },
});
