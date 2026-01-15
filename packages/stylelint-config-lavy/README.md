# stylelint-config-lavy

[![npm version](https://img.shields.io/npm/v/stylelint-config-lavy.svg)](https://www.npmjs.com/package/stylelint-config-lavy)
[![license](https://img.shields.io/npm/l/stylelint-config-lavy.svg)](https://github.com/gvray/lavy/blob/main/LICENSE)

Out-of-the-box Stylelint preset based on `stylelint-config-standard`, optimized for common frontend scenarios.

## 📦 Installation

```bash
npm i -D stylelint stylelint-config-lavy
```

## 🚀 Usage

```js
// stylelint.config.js
import config from 'stylelint-config-lavy'
export default config
```

## ⚙️ Rules Overview

| Category | Details |
|----------|---------|
| **Extends** | `stylelint-config-standard` |
| **Core Rules** | `color-no-invalid-hex`, `comment-no-empty`, etc. |
| **Ignored Files** | `**/*.js`, `**/*.jsx`, `**/*.ts`, `**/*.tsx` |

### Framework Compatibility

- `selector-pseudo-class-no-unknown`: Ignores `:global`
- `selector-type-no-unknown`: Ignores framework-specific type prefixes
- `property-no-unknown`: Ignores `composes`

## 🔗 Integration with Lavy CLI

When initializing style standards via `lavy` CLI, this preset is automatically configured with appropriate dependencies and file extensions based on your project type.

## 📜 License

[MIT](../../LICENSE)
