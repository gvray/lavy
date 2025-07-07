import { promptOptions } from './prompts'
import { installDeps } from './install'
import { generateTemplate } from './generate'
import { writeFile } from 'node:fs/promises'
import { initCommitlint } from './initCommitlint'
import {
  createDefaultConfig,
  detectConfigConflict,
  resolveConfigConflict,
} from '../utils/config-loader.js'
import { defineConfig } from '../config/index.js'
import type { LavyConfig } from '../types/config.js'
import prompts from 'prompts'

export async function runInit() {
  const answers = await promptOptions()

  // 检查配置冲突
  const conflictInfo = detectConfigConflict()

  if (conflictInfo.hasConflict) {
    console.log('⚠️  发现配置文件冲突:')
    for (const conflict of conflictInfo.conflicts) {
      console.log(`  - ${conflict}`)
    }

    const { action } = await prompts([
      {
        type: 'select',
        name: 'action',
        message: '请选择操作:',
        choices: [
          { title: '强制覆盖旧配置（推荐 ✅）', value: 'force' }, // 推荐项
          { title: '继续初始化（保留旧配置）', value: 'continue' },
          { title: '终止操作', value: 'abort' },
        ],
        initial: 0, // 默认选中第 1 项（推荐项）
      },
    ])

    if (action === 'abort') {
      console.log('❌ 操作已终止')
      process.exit(0)
    }

    if (action === 'force') {
      await resolveConfigConflict(process.cwd(), true)
    }
  }

  // 生成模板
  await generateTemplate(answers)

  // 安装依赖 临时注释方法我快速测试
  await installDeps(answers)

  // 只有在启用 commitlint 时才配置 Git hooks
  if (answers.useCommitLint === true) {
    await initCommitlint(answers)
  }

  // 创建 lavy.config.js 配置文件
  const config: LavyConfig = {
    project: {
      language: answers.language === 'ts' ? 'ts' : 'js',
      framework: answers.framework === 'none' ? 'none' : answers.framework,
      style: answers.style === 'none' ? 'none' : answers.style,
      linter: 'eslint', // 默认使用 eslint
      platform: 'browser',
    },
    lint: {
      eslint: {
        enabled: true,
        config: '.eslintrc.js',
      },
      stylelint: {
        enabled: answers.style !== 'none',
        config: '.stylelintrc.js',
      },
      prettier: {
        enabled: true,
        config: '.prettierrc.js',
      },
      biome: {
        enabled: false,
        config: 'biome.json',
      },
    },
  }

  const configContent = `import { defineConfig } from 'lavy'

export default defineConfig(${JSON.stringify(config, null, 2)})
`

  await writeFile('lavy.config.js', configContent, 'utf-8')

  console.log('✅ 初始化完成')
  console.log('📁 配置文件: lavy.config.js')
}
