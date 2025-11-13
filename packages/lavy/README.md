# lavy（CLI）

面向现代前端工程的交互式规范初始化与提交信息校验工具。通过简单的命令即可完成项目的 Linter 选择、配置文件生成、依赖安装与工作流接入。

## 能力概览
- 交互式初始化：ESLint+Prettier 或 Biome（二选一）
- 配置生成：eslint.config.js、prettier.config.js、stylelint.config.js 或 biome.json
- 依赖安装：根据选择自动安装所需包
- Git Hooks：可选接入 pre-commit 与 commit-msg
- 提交校验：内置 `lavy commit` 命令（诊断与示例输出）

## 快速开始
```bash
# 安装
npm i -D lavy

# 交互式初始化
npx lavy init

# 帮助与命令说明
npx lavy -h
npx lavy commit --help
```

## 命令
- `lavy init`：初始化项目规范。按向导选择语言、框架、样式与 Linter，自动生成配置文件与脚本并安装依赖。
- `lavy commit`：在当前 Git 仓库校验最近一次提交信息；支持：
  - `--init`：将提交校验规则写入项目配置
  - `--config`：查看当前规则
  - `--test`：输出示例与诊断结果

## 初始化产出（示例）
- ESLint 模式：`eslint.config.js`、`prettier.config.js`、`stylelint.config.js`
- Biome 模式：`biome.json`、`stylelint.config.js`
- 通用：`lavy.config.js`（包含项目与 Linter 配置）
- 脚本：`lint`、`lint:fix`、`format`、`format:check` 等

## 许可证
MIT
