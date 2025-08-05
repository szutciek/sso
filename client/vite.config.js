import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "./img/logo-round192.png",
        "./img/logo-round512.png",
        "/android-chrome-192x192.png",
        "/android-chrome-512x512.png",
      ],
      manifest: {
        name: "Kanapka SSO",
        short_name: "Kanapka SSO",
        theme_color: "#246bfd",
        background_color: "#ffffff",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "./img/logo-round192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./img/logo-round512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "./img/logo-round192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "./img/logo-round512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        navigateFallbackDenylist: [/^\/authorize/],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/authenticate": "http://localhost:4771",
      "/authorize": "http://localhost:4771",
      "/api": "http://localhost:4771",
      "/assets": "http://localhost:4771",
    },
  },
});
