#!/usr/bin/env node

import { commitValidator } from '../utils/commit-validator.js'

// 测试用例
const testCases = [
  'feat: 添加新功能',
  'fix(login): 修复登录问题',
  'docs: 更新文档',
  'style: 格式化代码',
  'refactor: 重构代码',
  'perf: 性能优化',
  'test: 添加测试',
  'build: 构建配置',
  'ci: CI/CD 配置',
  'chore: 其他改动',
  'revert: 回滚提交',
  'Merge branch main',
  'update something', // 错误的格式
  'Feat: 大写开头', // 错误的格式
  'feat: 这是一个非常长的提交信息描述，超过了50个字符的限制', // 错误的格式
  'feat: 以句号结尾.', // 错误的格式
  '', // 空提交信息
]

console.log('🧪 开始测试提交信息验证功能...\n')

for (const testCase of testCases) {
  console.log(`测试: "${testCase}"`)
  const result = commitValidator.validate(testCase)

  if (result.isValid) {
    console.log('✅ 通过')
  } else {
    console.log('❌ 失败')
    for (const error of result.errors) {
      console.log(`   错误: ${error}`)
    }
  }

  if (result.warnings.length > 0) {
    for (const warning of result.warnings) {
      console.log(`   ⚠️  警告: ${warning}`)
    }
  }

  console.log('')
}

console.log('📋 提交类型说明：')
console.log(commitValidator.getTypeDescription())
