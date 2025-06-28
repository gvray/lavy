import { CommitValidator } from '../utils/commit-validator'
import {
  getCommitConfig,
  createDefaultConfig,
  createCommitConfig,
} from '../utils/config-loader'
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import { execa } from 'execa'
import ora from 'ora'
import { DEFAULT_COMMIT_CONFIG, DEFAULT_COMMIT_TYPES } from '../config/index.js'

interface CommitCommandOptions {
  message?: string
  test?: boolean
  init?: boolean
  config?: boolean
  edit?: boolean
}

export async function runCommitCommand(options: CommitCommandOptions) {
  const { message, test, init, config, edit } = options
  const msg = String(message)

  // 初始化配置文件
  if (init) {
    await initConfig()
    return
  }

  // 显示配置信息
  if (config) {
    await showConfig()
    return
  }

  // 测试模式
  if (test) {
    await runTests()
    return
  }

  // 编辑模式：从文件读取提交信息（用于 Git hooks）
  if (edit) {
    await validateCommitFile()
    return
  }

  // 验证指定消息
  if (msg) {
    await validateMessage(msg)
    return
  }

  // 默认：验证当前 git 提交信息
  await validateCurrentCommit()
}

async function initConfig() {
  const configPath = join(process.cwd(), 'lavy.config.js')

  if (existsSync(configPath)) {
    // 如果配置文件存在，追加 commit 配置
    const spinner = ora('正在追加 commit 配置...').start()

    try {
      const existingContent = readFileSync(configPath, 'utf-8')

      // 检查是否已经包含 commit 配置
      if (existingContent.includes('commit:')) {
        spinner.succeed('配置文件已包含 commit 配置！')
        console.log(`📁 配置文件位置: ${configPath}`)
        return
      }

      // 创建 commit 配置内容
      const commitConfigContent = `  commit: {
    // 自定义验证规则
    rules: [
      // 示例：不允许以感叹号结尾
      // {
      //   pattern: /^[a-z]+: .*[^!]$/,
      //   message: '提交信息不能以感叹号结尾',
      //   examples: ['feat: 新功能', 'fix: 修复问题']
      // }
    ],
    
    // 允许的提交类型
    types: ${JSON.stringify(DEFAULT_COMMIT_TYPES, null, 4)},
    
    // 最大长度限制
    maxLength: ${DEFAULT_COMMIT_CONFIG.maxLength},
    
    // 是否允许合并提交
    allowMergeCommits: ${DEFAULT_COMMIT_CONFIG.allowMergeCommits},
    
    // 自定义正则表达式模式
    customPatterns: [
      // 示例：/^[a-z]+: .*[^!]$/
    ]
  }`

      // 在 defineConfig 对象的最后一个属性后添加 commit 配置
      // 匹配 } 后面跟着 ) 的结构，在 } 前插入 commit 配置
      const updatedContent = existingContent.replace(
        /(\s*}\s*\)\s*;?\s*$)/,
        `,\n${commitConfigContent}\n$1`,
      )

      writeFileSync(configPath, updatedContent, 'utf-8')
      spinner.succeed('commit 配置已追加到现有配置文件！')
      console.log(`📁 配置文件位置: ${configPath}`)
    } catch (error) {
      spinner.fail('追加配置失败')
      console.error(error)
    }
  } else {
    // 如果配置文件不存在，创建新文件
    const spinner = ora('正在创建配置文件...').start()

    try {
      const configContent = createCommitConfig()
      writeFileSync(configPath, configContent, 'utf-8')
      spinner.succeed('配置文件创建成功！')
      console.log(`📁 配置文件位置: ${configPath}`)
      console.log('💡 请根据项目需求修改配置文件')
    } catch (error) {
      spinner.fail('配置文件创建失败')
      console.error(error)
    }
  }
}

async function showConfig() {
  const configPath = join(process.cwd(), 'lavy.config.js')

  console.log('📋 当前提交验证配置：\n')

  if (!existsSync(configPath)) {
    console.log('⚠️  未找到 lavy.config.js 配置文件')
    console.log('💡 运行 lavy commit --init 创建配置文件')
    console.log('\n📋 默认配置：')
    showDefaultConfig()
    return
  }

  try {
    // 读取配置文件
    const configContent = readFileSync(configPath, 'utf-8')

    // 检查是否包含 commit 配置
    if (!configContent.includes('commit:')) {
      console.log('⚠️  配置文件中未找到 commit 配置')
      console.log('💡 运行 lavy commit --init 添加 commit 配置')
      console.log('\n📋 默认配置：')
      showDefaultConfig()
      return
    }

    // 获取合并后的配置（这个函数会正确执行配置文件）
    const mergedConfig = await getCommitConfig()

    console.log('📁 配置文件位置:', configPath)
    console.log('✅ 已找到 commit 配置\n')

    // 显示详细配置
    showDetailedConfig(mergedConfig)
  } catch (error) {
    console.error('❌ 配置文件加载失败:', error)
    console.log('\n📋 默认配置：')
    showDefaultConfig()
  }
}

