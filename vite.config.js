import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        // Set the asset pattern to remove the hash from JS and CSS
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`, // This affects CSS and other assets
      },
    },
  },
})
