import { defineConfig } from 'tsup'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function copyDir(src: string, dest: string) {
  mkdirSync(dest, { recursive: true })
  for (const file of readdirSync(src)) {
    const srcPath = join(src, file)
    const destPath = join(dest, file)
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'], // 支持双格式输出
  target: 'node18', // 根据你的 Node.js 版本调整
  splitting: false, // CLI 不需要 code splitting
  shims: false,
  clean: true, // 清除旧输出
  dts: false, // CLI 一般不导出类型，可关闭
  minify: false, // CLI 无需压缩，便于调试
  sourcemap: false,
  banner: {
    js: '#!/usr/bin/env node', // 添加 shebang 到构建产物顶部
  },
  outExtension: () => ({ js: '.mjs' }),
  external: [
    'execa',
    'prompts',
    'node:readline',
    'readline',
    'inquirer',
    'cfonts',
    'boxen',
    'handlebars',
  ],
  // 确保所有依赖都被正确打包
  noExternal: ['cac', 'ora', 'colorette'],
  onSuccess: async () => {
    copyDir('src/templates', 'dist/templates')
  },
})
