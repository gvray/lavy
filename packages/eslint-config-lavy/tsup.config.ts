import path from 'node:path';
import fs from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/js.ts',
    'src/ts.ts',
    'src/jsx.ts',
    'src/tsx.ts',
    'src/vue.ts'
  ],
  target: 'node18',
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  external: [
    'eslint',
    '@eslint/js',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-vue'
  ],
});
