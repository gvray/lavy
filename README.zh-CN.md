# Lavy

[![npm version](https://img.shields.io/npm/v/lavy.svg)](https://www.npmjs.com/package/lavy)
[![license](https://img.shields.io/npm/l/lavy.svg)](https://github.com/gvray/lavy/blob/main/LICENSE)

[English](./README.md) | [简体中文](./README.zh-CN.md)

企业级代码质量与工程配置套件，统一提供 CLI 初始化、ESLint Flat Config 预设、Stylelint 预设与提交信息校验能力，帮助团队快速落地一致、可维护的工程规范。

## ✨ 特性

- **统一**：一套工具链覆盖前端主流场景（JS/TS/React/Vue）
- **高效**：交互式 CLI 以最少选择完成配置生成与依赖安装
- **稳健**：内置提交信息校验与可选 Git Hooks，保障工作流一致性

## 📦 包组成

| 包名 | 描述 | 版本 |
|------|------|------|
| [lavy](./packages/lavy) | 交互式项目规范初始化 CLI | [![npm](https://img.shields.io/npm/v/lavy.svg)](https://www.npmjs.com/package/lavy) |
| [eslint-config-lavy](./packages/eslint-config-lavy) | ESLint v9 Flat Config 预设（JS/TS/React/Vue） | [![npm](https://img.shields.io/npm/v/eslint-config-lavy.svg)](https://www.npmjs.com/package/eslint-config-lavy) |
| [stylelint-config-lavy](./packages/stylelint-config-lavy) | Stylelint 配置预设 | [![npm](https://img.shields.io/npm/v/stylelint-config-lavy.svg)](https://www.npmjs.com/package/stylelint-config-lavy) |

## 🚀 快速开始

```bash
# 安装 CLI（建议作为开发依赖）
npm i -D lavy

# 交互式初始化
npx lavy init

# 查看帮助
npx lavy -h
npx lavy commit --help
```

## 🔧 CLI 命令

- **`lavy init`** - 交互式初始化项目规范，按向导选择语言、框架、样式与 Linter
- **`lavy commit`** - 校验提交信息，输出诊断与示例
  - `--init` - 将提交校验规则写入项目配置
  - `--config` - 查看当前规则
  - `--test` - 输出示例与诊断结果

## 📄 生成文件

| 模式 | 生成文件 |
|------|----------|
| ESLint | `eslint.config.js`、`prettier.config.js`、`stylelint.config.js` |
| Biome | `biome.json`、`stylelint.config.js` |
| 通用 | `lavy.config.js`（项目与 Linter 配置） |

## 📜 许可证

[MIT](./LICENSE)
