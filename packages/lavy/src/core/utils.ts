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

export async function generateEslintConfigString(
  baseConfig: any,
  frameworkConfig: any,
  typescriptConfig: any,
  moduleType: 'esm' | 'cjs',
): Promise<string> {
  // 读取模板文件
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const templatePath = join(__dirname, './templates/eslint.config.tpl.txt')
  const template = await readFile(templatePath, 'utf-8')

  // 准备模板数据
  const templateData = {
    typescript: !!typescriptConfig,
    react: frameworkConfig?.framework === 'react',
    vue: frameworkConfig?.framework === 'vue',
  }

  // 简单的模板渲染（替换条件块）
  let result = template

  // 处理 {{#if typescript}} 块
  if (templateData.typescript) {
    result = result.replace(
      /\{\{#if typescript\}\}([\s\S]*?)\{\{\/if\}\}/g,
      '$1',
    )
  } else {
    result = result.replace(/\{\{#if typescript\}\}[\s\S]*?\{\{\/if\}\}/g, '')
  }

  // 处理 {{#if react}} 块
  if (templateData.react) {
    result = result.replace(/\{\{#if react\}\}([\s\S]*?)\{\{\/if\}\}/g, '$1')
  } else {
    result = result.replace(/\{\{#if react\}\}[\s\S]*?\{\{\/if\}\}/g, '')
  }

  // 处理 {{#if vue}} 块
  if (templateData.vue) {
    result = result.replace(/\{\{#if vue\}\}([\s\S]*?)\{\{\/if\}\}/g, '$1')
  } else {
    result = result.replace(/\{\{#if vue\}\}[\s\S]*?\{\{\/if\}\}/g, '')
  }

  // 如果是 CJS 格式，需要转换 import/export 语法
  if (moduleType === 'cjs') {
    result = result
      .replace(
        /import \{ defineConfig \} from 'eslint\/config'/g,
        "const { defineConfig } = require('eslint/config')",
      )
      .replace(
        /import js from '@eslint\/js'/g,
        "const js = require('@eslint/js')",
      )
      .replace(
        /import ts from '@typescript-eslint\/eslint-plugin'/g,
        "const ts = require('@typescript-eslint/eslint-plugin')",
      )
      .replace(
        /import tsParser from '@typescript-eslint\/parser'/g,
        "const tsParser = require('@typescript-eslint/parser')",
      )
      .replace(
        /import react from 'eslint-plugin-react'/g,
        "const react = require('eslint-plugin-react')",
      )
      .replace(
        /import reactHooks from 'eslint-plugin-react-hooks'/g,
        "const reactHooks = require('eslint-plugin-react-hooks')",
      )
      .replace(
        /import vue from 'eslint-plugin-vue'/g,
        "const vue = require('eslint-plugin-vue')",
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
