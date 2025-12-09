import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// aryansom80
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["cannon-es"],
  },
});
