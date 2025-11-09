import type { CommitRule } from '../utils/commit-validator.js'
import type { Language, Framework, Style } from './index.js'

export interface CommitConfig {
  rules?: CommitRule[]
  types?: string[]
  maxLength?: number
  allowMergeCommits?: boolean
  customPatterns?: RegExp[]
}

export interface LintConfig {
  eslint?: {
    enabled?: boolean
    config?: string
    ignore?: string[]
  }
  stylelint?: {
    enabled?: boolean
    config?: string
    ignore?: string[]
  }
  prettier?: {
    enabled?: boolean
    config?: string
    ignore?: string[]
  }
  biome?: {
    enabled?: boolean
    config?: string
    ignore?: string[]
  }
}

export interface ProjectConfig {
  language?: Language
  framework?: Framework
  style?: Style
  linter?: 'eslint' | 'biome'
  platform?: 'node' | 'browser' | 'universal'
}

export interface LavyConfig {
  // 提交信息验证配置
  commit?: CommitConfig

  // 代码检查配置
  lint?: LintConfig

  // 项目配置
  project?: ProjectConfig

  // 其他配置项可以在这里扩展
  [key: string]: any
}

// 导出类型，方便用户使用
export type { CommitRule } from '../utils/commit-validator.js'
