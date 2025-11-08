import { defineConfig } from 'eslint/config'
import globals from 'globals'

import { tsConfig } from 'eslint-config-lavy/ts'

import { tsxConfig } from 'eslint-config-lavy/tsx'


export default defineConfig([
  
  ...tsConfig,
  
  ...tsxConfig,
  
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
    rules: {
      // 你可以在这里添加项目特定的规则
    }
  }
])
