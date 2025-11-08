import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { GenerateConfigOptions } from '../types'

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

function resolveTemplatePath(__dirname: string, filename: string): string {
  const candidates = [
    join(__dirname, 'templates', filename), // 适配打包后的 dist 目录
    join(__dirname, '../templates', filename), // 适配开发态 src/core -> src/templates
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  // 回退：直接返回第一个候选，交由 readFile 报错便于定位
  return candidates[0]
}

export async function generateEslintConfigString({
  language,
  framework,
  style,
  moduleType,
}: GenerateConfigOptions): Promise<string> {
  // 读取模板文件
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const templatePath = resolveTemplatePath(__dirname, 'eslint.config.tpl.txt')
  const template = await readFile(templatePath, 'utf-8')

  // 计算需要启用的配置块（可以同时启用多个）
  const desiredConditions = new Set<string>()

  // 基础语言配置
  if (language === 'ts') {
    desiredConditions.add('ts')
  } else {
    desiredConditions.add('js')
  }

  // 框架配置
  if (framework === 'react') {
    if (language === 'ts') desiredConditions.add('tsx')
    else desiredConditions.add('jsx')
  } else if (framework === 'vue') {
    desiredConditions.add('vue')
  }
  // 其他框架（svelte/solid）暂不提供专用配置，使用基础 js/ts 配置即可

  // 简单的模板渲染（替换条件块，可保留多个）
  let result = template

  const conditions = ['js', 'ts', 'jsx', 'tsx', 'vue']
  for (const condition of conditions) {
    const keepRegex = new RegExp(`\\{\\{#if\\s+${condition}\\}\\}([\\s\\S]*?)\\{\\{\\/if\\}\\}`, 'g')
    const removeRegex = new RegExp(`\\{\\{#if\\s+${condition}\\}\\}[\\s\\S]*?\\{\\{\\/if\\}\\}`, 'g')

    if (desiredConditions.has(condition)) {
      // 保留块内容，移除包裹标签（重复替换直到无匹配）
      while (keepRegex.test(result)) {
        result = result.replace(keepRegex, '$1')
      }
    } else {
      // 移除整块（重复替换直到无匹配）
      while (removeRegex.test(result)) {
        result = result.replace(removeRegex, '')
      }
    }
  }

  // 兜底清理：移除任何残余的 Handlebars if 标签
  result = result.replace(/\{\{#if\s+\w+\}\}/g, '').replace(/\{\{\/if\}\}/g, '')

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
      // 将 `import X from 'eslint-config-lavy/<name>'` 转换为 `const X = require('eslint-config-lavy/<name>')`
      .replace(
        /import\s+([a-zA-Z_$][\w$]*)\s+from\s+'eslint-config-lavy\/([^']+)'/g,
        "const $1 = require('eslint-config-lavy/$2')",
      )
      // 支持具名导入并转换别名 `as` 为解构重命名 `:`
      .replace(
        /import\s*\{([^}]*)\}\s*from\s*'eslint-config-lavy\/([^']+)'/g,
        (match, group1, name) => {
          const mapped = String(group1).replace(/\s+as\s+/g, ': ')
          return `const {${mapped}} = require('eslint-config-lavy/${name}')`
        }
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
  const templatePath = resolveTemplatePath(__dirname, 'prettier.config.tpl.txt')
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
  const templatePath = resolveTemplatePath(__dirname, 'stylelint.config.tpl.txt')
  const template = await readFile(templatePath, 'utf-8')

  // 如果是 CJS 格式，需要转换 export default 语法
  if (moduleType === 'commonjs') {
    return template.replace(/export default /g, 'module.exports = ')
  }

  return template
}
