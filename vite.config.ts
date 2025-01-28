import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
const ReactCompilerConfig = {
  /* ... */
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
  ],
  resolve: {
    // alias: {
    //   '@': resolve(__dirname, 'src'),
    //   '#root': resolve(__dirname),
    // },
    alias: {
      '@': '/src',
    },
  },
});
