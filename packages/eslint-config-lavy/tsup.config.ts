import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/ts.ts', 'src/vue.ts'],
  format: ['esm'],         // 如果你要 CJS，可加 'cjs'
  dts: true,
  clean: true,
  target: 'node18',
});
