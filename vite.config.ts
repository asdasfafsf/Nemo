import UnpluginTypia from '@ryoppippi/unplugin-typia/vite'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    UnpluginTypia({ /* options */ })
  ],
  build: {
    lib: {
      // 여러 진입점 설정
      entry: {
        nemo: resolve(__dirname, 'src/index.ts'),
        worker: resolve(__dirname, 'src/script/worker.ts'),
        server: resolve(__dirname, 'src/server.ts')
      },
      name: 'nemo',
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    target: 'node22',
    rollupOptions: {
      external: [
        'path',
        'fs',
        'os',
        'crypto',
        'dotenv',
        'fastify',
      ]
    }
  },
  optimizeDeps: {
    noDiscovery: true,
  }
})