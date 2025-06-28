#!/usr/bin/env node

import { commitValidator, CommitValidator } from '../utils/commit-validator.js'

console.log('🚀 Git 提交信息验证器使用示例\n')

// 示例 1: 使用默认验证器
console.log('1. 使用默认验证器验证提交信息：')
const testMessages = [
  'feat: 添加用户登录功能',
  'fix(api): 修复数据获取问题',
  'docs: 更新 README 文档',
  'invalid commit message',
  'Feat: 大写开头错误',
  'feat: 这是一个非常长的提交信息，超过了字符限制',
]

for (const message of testMessages) {
  console.log(`\n验证: "${message}"`)
  const result = commitValidator.validate(message)

  if (result.isValid) {
    console.log('✅ 验证通过')
  } else {
    console.log('❌ 验证失败')
    for (const error of result.errors) {
      console.log(`   错误: ${error}`)
    }
  }
}

// 示例 2: 创建自定义验证器
console.log('\n\n2. 创建自定义验证器：')
const customValidator = new CommitValidator()

// 添加自定义规则
customValidator.addRule({
  pattern: /^[a-z]+: .*[^!]$/, // 不允许以感叹号结尾
  message: '提交信息不能以感叹号结尾',
  examples: ['feat: 新功能', 'fix: 修复问题'],
})

const customTestMessage = 'feat: 新功能!'
console.log(`\n验证自定义规则: "${customTestMessage}"`)
const customResult = customValidator.validate(customTestMessage)

if (customResult.isValid) {
  console.log('✅ 验证通过')
} else {
  console.log('❌ 验证失败')
  for (const error of customResult.errors) {
    console.log(`   错误: ${error}`)
  }
}

// 示例 3: 格式化提交信息
console.log('\n\n3. 格式化提交信息：')
const formattedMessage = commitValidator.formatCommitMessage(
  'feat',
  '添加新功能',
  'auth',
)
console.log(`格式化结果: "${formattedMessage}"`)

// 示例 4: 获取类型说明
console.log('\n\n4. 提交类型说明：')
console.log(commitValidator.getTypeDescription())
