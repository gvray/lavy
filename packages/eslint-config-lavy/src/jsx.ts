import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import type { Linter } from 'eslint'
import { ignores } from './ignores'
import globals from 'globals'
import { getProjectPlatform } from './utils/platform'

const platform = getProjectPlatform()
const platformGlobals = platform === 'node'
  ? globals.node
  : platform === 'universal'
    ? { ...globals.browser, ...globals.node }
    : globals.browser

export const jsxConfig: Linter.Config[] = [
  {
    ignores
  },
  {
    files: ['**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest' as const,
      sourceType: 'module' as const,
      globals: {
        ...platformGlobals
      }
    },
    plugins: {
      'react': react as any,
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

export default jsxConfig

if (typeof module !== 'undefined') {
  module.exports = jsxConfig
}
