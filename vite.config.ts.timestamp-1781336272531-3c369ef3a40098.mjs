// vite.config.ts
import { defineConfig } from "file:///Users/oui/Documents/3.%20Side%20Projects/wutcharin/node_modules/vite/dist/node/index.js";
import react from "file:///Users/oui/Documents/3.%20Side%20Projects/wutcharin/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  },
  plugins: [react()],
  build: {
    // Raise the warning threshold — the 500kB default is noise for a
    // content-rich portfolio where each chunk is well-scoped below.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split heavy vendor libs into their own cacheable chunks so
        // they don't bloat the initial bundle and can be cached across
        // deploys that don't touch them.
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion", "gsap", "@gsap/react", "lenis"],
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei", "maath"],
          "vendor-charts": ["recharts", "d3-scale"],
          "vendor-ocr": ["tesseract.js"],
          "vendor-docs": ["xlsx", "jspdf", "html2canvas", "docx", "file-saver", "pdf-parse"],
          "vendor-icons": ["lucide-react"],
          "vendor-ai": ["@google/generative-ai"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvb3VpL0RvY3VtZW50cy8zLiBTaWRlIFByb2plY3RzL3d1dGNoYXJpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL291aS9Eb2N1bWVudHMvMy4gU2lkZSBQcm9qZWN0cy93dXRjaGFyaW4vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL291aS9Eb2N1bWVudHMvMy4lMjBTaWRlJTIwUHJvamVjdHMvd3V0Y2hhcmluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBidWlsZDoge1xuICAgIC8vIFJhaXNlIHRoZSB3YXJuaW5nIHRocmVzaG9sZCBcdTIwMTQgdGhlIDUwMGtCIGRlZmF1bHQgaXMgbm9pc2UgZm9yIGFcbiAgICAvLyBjb250ZW50LXJpY2ggcG9ydGZvbGlvIHdoZXJlIGVhY2ggY2h1bmsgaXMgd2VsbC1zY29wZWQgYmVsb3cuXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA5MDAsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIFNwbGl0IGhlYXZ5IHZlbmRvciBsaWJzIGludG8gdGhlaXIgb3duIGNhY2hlYWJsZSBjaHVua3Mgc29cbiAgICAgICAgLy8gdGhleSBkb24ndCBibG9hdCB0aGUgaW5pdGlhbCBidW5kbGUgYW5kIGNhbiBiZSBjYWNoZWQgYWNyb3NzXG4gICAgICAgIC8vIGRlcGxveXMgdGhhdCBkb24ndCB0b3VjaCB0aGVtLlxuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICd2ZW5kb3ItbW90aW9uJzogWydmcmFtZXItbW90aW9uJywgJ2dzYXAnLCAnQGdzYXAvcmVhY3QnLCAnbGVuaXMnXSxcbiAgICAgICAgICAndmVuZG9yLXRocmVlJzogWyd0aHJlZScsICdAcmVhY3QtdGhyZWUvZmliZXInLCAnQHJlYWN0LXRocmVlL2RyZWknLCAnbWFhdGgnXSxcbiAgICAgICAgICAndmVuZG9yLWNoYXJ0cyc6IFsncmVjaGFydHMnLCAnZDMtc2NhbGUnXSxcbiAgICAgICAgICAndmVuZG9yLW9jcic6IFsndGVzc2VyYWN0LmpzJ10sXG4gICAgICAgICAgJ3ZlbmRvci1kb2NzJzogWyd4bHN4JywgJ2pzcGRmJywgJ2h0bWwyY2FudmFzJywgJ2RvY3gnLCAnZmlsZS1zYXZlcicsICdwZGYtcGFyc2UnXSxcbiAgICAgICAgICAndmVuZG9yLWljb25zJzogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICAndmVuZG9yLWFpJzogWydAZ29vZ2xlL2dlbmVyYXRpdmUtYWknXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1VLFNBQVMsb0JBQW9CO0FBQ2hXLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE9BQU87QUFBQTtBQUFBO0FBQUEsSUFHTCx1QkFBdUI7QUFBQSxJQUN2QixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJTixjQUFjO0FBQUEsVUFDWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDekQsaUJBQWlCLENBQUMsaUJBQWlCLFFBQVEsZUFBZSxPQUFPO0FBQUEsVUFDakUsZ0JBQWdCLENBQUMsU0FBUyxzQkFBc0IscUJBQXFCLE9BQU87QUFBQSxVQUM1RSxpQkFBaUIsQ0FBQyxZQUFZLFVBQVU7QUFBQSxVQUN4QyxjQUFjLENBQUMsY0FBYztBQUFBLFVBQzdCLGVBQWUsQ0FBQyxRQUFRLFNBQVMsZUFBZSxRQUFRLGNBQWMsV0FBVztBQUFBLFVBQ2pGLGdCQUFnQixDQUFDLGNBQWM7QUFBQSxVQUMvQixhQUFhLENBQUMsdUJBQXVCO0FBQUEsUUFDdkM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
