import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEBUG__: process.env.NODE_ENV !== 'production',
  },
});
