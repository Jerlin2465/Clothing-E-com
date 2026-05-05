import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["clothing-e-com-v6ww.onrender.com"],
    host: "0.0.0.0",
    port: 5000,
  },
  preview: {
    allowedHosts: ["clothing-e-com-v6ww.onrender.com"],
    host: "0.0.0.0",
    port: 5000,
  },
});
