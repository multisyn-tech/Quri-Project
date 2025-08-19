// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   define: {
//     'process.env': {}
//   },
//   build: {
//     rollupOptions: {
//       output: {
//         entryFileNames: 'my-custom-build.js',
//         chunkFileNames: 'chunks-[name].js',
//         assetFileNames: 'assets-[name].[ext]',
//       },
//     },
//   },
// });




import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on mode (prod/test/local)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': {}
    },
    base: env.VITE_APP_BASE || '/', 
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'my-custom-build.js',
          chunkFileNames: 'chunks-[name].js',
          assetFileNames: 'assets-[name].[ext]',
        },
      },
    },
  };
});
