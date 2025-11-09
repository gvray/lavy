# lavy

一站式代码规范与提交验证工具集，包含 CLI 初始化、ESLint Flat Config 预设、Stylelint 配置等组件。

- CLI：交互式初始化项目的代码检查与格式化配置（ESLint/Prettier 或 Biome），并可选择是否启用提交信息验证
- ESLint：提供面向 JS/TS/React/Vue 的 Flat Config 预设，自动按平台注入 globals
- Stylelint：提供符合标准的样式规范，支持与 Vue 结合
- 提交验证：内置 `lavy commit` 命令，可生成并诊断提交信息规则

## 快速开始

```bash
# 安装 CLI
npm i -D lavy

# 交互式初始化（使用子命令）
npx lavy init

# 查看帮助
npx lavy -h
npx lavy init --help
npx lavy commit --help
```

初始化过程中你可以选择：
- 语言：JavaScript / TypeScript
- 框架：None / React / Vue
- 样式：CSS / SCSS / Less / None
- Linter：ESLint + Prettier 或 Biome
- 是否启用提交信息验证（husky + lint-staged）

完成后会在项目根生成/更新：
- lavy.config.js：包含项目语言、框架、样式、平台、linter 以及各配置文件路径
- eslint.config.js（当选择 ESLint 时）
- prettier.config.js（当选择 ESLint 时）
- biome.json（当选择 Biome 时）
- stylelint.config.js（当选择使用样式规范时）
- 可选：husky hooks 与 lint-staged 规则、package.json scripts

## 可选 Linter 模式

- ESLint 模式：安装并生成 ESLint + Prettier 配置
- Biome 模式：安装并生成 Biome 配置（禁用 ESLint/Prettier）

## 提交信息验证（Commit）

提供 `lavy commit` 命令：
- `lavy commit`：在当前 Git 仓库验证最近一次提交信息
- `lavy commit --init`：将提交验证配置追加到 lavy.config.js
- `lavy commit --config`：查看当前生效的提交验证配置
- `lavy commit --test`：诊断常见场景并打印示例结果

默认支持的类型：feat、fix、docs、style、refactor、perf、test、build、ci、chore、revert。

## eslint-config-lavy

ESLint 9 Flat Config 预设，支持 JavaScript、TypeScript、React、Vue，并内置按平台感知的 globals。

安装（按需）：
```bash
npm i -D eslint-config-lavy eslint globals
# TypeScript
npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
# React
npm i -D eslint-plugin-react eslint-plugin-react-hooks
# Vue
npm i -D eslint-plugin-vue
```

使用（ESM）：
```js
// eslint.config.js
import tsConfig from 'eslint-config-lavy/ts'
export default [...tsConfig]
```

使用（CommonJS）：
```js
// eslint.config.js
const { tsConfig } = require('eslint-config-lavy')
module.exports = [...tsConfig]
```

其他子路径：
- JavaScript：eslint-config-lavy/js
- TypeScript：eslint-config-lavy/ts
- React JSX：eslint-config-lavy/jsx
- React TSX：eslint-config-lavy/tsx
- Vue：eslint-config-lavy/vue

## stylelint-config-lavy

一个开箱即用的 Stylelint 配置，基于 stylelint-config-standard，并内置一些常用兼容调整。

安装：
```bash
npm i -D stylelint stylelint-config-lavy
```

使用（ESM）：
```js
// stylelint.config.js
import config from 'stylelint-config-lavy'
export default config
```

使用（CommonJS）：
```js
// .stylelintrc.js
module.exports = {
  extends: [require.resolve('stylelint-config-lavy')]
}
```

在通过 CLI 初始化时，生成的 stylelint.config.js 会继承 stylelint-config-lavy，并在 Vue 项目中额外继承 stylelint-config-recommended-vue；如果你使用 Vue 并出现 .vue 样式解析问题，可补充安装 postcss-html 并在配置中设置 customSyntax。

## License

MIT
