import { execa } from 'execa'
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import ora from 'ora'
import type { Language, Framework, Style } from '../types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function initCommitlint({
  language,
  framework,
  style,
  linter = 'eslint',
}: {
  language: Language
  framework: Framework
  style: Style
  linter?: 'eslint' | 'biome'
}) {
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
    await createLintStagedConfig(workDir, {
      language,
      framework,
      style,
      linter,
    })

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
    await updatePackageScripts(workDir, linter, language)

    spinner.succeed('✅ Git hooks 和 lint-staged 配置完成！')

    if (!hasPackageJson) {
      console.log('\n⚠️  注意：')
      console.log(`  • Git hooks 已配置在 Git 根目录: ${gitRoot}`)
      console.log(`  • 配置文件已创建在: ${workDir}`)
      console.log('  • hooks 会自动切换到正确的目录执行命令')
    }

    console.log('\n💡 使用说明：')
    console.log(
      '  • 选择运行 "lavy commit --init" 将提交验证信息暴露到 lavy.config.js',
    )
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
  {
    language,
    framework,
    style,
    linter,
  }: {
    language: Language
    framework: Framework
    style: Style
    linter: 'eslint' | 'biome'
  },
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
      linter,
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

function generateLintStagedConfig({
  language,
  framework,
  style,
  linter,
}: {
  language: Language
  framework: Framework
  style: Style
  linter: 'eslint' | 'biome'
}) {
  const config: Record<string, string[]> = {}

  const codeCommand =
    linter === 'biome' ? 'biome check --write' : 'eslint --fix'
  const formatCommand =
    linter === 'biome' ? 'biome format --write' : 'prettier --write'

  const lintFile = []
  // 根据语言配置：仅添加对应语言的后缀
  // 基础语言文件
  const langMap: Record<string, string[]> = {
    ts: ['ts'],
    js: ['js'],
  }
  if (langMap[language]) lintFile.push(...langMap[language])

  // 框架相关文件
  const frameworkMap: Record<string, Record<string, string>> = {
    react: { ts: 'tsx', js: 'jsx' },
  }
  if (frameworkMap[framework]?.[language]) {
    lintFile.push(frameworkMap[framework][language])
  }
  // 配置命令
  config[`*.{${lintFile.join(',')}}`] = [
    codeCommand,
    ...(linter === 'eslint' ? ['prettier --write'] : []),
  ]

  // 根据框架配置（避免重复添加 jsx/tsx）
  if (framework === 'vue') {
    config['*.vue'] = [
      codeCommand,
      ...(linter === 'eslint' ? ['prettier --write'] : []),
    ]
  } else if (framework === 'svelte') {
    config['*.svelte'] = [
      codeCommand,
      ...(linter === 'eslint' ? ['prettier --write'] : []),
    ]
  }
  // React/Solid 由语言模式覆盖，不额外添加

  // 根据样式配置（Biome 模式不添加 Prettier）
  if (style === 'css') {
    config['*.css'] = [
      'stylelint --fix',
      ...(linter === 'eslint' ? ['prettier --write'] : []),
    ]
  } else if (style === 'scss' || style === 'sass') {
    config['*.{scss,sass}'] = [
      'stylelint --fix',
      ...(linter === 'eslint' ? ['prettier --write'] : []),
    ]
  } else if (style === 'less') {
    config['*.less'] = [
      'stylelint --fix',
      ...(linter === 'eslint' ? ['prettier --write'] : []),
    ]
  } else if (style === 'stylus') {
    config['*.styl'] = [
      'stylelint --fix',
      ...(linter === 'eslint' ? ['prettier --write'] : []),
    ]
  }

  // 通用配置
  config['*.{json,md,yml,yaml}'] = [formatCommand]

  return config
}

async function updatePackageScripts(
  workDir: string,
  linter: 'eslint' | 'biome',
  language: Language,
) {
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

    // 添加有用的脚本（根据 linter 选择）
    const isTS = language === 'ts'
    const newScripts =
      linter === 'biome'
        ? {
            prepare: 'husky install',
            lint: 'biome lint .',
            'lint:fix': 'biome check --write .',
            format: 'biome format --write .',
            'format:check': 'biome format --check .',
            ...(isTS ? { 'type-check': 'tsc --noEmit' } : {}),
            'commit:check': 'lavy commit --test',
            'commit:config': 'lavy commit --config',
          }
        : {
            prepare: 'husky install',
            lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
            'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
            format: 'prettier --write .',
            'format:check': 'prettier --check .',
            ...(isTS ? { 'type-check': 'tsc --noEmit' } : {}),
            'commit:check': 'lavy commit --test',
            'commit:config': 'lavy commit --config',
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
