import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import type { Linter } from 'eslint'
import { ignores } from './ignores'
import globals from 'globals'
import { getProjectPlatform } from './utils/platform'
export const tsxConfig: Linter.Config[] = [
  {
    ignores
  },
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest' as const,
        sourceType: 'module' as const,
        project: './tsconfig.json'
      },
      globals: {
        ...(() => {
          const platform = getProjectPlatform()
          return platform === 'node' ? globals.node : platform === 'universal' ? { ...globals.browser, ...globals.node } : globals.browser
        })()
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
  },
  {
    files: ['**/*.tsx'],
    plugins: {
      react: react as any,
      'react-hooks': reactHooks as any
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
] 

export default tsxConfig