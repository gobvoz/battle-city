import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  define: {
    __DEBUG__: process.env.VITEST ? false : process.env.NODE_ENV !== 'production',
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        editor: resolve(__dirname, 'editor.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/__tests__/**'],
    },
  },
});
