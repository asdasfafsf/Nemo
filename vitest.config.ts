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
    include: ['**/*.test.ts']
  },
  
  optimizeDeps: {
    noDiscovery: true,
    include: []
  }
});
