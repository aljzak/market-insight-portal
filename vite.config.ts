import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    port: 8080
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  optimizeDeps: {
    exclude: ['charting_library']
  },
  build: {
    commonjsOptions: {
      include: []
    },
    rollupOptions: {
      external: [
        '/charting_library/charting_library.standalone.js',
        '/datafeeds/udf/dist/bundle.js'
      ]
    }
  }
});