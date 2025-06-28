#!/usr/bin/env node

import { getCommitConfig, createDefaultConfig } from '../utils/config-loader.js'
import { writeFileSync, existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

async function testConfigLoading() {
  console.log('🧪 测试配置加载功能...\n')

  // 测试 1: 无配置文件时的默认配置
  console.log('1. 测试无配置文件时的默认配置:')
  try {
    const defaultConfig = await getCommitConfig()
    console.log('✅ 默认配置加载成功')
    console.log(
      `   允许的提交类型: ${defaultConfig.types?.join(', ') || '默认类型'}`,
    )
    console.log(`   最大长度限制: ${defaultConfig.maxLength || 72}`)
    console.log(`   自定义规则数量: ${defaultConfig.rules?.length || 0}`)
  } catch (error) {
    console.log('❌ 默认配置加载失败:', error)
  }

  // 测试 2: 创建并加载配置文件
  console.log('\n2. 测试创建并加载配置文件:')
  const configPath = join(process.cwd(), 'test-lavy.config.js')

  try {
    // 创建测试配置文件
    const testConfig = `import { defineConfig } from 'lavy'

export default defineConfig({
  commit: {
    rules: [
      {
        pattern: /^[a-z]+: .*[^!]$/,
        message: '测试规则：不能以感叹号结尾',
        examples: ['feat: 新功能', 'fix: 修复问题']
      }
    ],
    types: ['feat', 'fix', 'docs', 'test'],
    maxLength: 100,
    allowMergeCommits: false
  }
})`

    writeFileSync(configPath, testConfig, 'utf-8')
    console.log('✅ 测试配置文件创建成功')

    // 加载配置文件
    const config = await getCommitConfig(process.cwd())
    console.log('✅ 配置文件加载成功')
    console.log(`   允许的提交类型: ${config.types?.join(', ') || '默认类型'}`)
    console.log(`   最大长度限制: ${config.maxLength || 72}`)
    console.log(
      `   允许合并提交: ${config.allowMergeCommits !== false ? '是' : '否'}`,
    )
    console.log(`   自定义规则数量: ${config.rules?.length || 0}`)

    // 清理测试文件
    unlinkSync(configPath)
    console.log('✅ 测试配置文件清理完成')
  } catch (error) {
    console.log('❌ 配置文件测试失败:', error)
    // 尝试清理测试文件
    if (existsSync(configPath)) {
      try {
        unlinkSync(configPath)
      } catch (e) {
        // 忽略清理错误
      }
    }
  }

  // 测试 3: 生成默认配置模板
  console.log('\n3. 测试生成默认配置模板:')
  try {
    const defaultConfigTemplate = createDefaultConfig()
    console.log('✅ 默认配置模板生成成功')
    console.log('   模板内容预览:')
    console.log(
      `${defaultConfigTemplate.split('\n').slice(0, 5).join('\n')}...`,
    )
  } catch (error) {
    console.log('❌ 默认配置模板生成失败:', error)
  }

  console.log('\n🎉 配置加载功能测试完成！')
}

testConfigLoading().catch((error) => {
  console.error('❌ 测试过程中出现错误:', error)
  process.exit(1)
})
