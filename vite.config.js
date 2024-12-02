import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    nodePolyfills(), // Important for web3 functionality
  ],
  build: {
    sourcemap: true,
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // This enables @/ imports
    },
  },
  define: {
    global: "globalThis", // Important for web3auth
  },
});
