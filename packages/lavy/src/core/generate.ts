import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export async function generateTemplate({ language, framework, style }: any) {
  const eslintTemplatePath = resolve(new URL(import.meta.url).pathname, '../templates/eslint.config.tpl.js')
  const prettierTemplatePath = resolve(new URL(import.meta.url).pathname, '../templates/prettier.config.tpl.js')
  const stylelintTemplatePath = resolve(new URL(import.meta.url).pathname, '../templates/stylelint.config.tpl.js')
  const eslintTemplateRaw = await readFile(eslintTemplatePath, 'utf-8')
  const prettierTemplateRaw = await readFile(prettierTemplatePath, 'utf-8')
  const eslintConfig = eslintTemplateRaw
    .replace('__PARSER__', language === 'ts' ? "require('@typescript-eslint/parser')" : 'undefined')
    .replace('__PLUGINS__', [
      ...(language === 'ts' ? ['@typescript-eslint'] : []),
      ...(framework === 'react' ? ['react'] : []),
      ...(framework === 'vue' ? ['vue'] : [])
    ].map(p => `${p}: require('${p}')`).join(',\n      '))
    .replace('__RULES__', JSON.stringify(
      framework === 'react'
        ? { 'react/react-in-jsx-scope': 'off' }
        : {},
      null,
      2
    ))
    if (style !== 'none') {
        let stylelintConfig = await readFile(stylelintTemplatePath, 'utf-8')
        if (style === 'scss') {
          stylelintConfig += `\nmodule.exports.plugins = ['stylelint-scss']\nmodule.exports.rules['scss/at-rule-no-unknown'] = true`
        }
        if (style === 'less') {
          stylelintConfig += `\nmodule.exports.plugins = ['stylelint-less']\nmodule.exports.rules['less/no-duplicate-variables'] = true`
        }
        await writeFile('stylelint.config.js', stylelintConfig)
      }

  await writeFile('eslint.config.js', eslintConfig)
  await writeFile('prettier.config.js', prettierTemplateRaw)
}
