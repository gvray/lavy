# Lavy

[![npm version](https://img.shields.io/npm/v/lavy.svg)](https://www.npmjs.com/package/lavy)
[![license](https://img.shields.io/npm/l/lavy.svg)](https://github.com/gvray/lavy/blob/main/LICENSE)

[English](./README.md) | [简体中文](./README.zh-CN.md)

Enterprise-level code quality and engineering configuration toolkit. Provides CLI initialization, ESLint Flat Config presets, Stylelint presets, and commit message validation to help teams quickly establish consistent and maintainable engineering standards.

## ✨ Features

- **Unified**: One toolchain covering mainstream frontend scenarios (JS/TS/React/Vue)
- **Efficient**: Interactive CLI with minimal choices to generate configs and install dependencies
- **Robust**: Built-in commit message validation with optional Git Hooks for workflow consistency

## 📦 Packages

| Package | Description | Version |
|---------|-------------|---------|
| [lavy](./packages/lavy) | Interactive CLI for project standards initialization | [![npm](https://img.shields.io/npm/v/lavy.svg)](https://www.npmjs.com/package/lavy) |
| [eslint-config-lavy](./packages/eslint-config-lavy) | ESLint v9 Flat Config presets (JS/TS/React/Vue) | [![npm](https://img.shields.io/npm/v/eslint-config-lavy.svg)](https://www.npmjs.com/package/eslint-config-lavy) |
| [stylelint-config-lavy](./packages/stylelint-config-lavy) | Stylelint config presets | [![npm](https://img.shields.io/npm/v/stylelint-config-lavy.svg)](https://www.npmjs.com/package/stylelint-config-lavy) |

## 🚀 Quick Start

```bash
# Install CLI (recommended as dev dependency)
npm i -D lavy

# Interactive initialization
npx lavy init

# View help
npx lavy -h
npx lavy commit --help
```

## 🔧 CLI Commands

- **`lavy init`** - Initialize project standards with interactive wizard
- **`lavy commit`** - Validate commit messages with diagnostics and examples
  - `--init` - Write commit validation rules to project config
  - `--config` - View current rules
  - `--test` - Output examples and diagnostic results

## 📄 Generated Files

| Mode | Generated Files |
|------|-----------------|
| ESLint | `eslint.config.js`, `prettier.config.js`, `stylelint.config.js` |
| Biome | `biome.json`, `stylelint.config.js` |
| Common | `lavy.config.js` (project & linter config) |

## 📜 License

[MIT](./LICENSE)
