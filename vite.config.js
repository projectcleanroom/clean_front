import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // ... 기타 설정
  server: {
    proxy: {
      '/api': {
        target: 'https://data.clean-room.co.kr',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});