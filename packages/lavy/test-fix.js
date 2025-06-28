#!/usr/bin/env node

import { execa } from 'execa'
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

async function testFix() {
  console.log('🧪 测试修复...\n')

  // 1. 检查 husky 钩子内容
  const preCommitPath = '.husky/pre-commit'
  const commitMsgPath = '.husky/commit-msg'

  if (existsSync(preCommitPath)) {
    const preCommitContent = readFileSync(preCommitPath, 'utf-8')
    console.log('📝 pre-commit 钩子内容:')
    console.log(preCommitContent)
    console.log()

    // 检查是否包含已弃用的头部
    if (
      preCommitContent.includes('#!/usr/bin/env sh') ||
      preCommitContent.includes('husky.sh')
    ) {
      console.log('❌ 仍然包含已弃用的 husky 头部行')
    } else {
      console.log('✅ pre-commit 钩子已修复')
    }
  }

  if (existsSync(commitMsgPath)) {
    const commitMsgContent = readFileSync(commitMsgPath, 'utf-8')
    console.log('📝 commit-msg 钩子内容:')
    console.log(commitMsgContent)
    console.log()

    // 检查是否包含已弃用的头部
    if (
      commitMsgContent.includes('#!/usr/bin/env sh') ||
      commitMsgContent.includes('husky.sh')
    ) {
      console.log('❌ 仍然包含已弃用的 husky 头部行')
    } else {
      console.log('✅ commit-msg 钩子已修复')
    }
  }

  // 2. 检查 package.json 中的 lint-staged 配置
  if (existsSync('package.json')) {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

    if (packageJson['lint-staged']) {
      console.log('✅ package.json 包含 lint-staged 配置:')
      console.log(JSON.stringify(packageJson['lint-staged'], null, 2))
    } else {
      console.log('❌ package.json 中缺少 lint-staged 配置')
    }
  }

  // 3. 检查是否还有旧的 lint-staged.config.js
  if (existsSync('lint-staged.config.js')) {
    console.log('❌ 仍然存在 lint-staged.config.js 文件')
  } else {
    console.log('✅ 没有 lint-staged.config.js 文件')
  }

  console.log('\n🔧 建议的修复步骤:')
  console.log('1. 删除现有的 .husky 目录')
  console.log('2. 重新运行 lavy init 并选择 useCommitLint')
  console.log('3. 或者手动修复钩子文件')
}

testFix().catch(console.error)
