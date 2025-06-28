import { execa } from 'execa'
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import ora from 'ora'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function initCommitlint({ language, framework, style }: any) {
  const spinner = ora('🔧 正在配置 Git hooks 和 lint-staged...').start()

  try {
    // 1. 检查必要的依赖是否已安装
    spinner.text = '🔍 检查依赖...'
    await checkDependencies()

    // 2. 检查是否为 Git 仓库并获取 Git 根目录
    spinner.text = '🔍 检查 Git 仓库...'
    const gitRoot = await getGitRoot()
    if (!gitRoot) {
      throw new Error('当前目录不是 Git 仓库。请先运行 git init 初始化仓库。')
    }

    // 3. 检查当前目录是否有 package.json
    const currentDir = process.cwd()
    const hasPackageJson = existsSync(join(currentDir, 'package.json'))

    if (!hasPackageJson) {
      console.log('  ⚠️  当前目录没有 package.json，将在 Git 根目录配置 hooks')
    }

    // 4. 确定工作目录（优先使用有 package.json 的目录）
    const workDir = hasPackageJson ? currentDir : gitRoot
    console.log(`  📁 工作目录: ${workDir}`)

    // 5. 初始化 husky（在 Git 根目录）
    spinner.text = '🔧 初始化 Husky...'
    await execa('npx', ['--no-install', 'husky', 'install'], { cwd: gitRoot })

    // 6. 创建 lint-staged 配置（在 package.json 所在目录）
    spinner.text = '🔍 创建 lint-staged 配置...'
    await createLintStagedConfig(workDir, { language, framework, style })

    // 7. 添加 pre-commit 钩子（lint-staged）
    spinner.text = '🔧 配置 pre-commit 钩子...'
    const preCommitContent = hasPackageJson
      ? 'npx --no-install lint-staged'
      : `cd "${workDir}" && npx --no-install lint-staged`

    writeFileSync(
      join(gitRoot, '.husky/pre-commit'),
      `${preCommitContent}
`,
      'utf-8',
    )

    // 设置执行权限
    await execa('chmod', ['+x', join(gitRoot, '.husky/pre-commit')])

    // 8. 添加 commit-msg 钩子（使用内置的 lavy commit 验证器）
    spinner.text = '🔧 配置 commit-msg 钩子...'
    const commitMsgContent = hasPackageJson
      ? 'npx --no-install lavy commit --edit "$1"'
      : `cd "${workDir}" && npx --no-install lavy commit --edit "$1"`

    writeFileSync(
      join(gitRoot, '.husky/commit-msg'),
      `${commitMsgContent}
`,
      'utf-8',
    )

    // 设置执行权限
    await execa('chmod', ['+x', join(gitRoot, '.husky/commit-msg')])

    // 9. 更新 package.json 脚本（在 package.json 所在目录）
    spinner.text = '📦 更新 package.json 脚本...'
    await updatePackageScripts(workDir)

    spinner.succeed('✅ Git hooks 和 lint-staged 配置完成！')

    console.log('\n📋 已配置的功能：')
    console.log('  🔍 pre-commit: 运行 lint-staged 检查暂存文件')
    console.log('  📝 commit-msg: 使用 lavy commit 验证提交信息')
    console.log(
      '  🧹 lint-staged: 自动格式化暂存文件（配置在 package.json 中）',
    )
    console.log('  📋 lavy commit: 内置提交信息验证器')

    if (!hasPackageJson) {
      console.log('\n⚠️  注意：')
      console.log(`  • Git hooks 已配置在 Git 根目录: ${gitRoot}`)
      console.log(`  • 配置文件已创建在: ${workDir}`)
      console.log('  • hooks 会自动切换到正确的目录执行命令')
    }

    console.log('\n💡 使用说明：')
    console.log('  • 提交前会自动运行代码检查和格式化')
    console.log('  • 提交信息会通过 lavy commit 验证')
    console.log(
      '  • 支持的类型: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert',
    )
    console.log('  • 格式: <type>: <description>')
    console.log('  • 运行 "npm run commit:check" 测试验证器')
    console.log('  • 运行 "npm run commit:config" 查看配置')
    console.log('\n📝 下一步：')
    console.log(
      '  • 运行 "lavy commit --init" 添加 commit 配置到 lavy.config.js',
    )
    console.log('  • 运行 "lavy commit --config" 查看当前配置')
  } catch (error) {
    spinner.fail('❌ Git hooks 配置失败！')
    console.error('错误详情:', error)
    throw error
  }
}

