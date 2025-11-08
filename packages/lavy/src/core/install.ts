import { execa } from 'execa'
import ora from 'ora'
import { detectPackageManager } from '../utils/pm'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function installDeps({
  language,
  framework,
  style,
  useCommitLint,
}: any) {
  console.log('📦 分析项目依赖需求...')
  const deps: string[] = []
  const devDeps: string[] = []

  // 基础依赖
  devDeps.push('prettier@^3.3.0')

  // 语言相关依赖
  if (language === 'js' || language === 'ts') {
    devDeps.push(
      'eslint@^9.15.0',
      '@eslint/js@^9.15.0',
      'globals@^15.12.0',
      'eslint-config-lavy',
      'eslint-plugin-import@^2.31.0',
    )
 }

  if (language === 'ts') {
    devDeps.push(
      'typescript@^5.7.0',
      '@typescript-eslint/parser@^8.16.0',
      '@typescript-eslint/eslint-plugin@^8.16.0',
      'eslint-import-resolver-typescript@^3.7.0',
    )
 }

  // 框架相关依赖
  if (framework === 'react') {
    devDeps.push('eslint-plugin-react@^7.37.0', 'eslint-plugin-react-hooks@^5.1.0')
  }
  if (framework === 'vue') {
    devDeps.push('eslint-plugin-vue@^9.32.0', '@vue/eslint-config-typescript@^14.1.0')
  }

  // 样式相关依赖
  if (style !== 'none') {
    devDeps.push(
      'stylelint@^16.11.0',
      'stylelint-config-standard@^37.0.0',
      'stylelint-config-prettier@^9.0.0',
    )
    if (style === 'scss') devDeps.push('stylelint-scss@^6.9.0')
    if (style === 'less') devDeps.push('stylelint-less@^3.0.0')
  }

  // Git hooks 相关依赖（根据 useCommitLint 决定）
  if (useCommitLint) {
    // console.log('  🔧 将安装 Git hooks 相关依赖')
    devDeps.push(
      'husky@^9.1.0', // Git hooks 管理工具
      'lint-staged@^15.2.0', // 暂存文件 lint 工具
      'tsx@^4.19.0', // TypeScript 执行器
    )
  } else {
    // console.log('  ⏭️  跳过 Git hooks 相关依赖安装')
  }

  const pkgManager = detectPackageManager()
  const args = pkgManager === 'npm' ? ['install', '--save-dev'] : ['add', '-D']
  const spinner = ora(`📦 正在使用 ${pkgManager} 安装依赖...`).start()

  try {
    // 安装依赖
    if (deps.length > 0) {
      const depsArgs = pkgManager === 'npm' ? ['install'] : ['add']
      await execa(pkgManager, [...depsArgs, ...deps], {
        stdio: 'inherit',
      })
    }

    // 安装开发依赖
    if (devDeps.length > 0) {
      await execa(pkgManager, [...args, ...devDeps], {
        stdio: 'inherit',
      })
    }

    spinner.succeed('✅ 依赖安装完成')
  } catch (e) {
    spinner.fail('❌ 依赖安装失败')
    console.error('错误详情:', e)
    throw e
  }
}
