import typescript        from '@rollup/plugin-typescript'
import { defineConfig }  from 'rollup'
import { RollupOptions } from 'rollup'
import bundleSize        from 'rollup-plugin-bundle-size'
import dts               from 'rollup-plugin-dts'
import esbuild           from 'rollup-plugin-esbuild'
import { terser }        from 'rollup-plugin-terser'

import pkg               from './package.json'

const TYPECHECK = true
const MINIFY = true

const src = (file: `${string}.ts`) => `src/${file}`

const bundle = (input: string, { plugins = [], ...config }: RollupOptions) =>
  defineConfig({
    ...config,
    external: (id) => !/^[./]/.test(id),
    input,

    plugins: plugins.filter(Boolean).concat(bundleSize())
  })

const config = defineConfig([
  bundle(src('index.ts'), {
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    plugins: [TYPECHECK && typescript(), esbuild(), MINIFY && terser()]
  }),

  bundle(src('index.ts'), {
    output: [
      {
        file: pkg.types,
        format: 'es'
      }
    ],
    plugins: [dts()]
  })
])

export default config
