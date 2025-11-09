# eslint-config-lavy

ESLint 9 Flat Config 预设，支持 JavaScript、TypeScript、React、Vue，并内置按平台感知的 `globals`。

## 安装

根据需要选择安装：

- 基础（必须）：
  - eslint、globals、eslint-config-lavy
- TypeScript：
  - @typescript-eslint/eslint-plugin、@typescript-eslint/parser
- React/JSX：
  - eslint-plugin-react、eslint-plugin-react-hooks
- Vue：
  - eslint-plugin-vue

示例（按需选择）：

```bash
npm i -D eslint-config-lavy eslint globals
# TypeScript
npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
# React
npm i -D eslint-plugin-react eslint-plugin-react-hooks
# Vue
npm i -D eslint-plugin-vue
```

## 使用

本包采用 ESLint v9 Flat Config。你可以在 `eslint.config.js` 中直接引入对应预设。

- ESM 项目（`type: module`）：
```js
// eslint.config.js
import tsConfig from 'eslint-config-lavy/ts'
export default [
  ...tsConfig
]
```

- CommonJS 项目（`type: commonjs`）：
```js
// eslint.config.js
const { tsConfig } = require('eslint-config-lavy')
module.exports = [
  ...tsConfig
]
```

你也可以使用其他子路径：

- 仅 JavaScript：`eslint-config-lavy/js`
- TypeScript：`eslint-config-lavy/ts`
- React JSX（.jsx）：`eslint-config-lavy/jsx`
- React TSX（.tsx）：`eslint-config-lavy/tsx`
- Vue（.vue）：`eslint-config-lavy/vue`

示例：
```js
// React + TypeScript 项目
import tsxConfig from 'eslint-config-lavy/tsx'
export default [...tsxConfig]

// Vue 项目
import vueConfig from 'eslint-config-lavy/vue'
export default [...vueConfig]
```

如果你更倾向于从主入口按命名导出使用：
```js
import { tsConfig, jsxConfig, tsxConfig, vueConfig } from 'eslint-config-lavy'
export default [...tsConfig]
```

## 平台感知（globals）

配置会根据项目平台自动注入 `globals`（browser/node/universal）。默认是 `browser`。

你可以在项目根创建 `lavy.config.ts` 或 `lavy.config.js` 指定：
```ts
// lavy.config.ts / lavy.config.js
export default {
  platform: 'node' // 可选：'browser' | 'node' | 'universal'
}
```
> 提示：我们会读取该文件内容并解析 `platform` 字段以决定注入的 `globals`。

## 忽略规则

预设内置忽略以下路径：
- node_modules/**
- dist/**
- build/**
- coverage/**
- *.config.js / *.config.ts

## 重要说明

- TypeScript 预设会启用 `parserOptions.project: './tsconfig.json'`，请确保你的项目存在有效的 `tsconfig.json`。
- React 预设默认启用 `react-hooks` 相关规则，且关闭 `react/react-in-jsx-scope`（React 17+）。
- Vue 预设基于 `eslint-plugin-vue` 的 `flat/recommended`，并关闭 `vue/multi-word-component-names`。

## License

MIT
