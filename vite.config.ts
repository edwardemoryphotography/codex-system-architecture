import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          vendor: ['lucide-react'],
        },
      },
    },
    // Keep warning limit at default 500kB — manualChunks now splits the
    // largest vendor chunk below it (~594kB previously). Raise only if
    // intentional (e.g. adding a heavy 3D lib).
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
