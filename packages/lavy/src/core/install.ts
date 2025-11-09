import { execa } from 'execa'
import ora from 'ora'
import { detectPackageManager } from '../utils/pm'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import type { InstallDepsOptions } from '../types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function installDeps({
  language,
  framework,
  style,
  useCommitLint,
  linter = 'eslint',
}: InstallDepsOptions) {
  console.log('📦 分析项目依赖需求...')
  const deps: string[] = []
  const devDeps: string[] = []

  // 基础依赖：根据 linter 选择
  if (linter === 'biome') {
    devDeps.push('@biomejs/biome@^1.9.4')
  } else {
    devDeps.push('prettier@^3.3.0')
  }

  // 语言相关依赖（仅在使用 ESLint 时安装）
  if (linter === 'eslint' && (language === 'js' || language === 'ts')) {
    devDeps.push(
      'eslint@^9.15.0',
      '@eslint/js@^9.15.0',
      'globals@^15.12.0',
      'eslint-config-lavy',
      'eslint-plugin-import@^2.31.0',
    )
  }

  if (linter === 'eslint' && language === 'ts') {
    devDeps.push(
      'typescript@^5.7.0',
      '@typescript-eslint/parser@^8.16.0',
      '@typescript-eslint/eslint-plugin@^8.16.0',
      'eslint-import-resolver-typescript@^3.7.0',
    )
  }

  // 框架相关依赖（仅在使用 ESLint 时安装）
  if (linter === 'eslint' && framework === 'react') {
    devDeps.push(
      'eslint-plugin-react@^7.37.0',
      'eslint-plugin-react-hooks@^5.1.0',
    )
  }
  if (linter === 'eslint' && framework === 'vue') {
    devDeps.push(
      'eslint-plugin-vue@^9.32.0',
      '@vue/eslint-config-typescript@^14.1.0',
    )
  }

  // 样式相关依赖（与代码检查工具无关）
  if (style !== 'none') {
    devDeps.push(
      'stylelint@^16.11.0',
      'stylelint-config-lavy',
      'stylelint-order'
    )
    if (framework === 'vue') {
      devDeps.push('stylelint-config-recommended-vue@^1.5.0')
    }
    if (style === 'scss') devDeps.push('stylelint-scss@^6.9.0')
    if (style === 'less') devDeps.push('stylelint-less@^3.0.0')
  }

  // Git hooks 相关依赖（根据 useCommitLint 决定）
  if (useCommitLint) {
    devDeps.push('husky@^9.1.0', 'lint-staged@^15.2.0', 'tsx@^4.19.0')
  }

  const pkgManager = detectPackageManager()

  // 不同包管理器的静默参数，减少安装时的冗余输出
  const depsArgs =
    pkgManager === 'npm'
      ? ['install', '--silent']
      : pkgManager === 'yarn'
        ? ['add', '--silent']
        : ['add', '--reporter', 'silent'] // pnpm

  const devArgs =
    pkgManager === 'npm'
      ? ['install', '--save-dev', '--silent']
      : pkgManager === 'yarn'
        ? ['add', '-D', '--silent']
        : ['add', '-D', '--reporter', 'silent'] // pnpm

  const spinner = ora(`📦 正在使用 ${pkgManager} 安装依赖...`).start()

  try {
    // 安装依赖
    if (deps.length > 0) {
      await execa(pkgManager, [...depsArgs, ...deps], {
        stdio: 'pipe',
      })
    }

    // 安装开发依赖
    if (devDeps.length > 0) {
      await execa(pkgManager, [...devArgs, ...devDeps], {
        stdio: 'pipe',
      })
    }

    spinner.succeed('依赖安装完成')
  } catch (e) {
    spinner.fail('依赖安装失败')
    console.error('错误详情:', e)
    throw e
  }
}
