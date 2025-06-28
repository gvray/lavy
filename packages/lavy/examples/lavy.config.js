import { defineConfig } from 'lavy'

export default defineConfig({
  // 提交信息验证配置
  commit: {
    // 自定义验证规则
    rules: [
      // 不允许以感叹号结尾
      {
        pattern: /^[a-z]+: .*[^!]$/,
        message: '提交信息不能以感叹号结尾',
        examples: ['feat: 新功能', 'fix: 修复问题'],
      },
      // 不允许使用中文标点符号
      {
        pattern: /^[a-z]+: [^，。！？]*$/,
        message: '提交信息不能包含中文标点符号',
        examples: ['feat: 添加新功能', 'fix: 修复登录问题'],
      },
    ],

    // 允许的提交类型（可以添加自定义类型）
    types: [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'build',
      'ci',
      'chore',
      'revert',
      'hotfix',
      'release', // 自定义类型
    ],

    // 最大长度限制
    maxLength: 80,

    // 是否允许合并提交
    allowMergeCommits: true,

    // 自定义正则表达式模式
    customPatterns: [
      // 示例：要求 scope 不能为空
      // /^[a-z]+\([^)]+\): .+$/
    ],
  },

  // 代码检查配置
  lint: {
    eslint: {
      enabled: true,
      config: '.eslintrc.js',
      ignore: ['dist/**', 'node_modules/**'],
    },
    stylelint: {
      enabled: true,
      config: '.stylelintrc.js',
      ignore: ['dist/**', 'node_modules/**'],
    },
    prettier: {
      enabled: true,
      config: '.prettierrc.js',
      ignore: ['dist/**', 'node_modules/**'],
    },
    biome: {
      enabled: false,
      config: 'biome.json',
      ignore: ['dist/**', 'node_modules/**'],
    },
  },

  // 项目配置
  project: {
    language: 'ts',
    framework: 'react',
    style: 'scss',
    linter: 'eslint',
    platform: 'browser',
  },
})
