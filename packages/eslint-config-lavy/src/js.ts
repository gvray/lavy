import js from '@eslint/js'
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

export const jsConfig: Linter.Config[] = [
  {
    ignores
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...platformGlobals
      }
    },
    plugins: {
      '@eslint/js': js as any
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
]

export default jsConfig