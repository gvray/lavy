#!/usr/bin/env node

import { writeFileSync, unlinkSync } from 'node:fs'
import { execa } from 'execa'

async function testEditOption() {
  console.log('🧪 测试 --edit 选项功能...\n')

  const testCases = [
    {
      message: 'feat: 添加新功能',
      expected: 'pass',
      description: '有效的提交信息',
    },
    {
      message: 'invalid commit message',
      expected: 'fail',
      description: '无效的提交信息',
    },
    {
      message: 'fix: 修复问题',
      expected: 'pass',
      description: '有效的修复提交',
    },
  ]

  for (const testCase of testCases) {
    console.log(`📝 测试: ${testCase.description}`)
    console.log(`📄 提交信息: ${testCase.message}`)

    // 创建临时提交信息文件
    const tempFile = `temp-commit-${Date.now()}.txt`
    writeFileSync(tempFile, testCase.message, 'utf-8')

    try {
      // 运行 lavy commit --edit
      const result = await execa(
        'node',
        ['dist/index.mjs', 'commit', '--edit', tempFile],
        {
          stdio: 'pipe',
        },
      )

      if (testCase.expected === 'pass') {
        console.log('✅ 测试通过：验证成功')
      } else {
        console.log('❌ 测试失败：应该失败但通过了')
      }
    } catch (error) {
      if (testCase.expected === 'fail') {
        console.log('✅ 测试通过：验证失败（符合预期）')
      } else {
        console.log('❌ 测试失败：应该通过但失败了')
        console.log(`   错误: ${error.stderr}`)
      }
    } finally {
      // 清理临时文件
      try {
        unlinkSync(tempFile)
      } catch (e) {
        // 忽略清理错误
      }
    }

    console.log('─'.repeat(50))
  }

  console.log('\n🎉 测试完成！')
}

testEditOption().catch(console.error)
