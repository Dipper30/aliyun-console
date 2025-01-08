import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImp from 'vite-plugin-imp';
import path from 'path';
import tailwindcss from 'tailwindcss';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginImp({
      optimize: true,
      libList: [
        {
          libName: 'antd',
          libDirectory: 'es',
          style: name => `antd/es/${name}/style`,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: '@use "@/css/global" as *;',
      },
      less: {
        javascriptEnabled: true,
      },
    },
  },
  envPrefix: 'APTX_', // 设置env文件可见变量默认前缀
});
