import { defineConfig } from 'vite';

export default defineConfig({
  // Cấu hình tùy chỉnh của bạn ở đây
  root: './dist',  // Thư mục gốc chứa tệp index.html
  build: {
    outDir: 'dist',  // Thư mục xuất ra sau khi build
  },
});