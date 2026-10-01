import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build` makes the normal multi-file production build in dist/.
// `npm run build:single` makes one self-contained preview file in dist-single/.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "single" ? [viteSingleFile()] : [])],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: mode === "single" ? { outDir: "dist-single", assetsInlineLimit: 100_000_000 } : {},
  // The enquiry form posts to /api/leads; forward it to the live lead API, as vercel.json does in production.
  server: { proxy: { "/api/leads": { target: "https://www.quillstudio.tech", changeOrigin: true } } },
  preview: { proxy: { "/api/leads": { target: "https://www.quillstudio.tech", changeOrigin: true } } },
}));