function showDefaultConfig() {
  console.log(`允许的提交类型: ${DEFAULT_COMMIT_TYPES.join(', ')}`)
  console.log(`最大长度限制: ${DEFAULT_COMMIT_CONFIG.maxLength} 个字符`)
  console.log(
    `允许合并提交: ${DEFAULT_COMMIT_CONFIG.allowMergeCommits ? '是' : '否'}`,
  )
  console.log(`自定义规则数量: ${DEFAULT_COMMIT_CONFIG.rules?.length || 0}`)
  console.log(
    `自定义模式数量: ${DEFAULT_COMMIT_CONFIG.customPatterns?.length || 0}`,
  )
}

function showDetailedConfig(config: any) {
  console.log('🔧 配置详情：')
  console.log('─'.repeat(50))

  // 提交类型
  console.log('📝 允许的提交类型:')
  if (config.types && config.types.length > 0) {
    config.types.forEach((type: string, index: number) => {
      console.log(`  ${index + 1}. ${type}`)
    })
  } else {
    console.log('  使用默认类型')
  }

  console.log()

  // 长度限制
  console.log('📏 长度限制:')
  console.log(
    `  最大长度: ${config.maxLength || DEFAULT_COMMIT_CONFIG.maxLength} 个字符`,
  )

  console.log()

  // 合并提交
  console.log('🔀 合并提交:')
  console.log(
    `  允许合并提交: ${config.allowMergeCommits !== false ? '是' : '否'}`,
  )

  console.log()

  // 自定义规则
  console.log('📋 自定义规则:')
  if (config.rules && config.rules.length > 0) {
    config.rules.forEach((rule: any, index: number) => {
      console.log(`  ${index + 1}. ${rule.message}`)
      if (rule.examples && rule.examples.length > 0) {
        console.log(`     示例: ${rule.examples.join(', ')}`)
      }
    })
  } else {
    console.log('  无自定义规则')
  }

  console.log()

  // 自定义模式
  console.log('🔍 自定义正则模式:')
  if (config.customPatterns && config.customPatterns.length > 0) {
    config.customPatterns.forEach((pattern: string, index: number) => {
      console.log(`  ${index + 1}. ${pattern}`)
    })
  } else {
    console.log('  无自定义模式')
  }

  console.log()
  console.log('─'.repeat(50))
  console.log(
    '💡 提示: 修改 lavy.config.js 文件中的 commit 配置来自定义验证规则',
  )
}

