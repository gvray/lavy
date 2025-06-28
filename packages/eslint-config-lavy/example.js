// eslint-config-lavy 使用示例
import { generateConfig } from './index.js';

// 生成JavaScript配置
const jsConfig = generateConfig({
  type: 'js',
  outputPath: './configs',
});
console.log('JS配置已生成');

// 生成TypeScript配置
const tsConfig = generateConfig({
  type: 'ts',
  outputPath: './configs',
});
console.log('TS配置已生成');

// 生成React JSX配置
const jsxConfig = generateConfig({
  type: 'jsx',
  outputPath: './configs',
});
console.log('JSX配置已生成');

// 生成React TSX配置
const tsxConfig = generateConfig({
  type: 'tsx',
  outputPath: './configs',
});
console.log('TSX配置已生成');

// 生成Vue配置
const vueConfig = generateConfig({
  type: 'vue',
  outputPath: './configs',
});
console.log('Vue配置已生成');

// 生成自定义配置示例
const customConfig = generateConfig({
  type: 'js',
  outputPath: './configs',
  customConfig: {
    rules: {
      'no-unused-vars': 'error',
      'max-len': ['warn', { code: 100 }]
    },
    env: {
      jest: true
    }
  }
});
console.log('自定义配置已生成');