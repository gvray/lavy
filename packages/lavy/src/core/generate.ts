import { writeFile } from 'node:fs/promises'
import {
  getPackageJsonType,
  generateEslintConfigString,
  generatePrettierConfigString,
  generateStylelintConfigString,
} from './utils.js'
import type { Language, Framework, Style } from '../types'
import { existsSync } from 'node:fs'

interface ConfigOptions {
  language: Language
  framework: Framework
  style: Style
  mode?: 'force' | 'merge'
}

export async function generateTemplate(options: ConfigOptions) {
  const { language, framework, style, mode = 'force' } = options

  // 获取 package.json 类型
  const packageJsonType = getPackageJsonType()
  const moduleType = packageJsonType === 'module' ? 'esm' : 'cjs'

  const shouldWrite = (file: string) => mode === 'force' || !existsSync(file)

  // 写入 ESLint 配置（根据语言和框架组合生成，可能包含多个配置块）
  if (shouldWrite('eslint.config.js')) {
    await writeFile(
      'eslint.config.js',
      await generateEslintConfigString({
        language,
        framework,
        style,
        moduleType,
      }),
    )
  } else {
    // console.log('ℹ️  检测到已有 eslint.config.js，合并模式下保留旧文件。')
  }

  // 写入 Prettier 配置（始终适用）
  if (shouldWrite('prettier.config.js')) {
    await writeFile(
      'prettier.config.js',
      await generatePrettierConfigString({}, packageJsonType),
    )
  } else {
    // console.log('ℹ️  检测到已有 prettier.config.js，合并模式下保留旧文件。')
  }

  // 写入 Stylelint 配置（style 为 none 时跳过）
  if (style !== 'none') {
    if (shouldWrite('stylelint.config.js')) {
      await writeFile(
        'stylelint.config.js',
        await generateStylelintConfigString({}, packageJsonType),
      )
    } else {
      // console.log('ℹ️  检测到已有 stylelint.config.js，合并模式下保留旧文件。')
    }
  } else {
    // console.log('ℹ️  检测到样式选择为 none，跳过生成 Stylelint 配置。')
  }
}
