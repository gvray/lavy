# stylelint-config-lavy

一个开箱即用的 Stylelint 配置，基于 `stylelint-config-standard`，为项目提供一致的样式代码规范。

- 默认严重级别：warning
- 忽略文件：`**/*.js`, `**/*.jsx`, `**/*.ts`, `**/*.tsx`
- 已内置规则调整，兼容部分常见场景（如 `:global`、一些框架前缀类型、`composes` 属性等）

## 安装
```bash
npm i -D stylelint stylelint-config-lavy
# 或者
pnpm add -D stylelint stylelint-config-lavy
# 或者
yarn add -D stylelint stylelint-config-lavy
```

注意：该包要求 Node.js >= 16。

## 使用
在项目根目录创建 `.stylelintrc.js` 或 `stylelint.config.js`：

```js
module.exports = {
  extends: [require.resolve('stylelint-config-lavy')],
}
```

如果你使用 ESM：
```js
// stylelint.config.js
import config from 'stylelint-config-lavy'
export default config
```

也支持 CommonJS：
```js
// .stylelintrc.js
module.exports = {
  extends: [require.resolve('stylelint-config-lavy')],
}
```

## 配置内容概览
该配置（index.ts）主要内容：
- extends: `stylelint-config-standard`
- rules：
  - `indentation: 2`
  - 关闭或放宽部分校验：
    - `at-rule-no-unknown: null`
    - `block-no-empty: null`
    - `no-empty-source: null`
  - 常规启用：
    - `color-no-invalid-hex: true`
    - `comment-no-empty: true`
  - 特殊兼容：
    - `selector-pseudo-class-no-unknown: [true, { ignorePseudoClasses: ['global'] }]`
    - `selector-type-no-unknown: [true, { ignoreTypes: ['/^v-/'] }]`
    - `property-no-unknown: [true, { ignoreProperties: ['composes'] }]`
- ignoreFiles：`['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']`

## 与 lavy CLI 的配合
如果你使用 `lavy` CLI 初始化项目，选择了样式规范，该配置会被自动写入并安装依赖。你也可以手动使用本包。

## 许可证
MIT
