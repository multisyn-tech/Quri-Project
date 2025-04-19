import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'my-custom-build.js',
        chunkFileNames: 'chunks-[name].js',
        assetFileNames: 'assets-[name].[ext]',
      },
    },
  },
});
