import { defineConfig } from 'vitest/config';
import UnpluginTypia from '@ryoppippi/unplugin-typia/vite';

export default defineConfig({
  plugins: [
    UnpluginTypia({
      // 기본 옵션으로 충분함
    })
  ],
  
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',  // 또는 'istanbul'
      reporter: ['text', 'json', 'html'],
      exclude: [
          'node_modules/',
          'test/',
          '**/*.test.ts',
          'dist/',
          'vite.config.ts',
          'vitest.config.ts'
      ]
  }
  },
  
  optimizeDeps: {
    noDiscovery: true,
    include: []
  }
});
