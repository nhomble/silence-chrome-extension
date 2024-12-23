import { defineConfig } from "vite"
import eslint from "vite-plugin-eslint"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@helpers": path.resolve(__dirname, "./src/helpers"),
      "@content_script": path.resolve(__dirname, "./src/content_script"),
    },
  },
  plugins: [
    eslint()
  ],
  build: {
    rollupOptions: {
      input: "src/content_script.js",
      output: {
        dir: "output_content_script",
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]"
      }
    }
  }
})