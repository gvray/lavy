/**
 * Git 提交信息验证器
 */

import type { CommitConfig } from '../types/config.js'
import { DEFAULT_COMMIT_CONFIG } from '../config/index.js'

export interface CommitRule {
  pattern: RegExp
  message: string
  examples?: string[]
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class CommitValidator {
  private config: CommitConfig

  constructor(config: Partial<CommitConfig> = {}) {
    // 使用统一的默认配置
    this.config = { ...DEFAULT_COMMIT_CONFIG, ...config }
    this.initializeRules()
  }

  private initializeRules() {
    // 如果没有自定义规则，使用默认规则
    if (!this.config.rules || this.config.rules.length === 0) {
      this.config.rules = []
    }
  }

  /**
   * 添加自定义验证规则
   */
  addRule(rule: CommitRule) {
    this.config.rules = this.config.rules ?? []
    this.config.rules.push(rule)
  }

  /**
   * 验证提交信息
   */
  validate(message: string): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 检查空消息
    if (!message || message.trim().length === 0) {
      errors.push('提交信息不能为空')
      return { isValid: false, errors, warnings }
    }

    const trimmedMessage = message.trim()

    // 检查长度限制
    if (
      typeof this.config.maxLength === 'number' &&
      trimmedMessage.length > this.config.maxLength
    ) {
      errors.push(
        `提交信息长度不能超过 ${this.config.maxLength} 个字符，当前长度: ${trimmedMessage.length}`,
      )
    }

    // 检查合并提交
    if (
      trimmedMessage.startsWith('Merge') &&
      this.config.allowMergeCommits === false
    ) {
      errors.push('不允许合并提交')
    }

    // 如果不是合并提交，进行常规验证
    if (!trimmedMessage.startsWith('Merge')) {
      // 检查提交类型
      // 支持字母开头、包含数字与短横线的类型，并允许可选 scope，如 feat(scope):
      const typeMatch = trimmedMessage.match(
        /^([a-z][a-z0-9-]*)(\([^)]*\))?\s*[:：]/,
      )
      if (!typeMatch) {
        errors.push('提交信息格式错误，应为: <type>: <description>')
        return { isValid: false, errors, warnings }
      } else {
        const type = typeMatch[1]
        const types = this.config.types ?? []
        if (!types.includes(type)) {
          errors.push(
            `不支持的提交类型 "${type}"，支持的类型: ${types.join(', ')}`,
          )
        }
      }

      // 检查自定义规则
      for (const rule of this.config.rules ?? []) {
        if (!rule.pattern.test(trimmedMessage)) {
          errors.push(rule.message)
        }
      }

      // 检查自定义正则模式
      for (const pattern of this.config.customPatterns ?? []) {
        if (!pattern.test(trimmedMessage)) {
          warnings.push(`提交信息不符合自定义模式: ${pattern}`)
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * 获取提交类型说明
   */
  getTypeDescription(): string {
    const types = this.config.types ?? []
    return `📋 支持的提交类型：
${types.map((type) => `  • ${type}`).join('\n')}

💡 格式: <type>: <description>
💡 示例: feat: 添加新功能`
  }

  /**
   * 格式化提交信息
   */
  formatCommitMessage(type: string, subject: string, scope?: string): string {
    const scopePart = scope ? `(${scope})` : ''
    return `${type}${scopePart}: ${subject}`
  }

  /**
   * 获取当前配置
   */
  getConfig(): CommitConfig {
    return { ...this.config }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<CommitConfig>) {
    this.config = { ...this.config, ...newConfig }
    this.initializeRules()
  }
}

// 导出默认实例
export const commitValidator = new CommitValidator()
