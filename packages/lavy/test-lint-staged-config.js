#!/usr/bin/env node

import { writeFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

// 模拟 generateLintStagedConfig 函数
function generateLintStagedConfig({ language, framework, style }) {
  const config = {}

  // 根据语言配置
  if (language === 'ts' || language === 'typescript') {
    // TypeScript 项目
    config['*.{ts,tsx}'] = ['eslint --fix', 'prettier --write']
    config['*.{js,jsx}'] = ['eslint --fix', 'prettier --write']
  } else if (language === 'js' || language === 'javascript') {
    // JavaScript 项目
    config['*.{js,jsx}'] = ['eslint --fix', 'prettier --write']
  }

  // 根据框架配置
  if (framework === 'vue') {
    config['*.vue'] = ['eslint --fix', 'prettier --write']
  } else if (framework === 'react') {
    config['*.{jsx,tsx}'] = ['eslint --fix', 'prettier --write']
  } else if (framework === 'svelte') {
    config['*.svelte'] = ['eslint --fix', 'prettier --write']
  } else if (framework === 'solid') {
    config['*.{jsx,tsx}'] = ['eslint --fix', 'prettier --write']
  }

  // 根据样式配置
  if (style === 'css') {
    config['*.css'] = ['stylelint --fix', 'prettier --write']
  } else if (style === 'scss' || style === 'sass') {
    config['*.{scss,sass}'] = ['stylelint --fix', 'prettier --write']
  } else if (style === 'less') {
    config['*.less'] = ['stylelint --fix', 'prettier --write']
  } else if (style === 'stylus') {
    config['*.styl'] = ['stylelint --fix', 'prettier --write']
  } else if (style === 'tailwind') {
    config['*.{css,scss,less}'] = ['stylelint --fix', 'prettier --write']
  }

  // 通用配置（总是添加）
  config['*.{json,md,yml,yaml}'] = ['prettier --write']

  // 如果没有语言配置，使用默认配置
  if (
    !language ||
    (language !== 'ts' &&
      language !== 'typescript' &&
      language !== 'js' &&
      language !== 'javascript')
  ) {
    config['*.{js,jsx,ts,tsx}'] = ['eslint --fix', 'prettier --write']
  }

  // 如果没有样式配置，使用默认样式配置
  if (
    !style ||
    (style !== 'css' &&
      style !== 'scss' &&
      style !== 'sass' &&
      style !== 'less' &&
      style !== 'stylus' &&
      style !== 'tailwind')
  ) {
    config['*.{css,scss,less}'] = ['stylelint --fix', 'prettier --write']
  }

  return config
}

async function testLintStagedConfig() {
  console.log('🧪 测试 lint-staged 按需配置功能...\n')

  const testCases = [
    {
      name: 'TypeScript + React + SCSS',
      config: { language: 'ts', framework: 'react', style: 'scss' },
      expected: [
        '*.{ts,tsx}',
        '*.{js,jsx}',
        '*.{jsx,tsx}',
        '*.{scss,sass}',
        '*.{json,md,yml,yaml}',
      ],
    },
    {
      name: 'JavaScript + Vue + CSS',
      config: { language: 'js', framework: 'vue', style: 'css' },
      expected: ['*.{js,jsx}', '*.vue', '*.css', '*.{json,md,yml,yaml}'],
    },
    {
      name: 'TypeScript + Svelte + Tailwind',
      config: { language: 'ts', framework: 'svelte', style: 'tailwind' },
      expected: [
        '*.{ts,tsx}',
        '*.{js,jsx}',
        '*.svelte',
        '*.{css,scss,less}',
        '*.{json,md,yml,yaml}',
      ],
    },
    {
      name: 'JavaScript + None + Less',
      config: { language: 'js', framework: 'none', style: 'less' },
      expected: ['*.{js,jsx}', '*.less', '*.{json,md,yml,yaml}'],
    },
    {
      name: '默认配置',
      config: {},
      expected: [
        '*.{js,jsx,ts,tsx}',
        '*.{css,scss,less}',
        '*.{json,md,yml,yaml}',
      ],
    },
  ]

  for (const testCase of testCases) {
    console.log(`📝 测试: ${testCase.name}`)
    console.log(`🔧 配置: ${JSON.stringify(testCase.config)}`)

    const result = generateLintStagedConfig(testCase.config)
    const resultKeys = Object.keys(result)

    console.log('📋 生成的配置:')
    for (const [pattern, commands] of Object.entries(result)) {
      console.log(`  ${pattern}: ${commands.join(', ')}`)
    }

    // 检查是否包含预期的文件模式
    const missingPatterns = testCase.expected.filter(
      (pattern) => !resultKeys.includes(pattern),
    )
    const extraPatterns = resultKeys.filter(
      (pattern) => !testCase.expected.includes(pattern),
    )

    if (missingPatterns.length === 0 && extraPatterns.length === 0) {
      console.log('✅ 配置完全匹配预期')
    } else {
      console.log('⚠️  配置与预期有差异:')
      if (missingPatterns.length > 0) {
        console.log(`   缺少: ${missingPatterns.join(', ')}`)
      }
      if (extraPatterns.length > 0) {
        console.log(`   多余: ${extraPatterns.join(', ')}`)
      }
    }

    console.log('─'.repeat(60))
  }

  console.log('\n🎉 测试完成！')
}

testLintStagedConfig().catch(console.error)
