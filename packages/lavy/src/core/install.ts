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
  devDeps.push('prettier')

  // 语言相关依赖
  if (language === 'js' || language === 'ts') {
    devDeps.push('globals', 'eslint-plugin-import')
  }

  if (language === 'ts') {
    devDeps.push(
      'typescript',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      'eslint-import-resolver-typescript',
    )
  }

  // 框架相关依赖
  if (framework === 'react') {
    devDeps.push('eslint-plugin-react', 'eslint-plugin-react-hooks')
  }
  if (framework === 'vue') {
    devDeps.push('eslint-plugin-vue', '@vue/eslint-config-typescript')
  }

  // 样式相关依赖
  if (style !== 'none') {
    devDeps.push(
      'stylelint',
      'stylelint-config-standard',
      'stylelint-config-prettier',
    )
    if (style === 'scss') devDeps.push('stylelint-scss')
    if (style === 'less') devDeps.push('stylelint-less')
  }

  // Git hooks 相关依赖（根据 useCommitLint 决定）
  if (useCommitLint) {
    console.log('  🔧 将安装 Git hooks 相关依赖')
    devDeps.push(
      'husky', // Git hooks 管理工具
      'lint-staged', // 暂存文件 lint 工具
      'tsx', // TypeScript 执行器
    )
  } else {
    console.log('  ⏭️  跳过 Git hooks 相关依赖安装')
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
