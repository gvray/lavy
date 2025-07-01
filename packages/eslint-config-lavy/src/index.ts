// 导出所有配置
export { jsConfig } from './js.js'
export { tsConfig } from './ts.js'
export { jsxConfig } from './jsx.js'
export { tsxConfig } from './tsx.js'
export { vueConfig } from './vue.js'
export { vueTsConfig } from './vuets.js'

// 默认导出
export default {
  js: () => import('./js.js').then(m => m.jsConfig),
  ts: () => import('./ts.js').then(m => m.tsConfig),
  jsx: () => import('./jsx.js').then(m => m.jsxConfig),
  tsx: () => import('./tsx.js').then(m => m.tsxConfig),
  vue: () => import('./vue.js').then(m => m.vueConfig),
  vuets: () => import('./vuets.js').then(m => m.vueTsConfig)
}