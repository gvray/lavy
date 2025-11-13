# eslint-config-lavy

面向前端工程的 ESLint v9 Flat Config 预设，覆盖 JavaScript、TypeScript、React、Vue 等主流场景，并根据项目平台自动注入 `globals`。

## 安装
```bash
npm i -D eslint-config-lavy eslint globals
# 按需选择：
# TypeScript：@typescript-eslint/eslint-plugin @typescript-eslint/parser
# React：eslint-plugin-react eslint-plugin-react-hooks
# Vue：eslint-plugin-vue
```

## 使用
```js
// eslint.config.js
import tsConfig from 'eslint-config-lavy/ts'
export default [...tsConfig]
```
也可按需引入：
- JavaScript：`eslint-config-lavy/js`
- TypeScript：`eslint-config-lavy/ts`
- React JSX：`eslint-config-lavy/jsx`
- React TSX：`eslint-config-lavy/tsx`
- Vue：`eslint-config-lavy/vue`

或从主入口按命名导出使用：
```js
import { tsConfig, jsxConfig, tsxConfig, vueConfig } from 'eslint-config-lavy'
export default [...tsConfig]
```

## 平台感知（globals）
在项目根创建 `lavy.config.ts` 或 `lavy.config.js` 指定平台：
```ts
// lavy.config.ts / lavy.config.js
export default {
  platform: 'browser' // 可选：'browser' | 'node' | 'universal'
}
```
预设将基于平台自动注入对应 `globals`，确保规则在不同运行环境下保持一致性。

## 许可证
MIT
