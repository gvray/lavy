# Lavy CLI

[![npm version](https://img.shields.io/npm/v/lavy.svg)](https://www.npmjs.com/package/lavy)
[![license](https://img.shields.io/npm/l/lavy.svg)](https://github.com/gvray/lavy/blob/main/LICENSE)

Interactive code quality initialization and commit message validation tool for modern frontend projects.

## ✨ Features

- **Interactive Setup**: Choose between ESLint+Prettier or Biome
- **Config Generation**: Auto-generate `eslint.config.js`, `prettier.config.js`, `stylelint.config.js` or `biome.json`
- **Auto Install**: Automatically install required dependencies
- **Git Hooks**: Optional pre-commit and commit-msg hooks
- **Commit Validation**: Built-in `lavy commit` command with diagnostics

## 🚀 Quick Start

```bash
# Install
npm i -D lavy

# Interactive initialization
npx lavy init

# View help
npx lavy -h
npx lavy commit --help
```

## 🔧 Commands

### `lavy init`

Initialize project standards with interactive wizard. Select language, framework, style, and linter preferences.

### `lavy commit`

Validate commit messages in current Git repository.

| Option | Description |
|--------|-------------|
| `--init` | Write commit validation rules to project config |
| `--config` | View current rules |
| `--test` | Output examples and diagnostic results |

## 📄 Generated Files

| Mode | Files |
|------|-------|
| ESLint | `eslint.config.js`, `prettier.config.js`, `stylelint.config.js` |
| Biome | `biome.json`, `stylelint.config.js` |
| Common | `lavy.config.js` (project & linter config) |

**Scripts**: `lint`, `lint:fix`, `format`, `format:check`, etc.

## 📜 License

[MIT](../../LICENSE)
