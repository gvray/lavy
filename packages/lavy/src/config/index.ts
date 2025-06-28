import type { LavyConfig, CommitConfig } from '../types/config.js'

// 统一的默认配置常量
export const DEFAULT_COMMIT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
] as const

export const DEFAULT_COMMIT_CONFIG: CommitConfig = {
  rules: [],
  types: [...DEFAULT_COMMIT_TYPES],
  maxLength: 72,
  allowMergeCommits: true,
  customPatterns: [],
}

/**
 * 定义 Lavy 配置
 * 提供完整的 TypeScript 类型提示
 */
export function defineConfig(config: LavyConfig): LavyConfig {
  return config
}

/**
 * 合并配置
 * 深度合并两个配置对象
 */
export function mergeConfig(
  defaultConfig: LavyConfig,
  userConfig: LavyConfig,
): LavyConfig {
  const merged: LavyConfig = { ...defaultConfig }

  // 合并 commit 配置
  if (userConfig.commit) {
    merged.commit = {
      ...defaultConfig.commit,
      ...userConfig.commit,
      // 深度合并数组
      rules: [
        ...(defaultConfig.commit?.rules || []),
        ...(userConfig.commit?.rules || []),
      ],
      types: userConfig.commit.types || defaultConfig.commit?.types,
      customPatterns: [
        ...(defaultConfig.commit?.customPatterns || []),
        ...(userConfig.commit?.customPatterns || []),
      ],
    }
  }

  // 可以在这里添加其他配置项的合并逻辑
  // 例如：eslint, prettier, stylelint 等

  return merged
}

/**
 * 获取默认配置
 */
export function getDefaultConfig(): LavyConfig {
  return {
    commit: { ...DEFAULT_COMMIT_CONFIG },
  }
}

/**
 * 验证配置
 */
export function validateConfig(config: LavyConfig): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 验证 commit 配置
  if (config.commit) {
    const { commit } = config

    // 验证 maxLength
    if (commit.maxLength !== undefined) {
      if (typeof commit.maxLength !== 'number' || commit.maxLength <= 0) {
        errors.push('commit.maxLength 必须是一个正整数')
      } else if (commit.maxLength > 200) {
        warnings.push('commit.maxLength 建议不超过 200 个字符')
      }
    }

    // 验证 types
    if (commit.types) {
      if (!Array.isArray(commit.types)) {
        errors.push('commit.types 必须是一个数组')
      } else {
        for (const type of commit.types) {
          if (typeof type !== 'string' || type.length === 0) {
            errors.push('commit.types 中的每个元素必须是非空字符串')
            break
          }
        }
      }
    }

    // 验证 rules
    if (commit.rules) {
      if (!Array.isArray(commit.rules)) {
        errors.push('commit.rules 必须是一个数组')
      } else {
        for (const rule of commit.rules) {
          if (!rule.pattern || !(rule.pattern instanceof RegExp)) {
            errors.push(
              'commit.rules 中的每个规则必须包含有效的 pattern 正则表达式',
            )
            break
          }
          if (!rule.message || typeof rule.message !== 'string') {
            errors.push(
              'commit.rules 中的每个规则必须包含有效的 message 字符串',
            )
            break
          }
        }
      }
    }

    // 验证 customPatterns
    if (commit.customPatterns) {
      if (!Array.isArray(commit.customPatterns)) {
        errors.push('commit.customPatterns 必须是一个数组')
      } else {
        for (const pattern of commit.customPatterns) {
          if (!(pattern instanceof RegExp)) {
            errors.push('commit.customPatterns 中的每个元素必须是正则表达式')
            break
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
