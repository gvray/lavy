import './cli'

// 导出 defineConfig 函数供配置文件使用
export { defineConfig } from './config/index.js'

// 导出配置生成函数
export { generateTemplate } from './core/generate.js'
