import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import { ignores } from './ignores'

export const tsConfig: Linter.Config[] = [
  {
    ignores
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest' as const,
        sourceType: 'module' as const,
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': ts as any
    },
    rules: {
      ...ts.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  }
]

export default tsConfig

if (typeof module !== 'undefined') {
  module.exports = tsConfig
}
