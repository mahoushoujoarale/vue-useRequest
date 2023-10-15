import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(() => ({
  plugins: [
    vue(),
    viteCompression(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vue-useRequest',
    },
    rollupOptions: {
      external: ['vue', 'vue-demi'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-demi': 'VueDemi',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  },
}));