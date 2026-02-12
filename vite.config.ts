import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // 네트워크 접근 허용
    port: 3000,
    strictPort: false, // 포트가 사용 중이면 다른 포트 사용
    // hmr: clientPort 제거 - Vite가 실제 서버 포트를 자동 감지하도록 함
    // proxy: {
    //   '/api': {
    //     target: 'http://168.138.41.19:8080',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
})
