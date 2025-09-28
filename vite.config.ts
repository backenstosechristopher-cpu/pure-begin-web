import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'mobile-guthaben': 'mobile/guthaben.de.html',
        'desktop-guthaben': 'desktop/guthaben.de.html',
        'mobile-guthaben-at': 'mobile/guthaben.de_.html',
        'desktop-guthaben-at': 'desktop/guthaben.de_.html',
      }
    }
  }
}));
