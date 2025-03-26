import UnpluginTypia from '@ryoppippi/unplugin-typia/vite'
import { defineConfig } from 'vite'
import { resolve } from 'path'
export default defineConfig({
  plugins: [
    UnpluginTypia({ /* options */ })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'nemo',
      fileName: 'nemo'
    },
    target: 'node22',
    rollupOptions: {
      external: [
        'path',
        'fs',
        'os',
        'crypto',
        'dotenv',
      ]
    }
  },
  optimizeDeps: {
    noDiscovery: true,
  }
})