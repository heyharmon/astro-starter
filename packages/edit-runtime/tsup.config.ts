import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    astro: 'src/astro.ts',
  },
  format: ['esm'],
  target: 'es2022',
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
  sourcemap: false,
})
