import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // 이거 sockjs 오류 우회용 OK!
  },
  server: {
    ws: true,
    proxy: {
      // REST API 프록시 (예시)
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // WebSocket 프록시 (★중요)
      "/ws-stomp": {
        target: "http://localhost:8080",
        ws: true, // ★ 이거 꼭 필요함!
        changeOrigin: true,
      },
    },
  },
});
