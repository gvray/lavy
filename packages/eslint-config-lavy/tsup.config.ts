import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/js.ts',
    'src/ts.ts',
    'src/jsx.ts',
    'src/tsx.ts',
    'src/vue.ts',
    'src/vuets.ts'
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'eslint',
    '@eslint/js',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-vue'
  ]
});
