# lavy

一个为前端项目提供“即插即用”的代码规范初始化工具，支持在初始化时选择 ESLint+Prettier 或 Biome，自动生成配置文件、安装依赖、配置 Husky 与 lint-staged，并内置提交信息校验命令。

## 特性
- 交互式初始化，快速落地团队统一规范
- Linter 可选：ESLint+Prettier 或 Biome（二选一）
- 自动生成配置文件：eslint.config.js / prettier.config.js（ESM 项目）或 prettier.config.mjs（CommonJS 项目） / stylelint.config.js（ESM 项目）或 stylelint.config.mjs（CommonJS 项目） / biome.json
- 自动安装对应依赖（含 husky、lint-staged）
- 自动为 Git 仓库配置 pre-commit 与 commit-msg Hook
- 内置提交信息校验命令：`lavy commit`，可生成/追加到 lavy.config.js
- JS 项目会自动移除 tsconfig 文件，避免混淆

## 安装
```bash
npm i -D lavy
```

## 快速开始
```bash
# 全自动初始化（交互式）
npx lavy --init
# 或简写	npx lavy -i

# 查看帮助
npx lavy -h
```

初始化过程中你将选择：
- 语言：JavaScript 或 TypeScript
- 框架：none / React / Vue / Svelte / Solid
- 样式：css / scss-sass / less / stylus / none
- 代码检查工具：ESLint+Prettier 或 Biome
- 是否启用提交信息校验（commitlint）

## 初始化后会做什么
- 生成或更新配置文件：
  - ESLint 模式：`eslint.config.js`、`prettier.config.js（ESM）/ prettier.config.mjs（CJS）`、`stylelint.config.js（ESM）/ stylelint.config.mjs（CJS）`
  - Biome 模式：`biome.json`、`stylelint.config.js（ESM）/ stylelint.config.mjs（CJS）`
  - 通用：`lavy.config.js`（包含 project 与 lint 配置）
- 根据语言与选择自动安装依赖：
  - ESLint 模式：安装 eslint、prettier 及相关插件
  - Biome 模式：安装 `@biomejs/biome`
  - 样式：安装 stylelint 相关依赖（如选择了样式）
  - Git Hooks：安装 husky、lint-staged
- JS 项目：自动删除 `tsconfig.json` 与 `tsconfig.base.json`
- 自动写入 package.json 脚本：
  - ESLint 模式：
    - `lint`: `eslint . --ext .js,.jsx,.ts,.tsx`
    - `lint:fix`: `eslint . --ext .js,.jsx,.ts,.tsx --fix`
    - `format`: `prettier --write .`
    - `format:check`: `prettier --check .`
  - Biome 模式：
    - `lint`: `biome lint .`
    - `lint:fix`: `biome check --write .`
    - `format`: `biome format --write .`
    - `format:check`: `biome format --check .`
  - TypeScript 项目会额外添加：`type-check: tsc --noEmit`

## Husky 与 lint-staged
- 自动创建 `pre-commit`：运行 `lint-staged`
- 自动创建 `commit-msg`：运行 `lavy commit --edit "$1"`
- lint-staged 默认规则（示例）：
  - JS 项目：`*.{js,jsx}` 使用所选 linter（ESLint 模式下追加 Prettier）
  - TS 项目：`*.{ts,tsx}` 使用所选 linter（ESLint 模式下追加 Prettier）
  - Vue：`*.vue`；Svelte：`*.svelte`
  - 样式文件：`stylelint --fix`（ESLint 模式下附加 `prettier --write`）
  - 通用文件：`*.{json,md,yml,yaml}`
    - ESLint 模式：`prettier --write`
    - Biome 模式：`biome format --write`

## 提交信息校验
```bash
# 诊断当前 Git 提交
npx lavy commit

# 初始化或追加 commit 配置到 lavy.config.js
npx lavy commit --init

# 查看当前配置
npx lavy commit --config

# 测试模式（打印示例与结果）
npx lavy commit --test
```

## 其他
- 该包与 `eslint-config-lavy`、`stylelint-config-lavy` 配套使用更佳（可选）。
- 如需自定义规则，可在生成的配置文件中按需调整。

## 许可证
MIT
