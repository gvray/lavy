# eslint-config-lavy

[![npm version](https://img.shields.io/npm/v/eslint-config-lavy.svg)](https://www.npmjs.com/package/eslint-config-lavy)
[![license](https://img.shields.io/npm/l/eslint-config-lavy.svg)](https://github.com/gvray/lavy/blob/main/LICENSE)

ESLint v9 Flat Config presets for frontend projects, covering JavaScript, TypeScript, React, and Vue with automatic `globals` injection based on platform.

## 📦 Installation

```bash
npm i -D eslint-config-lavy eslint globals

# Optional peer dependencies:
# TypeScript: @typescript-eslint/eslint-plugin @typescript-eslint/parser
# React: eslint-plugin-react eslint-plugin-react-hooks
# Vue: eslint-plugin-vue
```

## 🚀 Usage

```js
// eslint.config.js
import tsConfig from 'eslint-config-lavy/ts'
export default [...tsConfig]
```

### Available Presets

| Import Path | Description |
|-------------|-------------|
| `eslint-config-lavy/js` | JavaScript |
| `eslint-config-lavy/ts` | TypeScript |
| `eslint-config-lavy/jsx` | React JSX |
| `eslint-config-lavy/tsx` | React TSX |
| `eslint-config-lavy/vue` | Vue |

### Named Exports

```js
import { tsConfig, jsxConfig, tsxConfig, vueConfig } from 'eslint-config-lavy'
export default [...tsConfig]
```

## 🌐 Platform-Aware Globals

Create `lavy.config.ts` or `lavy.config.js` in your project root:

```ts
export default {
  platform: 'browser' // 'browser' | 'node' | 'universal'
}
```

The preset automatically injects corresponding `globals` based on your platform setting.

## 📜 License

[MIT](../../LICENSE)
