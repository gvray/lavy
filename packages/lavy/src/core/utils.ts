import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getPackageJsonType(
  cwd: string = process.cwd(),
): 'module' | 'commonjs' {
  const packageJsonPath = resolve(cwd, 'package.json')

  if (!existsSync(packageJsonPath)) {
    return 'commonjs' // 默认使用 CommonJS
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    return packageJson.type === 'module' ? 'module' : 'commonjs'
  } catch (error) {
    return 'commonjs' // 解析失败时默认使用 CommonJS
  }
}

export async function generateEslintConfigString({
  language,
  framework,
  style,
  moduleType,
}: {
  language: 'js' | 'ts'
  framework: 'none' | 'react' | 'vue' | 'svelte' | 'solid'
  style: 'none' | 'css' | 'scss' | 'sass' | 'less' | 'stylus'
  moduleType: 'esm' | 'cjs'
}): Promise<string> {
  // 读取模板文件
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const templatePath = join(__dirname, './templates/eslint.config.tpl.txt')
  const template = await readFile(templatePath, 'utf-8')

  const getConfigType = (): string => {
    if (framework === 'react') {
      return language === 'ts' ? 'tsx' : 'jsx'
    }
    if (framework === 'vue') {
      return language === 'ts' ? 'vuets' : 'vue'
    }
    return language === 'ts' ? 'ts' : 'js'
  }

  const configType = getConfigType()

  // 简单的模板渲染（替换条件块）
  let result = template

  // 处理所有条件块
  const conditions = ['js', 'ts', 'jsx', 'tsx', 'vue', 'vuets']
  for (const condition of conditions) {
    if (configType === condition) {
      result = result.replace(
        new RegExp(
          `\\{\\{#if ${condition}\\}\\}([\\s\\S]*?)\\{\\{\/if\\}\\}`,
          'g',
        ),
        '$1',
      )
    } else {
      result = result.replace(
        new RegExp(
          `\\{\\{#if ${condition}\\}\\}[\\s\\S]*?\\{\\{\\/if\\}\\}`,
          'g',
        ),
        '',
      )
    }
  }

  // 如果是 CJS 格式，需要转换 import/export 语法
  if (moduleType === 'cjs') {
    result = result
      .replace(
        /import \{ defineConfig \} from 'eslint\/config'/g,
        "const { defineConfig } = require('eslint/config')",
      )
      .replace(
        /import globals from 'globals'/g,
        "const globals = require('globals')",
      )
      .replace(
        /import lavyConfig from 'eslint-config-lavy\/[^']*'/g,
        (match) => {
          return match.replace(
            /import lavyConfig from 'eslint-config-lavy\/([^']*)'/g,
            "const lavyConfig = require('eslint-config-lavy/$1')",
          )
        },
      )
      .replace(
        /export default defineConfig\(/g,
        'module.exports = defineConfig(',
      )
  }

  return result
}

export async function generatePrettierConfigString(
  config: any,
  moduleType: 'module' | 'commonjs',
): Promise<string> {
  // 读取模板文件
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const templatePath = join(__dirname, './templates/prettier.config.tpl.txt')
  const template = await readFile(templatePath, 'utf-8')

  // 如果是 CJS 格式，需要转换 export default 语法
  if (moduleType === 'commonjs') {
    return template.replace(/export default /g, 'module.exports = ')
  }

  return template
}

export async function generateStylelintConfigString(
  config: any,
  moduleType: 'module' | 'commonjs',
): Promise<string> {
  // 读取模板文件
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const templatePath = join(__dirname, './templates/stylelint.config.tpl.txt')
  const template = await readFile(templatePath, 'utf-8')

  // 如果是 CJS 格式，需要转换 export default 语法
  if (moduleType === 'commonjs') {
    return template.replace(/export default /g, 'module.exports = ')
  }

  return template
}