async function checkDependencies() {
  const packageJsonPath = 'package.json'

  if (!existsSync(packageJsonPath)) {
    throw new Error('未找到 package.json 文件')
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  const requiredDeps = ['husky', 'lint-staged']
  const missingDeps = requiredDeps.filter((dep) => !allDeps[dep])

  if (missingDeps.length > 0) {
    throw new Error(
      `缺少必要的依赖: ${missingDeps.join(', ')}。请先运行 lavy init 安装依赖。`,
    )
  }
}

async function getGitRoot(): Promise<string | null> {
  try {
    const { stdout } = await execa('git', ['rev-parse', '--show-toplevel'], {
      stdio: 'pipe',
    })
    return stdout.trim()
  } catch {
    return null
  }
}

async function createLintStagedConfig(
  workDir: string,
  { language, framework, style }: any,
  force = true,
) {
  const packageJsonPath = join(workDir, 'package.json')

  if (!existsSync(packageJsonPath)) {
    console.warn('⚠️  未找到 package.json，跳过 lint-staged 配置')
    return
  }

  try {
    // 清理可能存在的旧配置文件
    const oldConfigPath = join(workDir, 'lint-staged.config.js')
    if (existsSync(oldConfigPath)) {
      const { unlinkSync } = await import('node:fs')
      unlinkSync(oldConfigPath)
      console.log('  🗑️  删除了旧的 lint-staged.config.js 文件')
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    // 生成 lint-staged 配置
    const lintStagedConfig = generateLintStagedConfig({
      language,
      framework,
      style,
    })

    console.log(lintStagedConfig)

    // 是否覆盖
    if (force || !packageJson['lint-staged']) {
      packageJson['lint-staged'] = lintStagedConfig
      console.log('  ✅ lint-staged 配置已覆盖写入 package.json')
    } else {
      console.log('  ℹ️  package.json 已包含 lint-staged 配置，跳过')
      return
    }

    writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf-8',
    )
  } catch (error) {
    console.warn('⚠️  添加 lint-staged 配置失败:', error)
  }
}

function generateLintStagedConfig({ language, framework, style }: any) {
  const config: Record<string, string[]> = {}

  // 根据语言配置
  if (language === 'ts' || language === 'typescript') {
    // TypeScript 项目
    config['*.{ts,tsx}'] = ['eslint --fix', 'prettier --write']
    config['*.{js,jsx}'] = ['eslint --fix', 'prettier --write']
  } else if (language === 'js' || language === 'javascript') {
    // JavaScript 项目
    config['*.{js,jsx}'] = ['eslint --fix', 'prettier --write']
  }

  // 根据框架配置
  if (framework === 'vue') {
    config['*.vue'] = ['eslint --fix', 'prettier --write']
  } else if (framework === 'react') {
    config['*.{jsx,tsx}'] = ['eslint --fix', 'prettier --write']
  } else if (framework === 'svelte') {
    config['*.svelte'] = ['eslint --fix', 'prettier --write']
  } else if (framework === 'solid') {
    config['*.{jsx,tsx}'] = ['eslint --fix', 'prettier --write']
  }

  // 根据样式配置
  if (style === 'css') {
    config['*.css'] = ['stylelint --fix', 'prettier --write']
  } else if (style === 'scss' || style === 'sass') {
    config['*.{scss,sass}'] = ['stylelint --fix', 'prettier --write']
  } else if (style === 'less') {
    config['*.less'] = ['stylelint --fix', 'prettier --write']
  } else if (style === 'stylus') {
    config['*.styl'] = ['stylelint --fix', 'prettier --write']
  } else if (style === 'tailwind') {
    config['*.{css,scss,less}'] = ['stylelint --fix', 'prettier --write']
  }

  // 通用配置（总是添加）
  config['*.{json,md,yml,yaml}'] = ['prettier --write']

  return config
}

async function updatePackageScripts(workDir: string) {
  const packageJsonPath = join(workDir, 'package.json')

  if (!existsSync(packageJsonPath)) {
    console.warn('⚠️  未找到 package.json，跳过脚本更新')
    return
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    // 确保 scripts 对象存在
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    // 添加有用的脚本
    const newScripts = {
      prepare: 'husky install',
      lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
      'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
      format: 'prettier --write .',
      'format:check': 'prettier --check .',
      'type-check': 'tsc --noEmit',
      'commit:check': 'lavy commit --test', // 测试提交验证器
      'commit:config': 'lavy commit --config', // 查看提交配置
    }

    // 合并脚本，不覆盖现有的
    packageJson.scripts = {
      ...packageJson.scripts,
      ...newScripts,
    }

    writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf-8',
    )
    console.log('  ✅ 更新了 package.json 脚本')
  } catch (error) {
    console.warn('⚠️  更新 package.json 脚本失败:', error)
  }
}
