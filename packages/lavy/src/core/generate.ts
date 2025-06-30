import { writeFile } from 'node:fs/promises'
import {
  getPackageJsonType,
  generateEslintConfigString,
  generatePrettierConfigString,
  generateStylelintConfigString,
} from './utils.js'

interface ConfigOptions {
  language: 'js' | 'ts'
  framework: 'none' | 'react' | 'vue' | 'svelte' | 'solid'
  style: 'none' | 'css' | 'scss' | 'sass' | 'less' | 'stylus'
}

export async function generateTemplate(options: ConfigOptions) {
  const { language, framework, style } = options

  // 获取 package.json 类型
  const packageJsonType = getPackageJsonType()
  const moduleType = packageJsonType === 'module' ? 'esm' : 'cjs'

  // 写入配置文件
  await writeFile(
    'eslint.config.js',
    await generateEslintConfigString(
      { language },
      { framework },
      language === 'ts' ? {} : null,
      moduleType,
    ),
  )
  await writeFile(
    'prettier.config.js',
    await generatePrettierConfigString({}, packageJsonType),
  )

  if (style !== 'none') {
    await writeFile(
      'stylelint.config.js',
      await generateStylelintConfigString({}, packageJsonType),
    )
  }
}
