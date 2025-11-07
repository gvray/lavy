import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import type { Linter } from 'eslint'
import { ignores } from './ignores'

export const vueConfig: Linter.Config[] = [
  {
    ignores
  },
  {
    files: ['**/*.{js,vue}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'indent': ['error', 2, { SwitchCase: 1 }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error'
    }
  },
  {
    files: ['**/*.vue'],
    plugins: {
      vue: vue as any
    },
    rules: {
      ...vue.configs.recommended.rules
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest' as const,
        sourceType: 'module' as const
      }
    }
  }
] 

export default vueConfig

if (typeof module !== 'undefined') {
  module.exports = vueConfig
}