# lavy

企业级代码质量与工程配置套件，统一提供 CLI 初始化、ESLint Flat Config 预设、Stylelint 预设与提交信息校验能力，帮助团队快速落地一致、可维护的工程规范。

- 统一：一套工具链覆盖前端主流场景（JS/TS/React/Vue）
- 高效：交互式 CLI 以最少选择完成配置生成与依赖安装
- 稳健：内置提交信息校验与可选 Git Hooks，保障工作流一致性

## 组成

- CLI：交互式初始化项目规范（ESLint+Prettier 或 Biome），并提供 `lavy commit` 提交信息校验命令
- ESLint 预设：面向 JS/TS/React/Vue 的 Flat Config 集合，按平台注入 `globals`
- Stylelint 预设：开箱可用的样式规范，覆盖通用与框架场景

## 快速开始

```bash
# 安装 CLI（建议作为开发依赖）
npm i -D lavy

# 交互式初始化
npx lavy init

# 查看帮助
npx lavy -h
npx lavy commit --help
```

## 特性亮点

- 交互式流程：根据语言、框架、样式、Linter 偏好自动生成配置文件与脚本
- 自动安装：初始化阶段自动选择并安装所需依赖
- 提交校验：提供 `lavy commit`，可诊断并输出示例；支持一键追加到项目配置

## 子包

- eslint-config-lavy：ESLint v9 Flat Config 预设（JS/TS/React/Vue）
- stylelint-config-lavy：Stylelint 规范预设

## 许可证

MIT
