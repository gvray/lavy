import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import {
  generateEslintConfigString,
  generatePrettierConfigString,
  generateStylelintConfigString,
  generateTsConfigBaseString,
  generateTsConfigString,
  getPackageJsonType,
} from './utils'
import type {
  GenerateConfigOptions,
  Language,
  Framework,
  Style,
} from '../types'

export async function generateConfigs(options: GenerateConfigOptions) {
  const { language, framework, style, moduleType } = options

  // 生成 ESLint 配置
  const eslintConfigContent = await generateEslintConfigString(options)
  const eslintConfigFilename = 'eslint.config.js'
  await fs.writeFile(
    resolve(process.cwd(), eslintConfigFilename),
    eslintConfigContent,
    'utf-8',
  )

  // 生成 Prettier 配置
  const pkgModuleType = getPackageJsonType()
  const prettierContent = await generatePrettierConfigString({}, pkgModuleType)
  const prettierFilename = 'prettier.config.js'
  await fs.writeFile(
    resolve(process.cwd(), prettierFilename),
    prettierContent,
    'utf-8',
  )

  // 生成 Stylelint 配置（style 为 none 时跳过）
  if (style !== 'none') {
    const stylelintContent = await generateStylelintConfigString(
      {},
      pkgModuleType,
    )
    const stylelintFilename = 'stylelint.config.js'
    await fs.writeFile(
      resolve(process.cwd(), stylelintFilename),
      stylelintContent,
      'utf-8',
    )
  }

  // 生成 TypeScript 配置（仅在 TS 项目时）
  if (language === 'ts') {
    const tsMain = await generateTsConfigString(framework, moduleType)
    await fs.writeFile(resolve(process.cwd(), 'tsconfig.json'), tsMain, 'utf-8')
  }

  // 可选：根据 style 写入 .prettierrc/.stylelintrc 等（未来扩展）
}

// 兼容旧的 API：generateTemplate
export async function generateTemplate(options: {
  language: Language
  framework: Framework
  style: Style
  mode?: 'force' | 'merge'
}) {
  const packageJsonType = getPackageJsonType()
  const moduleType = packageJsonType === 'module' ? 'esm' : 'cjs'
  const { language, framework, style, mode = 'force' } = options

  const eslintConfigFilename = 'eslint.config.js'
  const prettierFilename = 'prettier.config.js'
  const stylelintFilename = 'stylelint.config.js'

  const shouldWrite = (file: string) =>
    mode === 'force' || !existsSync(resolve(process.cwd(), file))

  // ESLint
  if (shouldWrite(eslintConfigFilename)) {
    const content = await generateEslintConfigString({
      language,
      framework,
      style,
      moduleType,
    })
    await fs.writeFile(
      resolve(process.cwd(), eslintConfigFilename),
      content,
      'utf-8',
    )
  }

  // Prettier
  if (shouldWrite(prettierFilename)) {
    const content = await generatePrettierConfigString({}, packageJsonType)
    await fs.writeFile(
      resolve(process.cwd(), prettierFilename),
      content,
      'utf-8',
    )
  }

  // Stylelint（style 为 none 时跳过）
  if (style !== 'none' && shouldWrite(stylelintFilename)) {
    const content = await generateStylelintConfigString({}, packageJsonType)
    await fs.writeFile(
      resolve(process.cwd(), stylelintFilename),
      content,
      'utf-8',
    )
  }

  // TS 配置（仅在 TS 项目时）
  if (language === 'ts') {
    if (shouldWrite('tsconfig.json')) {
      const tsMain = await generateTsConfigString(framework, moduleType)
      await fs.writeFile(
        resolve(process.cwd(), 'tsconfig.json'),
        tsMain,
        'utf-8',
      )
    }
  }
}
