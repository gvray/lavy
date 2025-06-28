import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { LavyConfig, CommitConfig } from '../types/config.js'
import {
  mergeConfig,
  getDefaultConfig,
  validateConfig,
  DEFAULT_COMMIT_CONFIG,
  DEFAULT_COMMIT_TYPES,
} from '../config/index.js'
import { CommitValidator } from './commit-validator.js'

export async function loadConfig(
  projectRoot: string = process.cwd(),
): Promise<LavyConfig> {
  const configPath = join(projectRoot, 'lavy.config.js')

  if (!existsSync(configPath)) {
    return getDefaultConfig()
  }

  try {
    // 使用动态导入替代 require
    const configModule = await import(configPath)
    const userConfig = configModule.default || configModule

    // 验证配置
    const validation = validateConfig(userConfig)
    if (!validation.isValid) {
      console.warn('⚠️  配置文件验证失败:')
      for (const error of validation.errors) {
        console.warn(`  - ${error}`)
      }
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️  配置文件警告:')
      for (const warning of validation.warnings) {
        console.warn(`  - ${warning}`)
      }
    }

    // 合并配置
    const defaultConfig = getDefaultConfig()
    return mergeConfig(defaultConfig, userConfig)
  } catch (error) {
    console.warn('⚠️  配置文件加载失败:', error)
    return getDefaultConfig()
  }
}

export async function getCommitConfig(
  projectRoot: string = process.cwd(),
): Promise<CommitConfig> {
  const config = await loadConfig(projectRoot)
  return config.commit || { ...DEFAULT_COMMIT_CONFIG }
}

export function createDefaultConfig(): string {
  return `import { defineConfig } from 'lavy'

export default defineConfig({
  // 提交信息验证配置
  commit: {
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
  },

  // 代码检查配置
  lint: {
    eslint: {
      enabled: true,
      config: '.eslintrc.js'
    },
    stylelint: {
      enabled: true,
      config: '.stylelintrc.js'
    },
    prettier: {
      enabled: true,
      config: '.prettierrc.js'
    }
  },

  // 项目配置
  project: {
    language: 'ts',
    framework: 'none',
    style: 'css',
    linter: 'eslint',
    platform: 'browser'
  }
})
`
}

export function createCommitConfig(): string {
  return `import { defineConfig } from 'lavy'

export default defineConfig({
  commit: {
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
  }
})
`
}

export function detectConfigConflict(projectRoot: string = process.cwd()) {
  const conflicts: string[] = []
  const existingFiles: string[] = []
  const categories = {
    lavy: [] as string[],
    eslint: [] as string[],
    prettier: [] as string[],
    stylelint: [] as string[],
    biome: [] as string[],
    other: [] as string[],
  }

  // 所有可能的配置文件
  const allConfigFiles = [
    // lavy 配置
    'lavy.config.js',
    'lavy.config.ts',
    '.lavyrc.json',
    '.lavyrc.js',
    '.lavyrc.ts',
    // eslint 配置
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.json',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    'eslint.config.js',
    'eslint.config.cjs',
    // prettier 配置
    '.prettierrc',
    '.prettierrc.js',
    '.prettierrc.cjs',
    '.prettierrc.json',
    '.prettierrc.yaml',
    '.prettierrc.yml',
    'prettier.config.js',
    'prettier.config.cjs',
    // stylelint 配置
    '.stylelintrc',
    '.stylelintrc.js',
    '.stylelintrc.cjs',
    '.stylelintrc.json',
    '.stylelintrc.yaml',
    '.stylelintrc.yml',
    'stylelint.config.js',
    'stylelint.config.cjs',
    // biome 配置
    'biome.json',
    'biome.jsonc',
  ]

  for (const file of allConfigFiles) {
    const filePath = join(projectRoot, file)
    if (existsSync(filePath)) {
      existingFiles.push(file)

      // 分类文件
      if (file.includes('lavy')) {
        categories.lavy.push(file)
        if (file !== 'lavy.config.js' && file !== 'lavy.config.ts') {
          conflicts.push(`发现旧的 lavy 配置文件: ${file}`)
        }
      } else if (file.includes('eslint')) {
        categories.eslint.push(file)
        conflicts.push(`发现 ESLint 配置文件: ${file}`)
      } else if (file.includes('prettier')) {
        categories.prettier.push(file)
        conflicts.push(`发现 Prettier 配置文件: ${file}`)
      } else if (file.includes('stylelint')) {
        categories.stylelint.push(file)
        conflicts.push(`发现 Stylelint 配置文件: ${file}`)
      } else if (file.includes('biome')) {
        categories.biome.push(file)
        conflicts.push(`发现 Biome 配置文件: ${file}`)
      } else {
        categories.other.push(file)
        conflicts.push(`发现其他配置文件: ${file}`)
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
    existingFiles,
    categories,
    // 检查是否有 lavy 配置文件
    hasLavyConfig: categories.lavy.some(
      (file) => file === 'lavy.config.js' || file === 'lavy.config.ts',
    ),
  }
}

export async function resolveConfigConflict(
  projectRoot: string = process.cwd(),
  force: boolean = false,
): Promise<boolean> {
  const conflictInfo = detectConfigConflict(projectRoot)

  if (!conflictInfo.hasConflict) {
    return true
  }

  if (force) {
    // 强制删除旧配置文件
    const { unlinkSync } = await import('node:fs')
    console.log('🗑️  强制删除旧配置文件...')

    for (const file of conflictInfo.existingFiles) {
      if (file !== 'lavy.config.js' && file !== 'lavy.config.ts') {
        try {
          unlinkSync(join(projectRoot, file))
          console.log(`  ✅ 已删除: ${file}`)
        } catch (error) {
          console.warn(`  ⚠️  删除失败: ${file}`, error)
        }
      }
    }
    return true
  }

  // 显示检测到的配置文件
  console.log('⚠️  检测到以下配置文件:')

  if (conflictInfo.categories.lavy.length > 0) {
    console.log('\n  📁 Lavy 配置:')
    for (const file of conflictInfo.categories.lavy) {
      console.log(`    - ${file}`)
    }
  }

  if (conflictInfo.categories.eslint.length > 0) {
    console.log('\n  📁 ESLint 配置:')
    for (const file of conflictInfo.categories.eslint) {
      console.log(`    - ${file}`)
    }
  }

  if (conflictInfo.categories.prettier.length > 0) {
    console.log('\n  📁 Prettier 配置:')
    for (const file of conflictInfo.categories.prettier) {
      console.log(`    - ${file}`)
    }
  }

  if (conflictInfo.categories.stylelint.length > 0) {
    console.log('\n  📁 Stylelint 配置:')
    for (const file of conflictInfo.categories.stylelint) {
      console.log(`    - ${file}`)
    }
  }

  if (conflictInfo.categories.biome.length > 0) {
    console.log('\n  📁 Biome 配置:')
    for (const file of conflictInfo.categories.biome) {
      console.log(`    - ${file}`)
    }
  }

  if (conflictInfo.categories.other.length > 0) {
    console.log('\n  📁 其他配置:')
    for (const file of conflictInfo.categories.other) {
      console.log(`    - ${file}`)
    }
  }

  console.log('\n建议操作:')
  console.log('  1. 手动删除旧配置文件')
  console.log('  2. 使用 --force 参数强制覆盖')
  console.log('  3. 手动合并配置内容')

  return false
}
