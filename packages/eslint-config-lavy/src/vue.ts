import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
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

export const vueConfig: Linter.Config[] = [
  {
    ignores
  },
  // Spread Vue's flat recommended configs first
  ...vue.configs['flat/recommended'],
  // Then add our globals and any overrides
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest' as const,
      sourceType: 'module' as const,
      globals: {
        ...platformGlobals
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]

export default vueConfig