// 项目配置相关的基础类型定义

export type Language = 'js' | 'ts'

export type Framework = 'none' | 'react' | 'vue' | 'svelte' | 'solid'

export type Style = 'none' | 'css' | 'scss' | 'sass' | 'less' | 'stylus'

export type ModuleType = 'esm' | 'cjs'

// 安装依赖函数使用的参数类型
export interface InstallDepsOptions {
  language: Language
  framework: 'react' | 'vue' | 'none'  // install.ts中使用的简化版本
  style: 'css' | 'scss' | 'less' | 'none'  // install.ts中使用的简化版本
  useCommitLint: boolean
}

// 生成配置文件函数使用的参数类型（完整版本）
export interface GenerateConfigOptions {
  language: Language
  framework: Framework
  style: Style
  moduleType: ModuleType
}