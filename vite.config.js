import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEBUG__: process.env.VITEST ? false : process.env.NODE_ENV !== 'production',
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
