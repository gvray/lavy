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
  const templatePath = resolveTemplatePath(__dirname, 'eslint.config.tpl.hbs')
  const templateSource = await readFile(templatePath, 'utf-8')

  // 计算上下文
  const ctx = {
    js: language !== 'ts',
    ts: language === 'ts',
    jsx: framework === 'react' && language !== 'ts',
    tsx: framework === 'react' && language === 'ts',
    vue: framework === 'vue',
    style,
    esm: moduleType === 'esm',
    cjs: moduleType === 'cjs',
  }

  // 动态引入 Handlebars 并渲染
  const { default: Handlebars } = await import('handlebars')
  const compile = Handlebars.compile(templateSource)
  const result = compile(ctx)

  // 如果是 CJS 格式，需要转换 import/export 语法

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
  const templatePath = resolveTemplatePath(
    __dirname,
    'stylelint.config.tpl.txt',
  )
  const template = await readFile(templatePath, 'utf-8')

  // 如果是 CJS 格式，需要转换 export default 语法
  if (moduleType === 'commonjs') {
    return template.replace(/export default /g, 'module.exports = ')
  }

  return template
}
