// vite.config.js
import { defineConfig } from "file:///C:/Users/jeric/OneDrive/Documents/Web%20Development/multivar-game/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/jeric/OneDrive/Documents/Web%20Development/multivar-game/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  base: "/multivar-game/",
  server: {
    proxy: {
      "/socket.io": {
        target: "https://multivar-server.onrender.com/",
        ws: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqZXJpY1xcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcV2ViIERldmVsb3BtZW50XFxcXG11bHRpdmFyLWdhbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGplcmljXFxcXE9uZURyaXZlXFxcXERvY3VtZW50c1xcXFxXZWIgRGV2ZWxvcG1lbnRcXFxcbXVsdGl2YXItZ2FtZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvamVyaWMvT25lRHJpdmUvRG9jdW1lbnRzL1dlYiUyMERldmVsb3BtZW50L211bHRpdmFyLWdhbWUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBiYXNlOiBcIi9tdWx0aXZhci1nYW1lL1wiLFxyXG4gIHNlcnZlcjp7XHJcbiAgICBwcm94eTp7XHJcbiAgICAgICcvc29ja2V0LmlvJzp7XHJcbiAgICAgICAgdGFyZ2V0OlwiaHR0cHM6Ly9tdWx0aXZhci1zZXJ2ZXIub25yZW5kZXIuY29tL1wiLFxyXG4gICAgICAgIHdzOnRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErWCxTQUFTLG9CQUFvQjtBQUM1WixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE1BQU07QUFBQSxFQUNOLFFBQU87QUFBQSxJQUNMLE9BQU07QUFBQSxNQUNKLGNBQWE7QUFBQSxRQUNYLFFBQU87QUFBQSxRQUNQLElBQUc7QUFBQSxNQUNMO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=