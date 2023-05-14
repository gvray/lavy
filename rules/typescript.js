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
    '@typescript-eslint/no-empty-function': 'off'
  }
}
