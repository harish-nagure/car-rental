import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy /api and /uploads to the Express backend so the frontend can use relative URLs
    proxy: {
      "/api":     "http://localhost:5000",
      "/uploads": "http://localhost:5000"
    }
  }
});
