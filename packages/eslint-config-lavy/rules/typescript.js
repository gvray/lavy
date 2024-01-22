module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json', // default project config
    createDefaultProgram: true, // 兼容未在 tsconfig.json 中 provided 的文件
    sourceType: 'module',
    extraFileExtensions: ['.vue']
  },
  settings: {
    // Apply special parsing for TypeScript files
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.d.ts', '.tsx']
    },
    // Use eslint-import-resolver-typescript
    'import/resolver': {
      typescript: {}
    },
    // Append 'ts' extensions to 'import/extensions' setting
    'import/extensions': ['.js', '.ts', '.mjs']
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-shadow': 'error'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // Disable `no-undef` rule within TypeScript files because it incorrectly errors when exporting default interfaces
        // https://github.com/iamturns/eslint-config-airbnb-typescript/issues/50
        // This will be caught by TypeScript compiler if `strictNullChecks` (or `strict`) is enabled
        'no-undef': 'off',

        /* Using TypeScript makes it safe enough to disable the checks below */

        // Disable ESLint-based module resolution check for improved monorepo support
        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
        'import/no-unresolved': 'off'
      }
    }
  ]
}
