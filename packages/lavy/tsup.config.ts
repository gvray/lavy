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
  format: ['esm', 'cjs'], // 支持双格式输出
  target: 'node18', // 根据你的 Node.js 版本调整
  splitting: false, // CLI 不需要 code splitting
  shims: true,
  clean: true, // 清除旧输出
  dts: true, // 开启 dts 生成，向外发布类型
  minify: false, // CLI 无需压缩，便于调试
  sourcemap: false,
  // 指定包内 tsconfig，避免受根 tsconfig 影响
  tsconfig: 'tsconfig.json',
  banner: {
    js: '#!/usr/bin/env node', // 添加 shebang 到构建产物顶部
  },
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
    copyFileSync('../../tsconfig.base.json', './tsconfig.base.json')
  },
})
