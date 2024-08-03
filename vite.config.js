import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // ... 기타 설정
  server: {
    proxy: {
      '/api': {
        target: 'https://43.202.40.73',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});