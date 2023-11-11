import preact           from '@preact/preset-vite'
import { resolve }      from 'node:path'
import { defineConfig } from 'vite'
import tsconfigPaths    from 'vite-tsconfig-paths'

const root = resolve(__dirname, '..')

export default defineConfig({
  cacheDir: '../node_modules/.vite/preview',
  plugins: [preact(), tsconfigPaths({ root })],

  server: {
    port: 3000
  }
})
