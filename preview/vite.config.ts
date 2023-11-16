import svg              from '@neodx/svg/vite'
import preact           from '@preact/preset-vite'
import { resolve }      from 'node:path'
import { defineConfig } from 'vite'
import webfontDownload  from 'vite-plugin-webfont-dl'
import tsconfigPaths    from 'vite-tsconfig-paths'

const root = resolve(__dirname, '..')

export default defineConfig({
  cacheDir: '../node_modules/.vite/preview',
  plugins: [
    preact(),
    tsconfigPaths({ root }),
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Montserrat&family=Questrial&display=swap'
    ]),
    svg({
      fileName: '{name}.{hash:8}.svg',
      group: true,
      metadata: {
        path: 'src/shared/ui/icon/sprite.gen.ts',
        runtime: {
          size: true,
          viewBox: true
        }
      },
      output: 'public/sprites',
      root: 'src/shared/assets'
    })
  ],

  server: {
    port: 3000
  }
})
