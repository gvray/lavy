# stylelint-config-lavy

开箱即用的 Stylelint 预设，基于 `stylelint-config-standard` 并结合前端常见场景进行优化。

## 安装
```bash
npm i -D stylelint stylelint-config-lavy
```

## 使用
```js
// stylelint.config.js
import config from 'stylelint-config-lavy'
export default config
```

## 规则与优化概览
- 继承：`stylelint-config-standard`
- 常用规则：`color-no-invalid-hex`、`comment-no-empty` 等
- 兼容调整：
  - `selector-pseudo-class-no-unknown`: 忽略 `:global`
  - `selector-type-no-unknown`: 忽略部分框架前缀类型
  - `property-no-unknown`: 忽略 `composes`
- 忽略文件：`**/*.js`、`**/*.jsx`、`**/*.ts`、`**/*.tsx`

## 与 lavy CLI 的协作
在通过 `lavy` CLI 初始化样式规范时，本预设会自动写入并安装依赖，配置文件扩展名将基于项目包类型选择合适的形式。

## 许可证
MIT