async function runTests() {
  console.log('🔍 开始诊断提交验证配置...\n')

  try {
    // 1. 检查配置文件
    const configPath = join(process.cwd(), 'lavy.config.js')
    console.log('📁 配置文件检查:')
    if (existsSync(configPath)) {
      console.log('  ✅ 找到 lavy.config.js 配置文件')
    } else {
      console.log('  ⚠️  未找到 lavy.config.js 配置文件')
      console.log('  💡 建议运行 lavy commit --init 创建配置文件')
    }
    console.log()

    // 2. 加载配置
    console.log('⚙️  配置加载检查:')
    const config = await getCommitConfig()
    console.log('  ✅ 配置加载成功')
    console.log(`  📝 提交类型数量: ${config.types?.length || 0}`)
    console.log(`  📏 最大长度限制: ${config.maxLength || 72}`)
    console.log(`  🔀 允许合并提交: ${config.allowMergeCommits ? '是' : '否'}`)
    console.log(`  📋 自定义规则数量: ${config.rules?.length || 0}`)
    console.log(`  🔍 自定义模式数量: ${config.customPatterns?.length || 0}`)
    console.log()

    // 3. 验证器功能测试
    console.log('🧪 验证器功能测试:')
    const validator = new CommitValidator(config)

    const testCases = [
      {
        message: 'feat: 添加新功能',
        expected: true,
        description: '标准功能提交',
      },
      {
        message: 'fix: 修复登录问题',
        expected: true,
        description: '标准修复提交',
      },
      {
        message: 'docs: 更新文档',
        expected: true,
        description: '文档更新提交',
      },
      {
        message: 'style: 格式化代码',
        expected: true,
        description: '代码格式提交',
      },
      {
        message: 'refactor: 重构代码',
        expected: true,
        description: '代码重构提交',
      },
      {
        message: 'perf: 性能优化',
        expected: true,
        description: '性能优化提交',
      },
      {
        message: 'test: 添加测试',
        expected: true,
        description: '测试相关提交',
      },
      {
        message: 'build: 构建配置',
        expected: true,
        description: '构建配置提交',
      },
      {
        message: 'ci: CI/CD 配置',
        expected: true,
        description: 'CI/CD 配置提交',
      },
      {
        message: 'chore: 其他改动',
        expected: true,
        description: '其他改动提交',
      },
      {
        message: 'revert: 回滚提交',
        expected: true,
        description: '回滚提交',
      },
      {
        message: 'Merge branch main',
        expected: true,
        description: '合并提交',
      },
      {
        message: 'update something',
        expected: false,
        description: '错误格式（缺少类型）',
      },
      {
        message: 'Feat: 大写开头',
        expected: false,
        description: '错误格式（大写开头）',
      },
      {
        message:
          'feat: 这是一个非常长的提交信息描述，超过了字符限制，这个描述确实太长了，应该会被拒绝，因为它超过了72个字符的限制，这是一个非常长的描述，需要更多字符',
        expected: false,
        description: '超长提交信息',
      },
      {
        message: '',
        expected: false,
        description: '空提交信息',
      },
    ]

    let passedTests = 0
    const totalTests = testCases.length

    for (const testCase of testCases) {
      const result = validator.validate(testCase.message)
      const passed = result.isValid === testCase.expected

      if (passed) {
        console.log(`  ✅ ${testCase.description}: "${testCase.message}"`)
        passedTests++
      } else {
        console.log(`  ❌ ${testCase.description}: "${testCase.message}"`)
        console.log(
          `     预期: ${testCase.expected ? '通过' : '失败'}, 实际: ${result.isValid ? '通过' : '失败'}`,
        )
        if (result.errors.length > 0) {
          console.log(`     错误: ${result.errors.join(', ')}`)
        }
      }
    }

    console.log()
    console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`)

    if (passedTests === totalTests) {
      console.log('🎉 所有测试通过！提交验证器工作正常。')
    } else {
      console.log('⚠️  部分测试失败，请检查配置或验证器逻辑。')
    }

    console.log()

    // 4. 使用说明
    console.log('📖 使用说明:')
    console.log('  • lavy commit -m "feat: 新功能"     # 验证指定提交信息')
    console.log(
      '  • lavy commit --edit <file>         # 验证提交信息文件（用于 Git hooks）',
    )
    console.log('  • lavy commit                      # 验证当前 Git 提交')
    console.log('  • lavy commit --config             # 显示当前配置')
    console.log('  • lavy commit --init               # 初始化配置文件')
    console.log()
    console.log('📋 支持的提交类型:')
    console.log(validator.getTypeDescription())
  } catch (error) {
    console.error('❌ 诊断过程中出现错误:', error)
    process.exit(1)
  }
}

async function validateMessage(message: string) {
  try {
    const config = await getCommitConfig()
    const validator = new CommitValidator(config)
    const result = validator.validate(message)

    if (result.isValid) {
      console.log('✅ 提交信息验证通过！')
      if (result.warnings.length > 0) {
        console.log('\n⚠️  警告信息：')
        for (const warning of result.warnings) {
          console.log(`  • ${warning}`)
        }
      }
    } else {
      console.log('❌ 提交信息验证失败！')
      console.log('\n错误信息：')
      for (const error of result.errors) {
        console.log(`  • ${error}`)
      }

      if (result.warnings.length > 0) {
        console.log('\n警告信息：')
        for (const warning of result.warnings) {
          console.log(`  • ${warning}`)
        }
      }

      console.log(`\n${validator.getTypeDescription()}`)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ 验证过程中出现错误:', error)
    process.exit(1)
  }
}

async function validateCurrentCommit() {
  try {
    // 获取当前提交信息
    const { stdout: commitMsg } = await execa('git', [
      'log',
      '-1',
      '--pretty=%B',
    ])

    if (!commitMsg.trim()) {
      console.log('❌ 无法获取当前提交信息')
      process.exit(1)
    }

    await validateMessage(commitMsg.trim())
  } catch (error) {
    console.error('❌ 无法获取 Git 提交信息:', error)
    console.log('💡 请确保当前目录是 Git 仓库')
    process.exit(1)
  }
}

async function validateCommitFile() {
  try {
    // 从命令行参数获取提交信息文件路径
    const commitFile =
      process.argv[process.argv.length - 1] ||
      path.join(process.cwd(), '.git/COMMIT_EDITMSG')

    if (!commitFile || !existsSync(commitFile)) {
      console.error('❌ 未找到提交信息文件')
      console.log('💡 用法: lavy commit --edit <commit-file>')
      process.exit(1)
    }

    // 读取提交信息文件
    const commitMessage = readFileSync(commitFile, 'utf-8').trim()

    if (!commitMessage) {
      console.error('❌ 提交信息文件为空')
      process.exit(1)
    }

    console.log(`📝 验证提交信息文件: ${commitFile}`)
    console.log(`📄 提交信息: ${commitMessage}`)
    console.log()

    // 验证提交信息
    await validateMessage(commitMessage)
  } catch (error) {
    console.error('❌ 验证提交信息文件时出现错误:', error)
    process.exit(1)
  }
}
