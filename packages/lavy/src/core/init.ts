import { promptOptions } from './prompts'
import { installDeps } from './install'
import { generateTemplate } from './generate'
import { writeFile, mkdir, copyFile, unlink } from 'node:fs/promises'
import { initCommitlint } from './initCommitlint'
import {
  createDefaultConfig,
  detectConfigConflict,
  resolveConfigConflict,
} from '../utils/config-loader.js'
import { defineConfig } from '../config/index.js'
import type { LavyConfig } from '../types/config.js'
import prompts from 'prompts'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

export async function runInit() {
  const answers = await promptOptions()

  // 检查配置冲突
  const conflictInfo = detectConfigConflict()

  // 生成模式（默认强制生成）
  let generationMode: 'force' | 'merge' = 'force'

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
          { title: '强制覆盖（备份并清理旧配置）', value: 'force' },
          { title: '合并配置（保留旧配置）', value: 'merge' },
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
      // 1) 备份现有配置文件
      const backupRoot = join(process.cwd(), '.lavy-backup')
      const timestamp = String(Date.now())
      const backupDir = join(backupRoot, timestamp)
      await mkdir(backupDir, { recursive: true })
      for (const file of conflictInfo.existingFiles) {
        try {
          await copyFile(join(process.cwd(), file), join(backupDir, file))
          // eslint-disable-next-line no-console
          // console.log(`  📦 已备份: ${file}`)
        } catch (error) {
          // eslint-disable-next-line no-console
          // console.warn(`  ⚠️  备份失败: ${file}`, error)
        }
      }
      console.log(`  🗂️  备份目录: ${backupDir}`)

      // 2) 清理旧配置文件
      await resolveConfigConflict(process.cwd(), true)
      // 删除旧的 TypeScript 版本配置，避免重复
      if (existsSync('lavy.config.ts')) {
        try {
          await unlink('lavy.config.ts')
          console.log('  ✅ 已删除: lavy.config.ts')
        } catch (error) {
          console.warn('  ⚠️  删除失败: lavy.config.ts', error)
        }
      }
      generationMode = 'force'
    }

    if (action === 'merge') {
      generationMode = 'merge'
      console.log('🔀 合并模式：保留旧配置文件，仅生成缺失的标准配置文件。')

      // 在合并模式下，如果样式选择为 none，则清理 Stylelint 配置
      if (answers.style === 'none') {
        const stylelintFiles = [
          'stylelint.config.js',
          'stylelint.config.cjs',
          '.stylelintrc',
          '.stylelintrc.js',
          '.stylelintrc.cjs',
          '.stylelintrc.json',
          '.stylelintrc.yaml',
          '.stylelintrc.yml',
        ]
        for (const f of stylelintFiles) {
          if (existsSync(f)) {
            try {
              await unlink(f)
              console.log(`  🗑️  合并模式清理 Stylelint 配置文件: ${f}`)
            } catch (error) {
              console.warn(`  ⚠️  清理失败: ${f}`, error)
            }
          }
        }
      }
    }
  }

  // 若选择 JavaScript 项目，清理可能存在的 TypeScript 配置文件，避免混淆
  if (answers.language === 'js') {
    const tsFiles = ['tsconfig.json', 'tsconfig.base.json']
    for (const f of tsFiles) {
      if (existsSync(f)) {
        try {
          await unlink(f)
          console.log(`  🗑️  已移除与 JS 项目不相关的配置文件: ${f}`)
        } catch (error) {
          console.warn(`  ⚠️  移除失败: ${f}`, error)
        }
      }
    }
  }

  // 生成模板（根据模式控制是否覆盖）
  await generateTemplate({
    language: answers.language,
    framework: answers.framework,
    style: answers.style,
    mode: generationMode,
    linter: answers.linter,
  })

  // 安装依赖：根据选择的 linter 决定安装 ESLint/Prettier 或 Biome
  await installDeps({
    language: answers.language,
    framework: answers.framework,
    style: answers.style,
    useCommitLint: answers.useCommitLint,
    linter: answers.linter,
  })

  // 只有在启用 commitlint 时才配置 Git hooks
  if (answers.useCommitLint === true) {
    await initCommitlint({
      language: answers.language,
      framework: answers.framework,
      style: answers.style,
      linter: answers.linter,
    })
  }

  // 创建 lavy.config.js 配置文件（合并模式下如果已存在则保留旧配置）
  const useBiome = answers.linter === 'biome'
  const config: LavyConfig = {
    project: {
      language: answers.language,
      framework: answers.framework,
      style: answers.style,
      linter: useBiome ? 'biome' : 'eslint',
      platform: answers.platform ?? 'browser',
    },
    lint: {
      eslint: useBiome
        ? { enabled: false, config: 'eslint.config.js' }
        : { enabled: true, config: 'eslint.config.js' },
      stylelint: {
        enabled: answers.style !== 'none',
        config: 'stylelint.config.js',
      },
      prettier: useBiome
        ? { enabled: false, config: 'prettier.config.js' }
        : { enabled: true, config: 'prettier.config.js' },
      biome: {
        enabled: useBiome,
        config: 'biome.json',
      },
    },
  }

  const configContent = `import { defineConfig } from 'lavy'

export default defineConfig(${JSON.stringify(config, null, 2)})
`

  if (generationMode === 'merge' && existsSync('lavy.config.js')) {
    console.log('ℹ️  检测到已有 lavy.config.js，合并模式下保留旧配置文件。')
  } else {
    await writeFile('lavy.config.js', configContent, 'utf-8')
  }

  console.log('✅ 初始化完成')
  console.log('📁 配置文件: lavy.config.js')
}
