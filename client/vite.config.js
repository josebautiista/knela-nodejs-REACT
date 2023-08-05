import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      input: {
        main: "src/main.jsx", // Reemplaza la ruta con la ruta real de tu punto de entrada
      },
    },
  },
});
