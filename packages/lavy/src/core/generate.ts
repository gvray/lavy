import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import {
  generateEslintConfigString,
  generatePrettierConfigString,
  generateStylelintConfigString,
  generateTsConfigString,
  getPackageJsonType,
  generateBiomeConfigString,
} from './utils'
import type {
  GenerateConfigOptions,
  Language,
  Framework,
  Style,
} from '../types'

export async function generateConfigs(options: GenerateConfigOptions) {
  const { language, framework, style, moduleType } = options

  const pkgModuleType = getPackageJsonType()
  const ext = pkgModuleType === 'module' ? 'js' : 'mjs'

  // 生成 ESLint 配置（始终使用 ESM 语法，按包类型选择后缀）
  const eslintConfigContent = await generateEslintConfigString(options)
  const eslintConfigFilename = 'eslint.config.js'
  await fs.writeFile(
    resolve(process.cwd(), eslintConfigFilename),
    eslintConfigContent,
    'utf-8',
  )

  // 生成 Prettier 配置（始终使用 ESM 语法，按包类型选择后缀）
  const prettierContent = await generatePrettierConfigString({}, pkgModuleType)
  const prettierFilename = `prettier.config.${ext}`
  await fs.writeFile(
    resolve(process.cwd(), prettierFilename),
    prettierContent,
    'utf-8',
  )

  // 生成 Stylelint 配置（style 为 none 时跳过；始终使用 ESM 语法，按包类型选择后缀）
  if (style !== 'none') {
    const stylelintContent = await generateStylelintConfigString(
      {},
      pkgModuleType,
      { framework },
    )
    const stylelintFilename = `stylelint.config.${ext}`
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
  linter?: 'eslint' | 'biome'
}) {
  const packageJsonType = getPackageJsonType()
  const moduleType = packageJsonType === 'module' ? 'esm' : 'cjs'
  const ext = packageJsonType === 'module' ? 'js' : 'mjs'
  const { language, framework, style, mode = 'force', linter = 'eslint' } = options

  // eslint.config 不用跟随 ext，始终使用 .js，eslint 原生支持
  const eslintConfigFilename = 'eslint.config.js'
  const prettierConfigFilename = `prettier.config.${ext}`
  const stylelintConfigFilename = `stylelint.config.${ext}`
  const biomeFilename = 'biome.json'

  const shouldWrite = (file: string) =>
    mode === 'force' || !existsSync(resolve(process.cwd(), file))

  const useBiome = linter === 'biome'

  // ESLint（当未使用 Biome 时生成）
  if (!useBiome && shouldWrite(eslintConfigFilename)) {
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

  // Prettier（当未使用 Biome 时生成）
  if (!useBiome && shouldWrite(prettierConfigFilename)) {
    const content = await generatePrettierConfigString({}, packageJsonType)
    await fs.writeFile(
      resolve(process.cwd(), prettierConfigFilename),
      content,
      'utf-8',
    )
  }

  // Biome（当选择使用 Biome 时生成默认配置）
  if (useBiome && shouldWrite(biomeFilename)) {
    const biomeContent = await generateBiomeConfigString()
    await fs.writeFile(resolve(process.cwd(), biomeFilename), biomeContent, 'utf-8')
  }

  // Stylelint（style 为 none 时跳过）
  if (style !== 'none' && shouldWrite(stylelintConfigFilename)) {
    const content = await generateStylelintConfigString({}, packageJsonType, { framework })
    await fs.writeFile(
      resolve(process.cwd(), stylelintConfigFilename),
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
