import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["fe-spck4.onrender.com"], // Thay bằng domain của bạn
  },
});
