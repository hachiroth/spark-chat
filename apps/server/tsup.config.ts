import { defineConfig } from 'tsup'

export default defineConfig({
  target: 'esnext',
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
  },
  tsconfig: './tsconfig.build.json',
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: 'dist',
})
