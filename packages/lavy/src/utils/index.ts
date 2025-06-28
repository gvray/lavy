import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { promisify } from 'node:util'
import { glob } from 'glob'
import semver from 'semver'
import debug from 'debug'

const log = debug('lavy:utils')
const globPromise = promisify(glob)

export const emoji = '✨'

export async function installPackage(packageName: string): Promise<void> {
  try {
    log(`Installing package: ${packageName}`)
    execSync(`npm install ${packageName} --save-dev`, { stdio: 'inherit' })
  } catch (error) {
    log(`Error installing package ${packageName}:`, error)
    throw error
  }
}

export async function mvFile(
  source: string,
  destination: string,
): Promise<void> {
  try {
    log(`Moving file from ${source} to ${destination}`)
    const content = readFileSync(source, 'utf-8')
    writeFileSync(destination, content, 'utf-8')
  } catch (error) {
    log(`Error moving file from ${source} to ${destination}:`, error)
    throw error
  }
}

export async function changeFile(
  source: string,
  destination: string,
  transformer: (content: string) => string,
): Promise<void> {
  try {
    log(`Changing file from ${source} to ${destination}`)
    const content = readFileSync(source, 'utf-8')
    const transformedContent = transformer(content)
    writeFileSync(destination, transformedContent, 'utf-8')
  } catch (error) {
    log(`Error changing file from ${source} to ${destination}:`, error)
    throw error
  }
}

export function removeComment(content: string): string {
  return content.replace(/^#.*$/gm, '').trim()
}

interface DependencyCheckResult {
  hasConflicts: boolean
  conflicts: string[]
}

export async function checkDependencies(options: {
  linter: string
  language: string
  framework: string
  style: string
}): Promise<DependencyCheckResult> {
  const conflicts: string[] = []
  const { linter, language, framework, style } = options

  // 检查 Node.js 版本
  if (!semver.gte(process.version, '18.0.0')) {
    conflicts.push('Node.js version must be >= 18.0.0')
  }

  // 检查包管理器
  try {
    const packageManager = process.env.npm_execpath?.includes('yarn')
      ? 'yarn'
      : 'npm'
    if (packageManager === 'yarn' && !existsSync('yarn.lock')) {
      conflicts.push('Yarn is being used but yarn.lock is missing')
    }
  } catch (error) {
    log('Error checking package manager:', error)
  }

  // 检查依赖冲突
  if (linter === 'Biome' && framework === 'Vue') {
    conflicts.push('Biome is not fully compatible with Vue')
  }

  if (language === 'Typescript' && !existsSync('tsconfig.json')) {
    conflicts.push('TypeScript is selected but tsconfig.json is missing')
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
  }
}

interface ConfigValidationResult {
  isValid: boolean
  warnings: string[]
}

export async function validateConfig(
  projectRoot: string,
): Promise<ConfigValidationResult> {
  const warnings: string[] = []

  // 检查必要的配置文件
  const requiredFiles = ['package.json', '.gitignore', '.editorconfig']

  for (const file of requiredFiles) {
    if (!existsSync(join(projectRoot, file))) {
      warnings.push(`Missing required file: ${file}`)
    }
  }

  // 检查 package.json
  try {
    const packageJson = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf-8'),
    )

    if (!packageJson.scripts) {
      warnings.push('Missing scripts in package.json')
    }

    if (!packageJson.dependencies && !packageJson.devDependencies) {
      warnings.push('No dependencies found in package.json')
    }
  } catch (error) {
    log('Error reading package.json:', error)
    warnings.push('Error reading package.json')
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  }
}

interface ProjectHealthResult {
  isHealthy: boolean
  warnings: string[]
}

export async function checkProjectHealth(
  projectRoot: string,
  fix = false,
): Promise<ProjectHealthResult> {
  const warnings: string[] = []

  // 检查项目结构
  const requiredDirs = ['src', 'tests']
  for (const dir of requiredDirs) {
    if (!existsSync(join(projectRoot, dir))) {
      warnings.push(`Missing required directory: ${dir}`)
    }
  }

  // 检查代码质量
  try {
    const files = (await globPromise('**/*.{js,ts,jsx,tsx}', {
      cwd: projectRoot,
      ignore: ['**/node_modules/**', '**/dist/**'],
    })) as string[]

    for (const file of files) {
      const content = readFileSync(join(projectRoot, file), 'utf-8')
      if (content.includes('console.log')) {
        warnings.push(`Found console.log in ${file}`)
      }
      if (content.includes('debugger')) {
        warnings.push(`Found debugger statement in ${file}`)
      }
    }
  } catch (error) {
    log('Error checking code quality:', error)
    warnings.push('Error checking code quality')
  }

  // 检查 Git 配置
  if (!existsSync(join(projectRoot, '.git'))) {
    warnings.push('Git repository not initialized')
  }

  return {
    isHealthy: warnings.length === 0,
    warnings,
  }
}

interface GenerateConfigOptions {
  language?: string
  framework?: string
  style?: string
  linter?: string
  platform?: string
}

export async function generateConfig(
  type: string,
  options: GenerateConfigOptions = {},
): Promise<void> {
  const { language, framework, style, linter, platform } = options
  const templateDir = resolve(__dirname, '../template')

  switch (type) {
    case 'biome':
      await mvFile(
        join(templateDir, 'biome.tpl'),
        join(process.cwd(), 'biome.json'),
      )
      break

    case 'eslint':
      await changeFile(
        join(templateDir, 'eslint.tpl'),
        join(process.cwd(), '.eslintrc.js'),
        (str: string) => {
          const getLavy = (): string => {
            const pathName: string[] = []
            if (language !== 'Javascript') {
              pathName.push(language?.toLowerCase() || '')
            }
            if (framework !== 'None') {
              pathName.push(framework?.toLowerCase() || '')
            }
            return pathName.length > 0 ? `/${pathName.join('/')}` : ''
          }
          return str.replace('{{ eslintPath }}', `'lavy${getLavy()}'`)
        },
      )
      break

    case 'prettier':
      await mvFile(
        join(templateDir, 'prettierrc.tpl'),
        join(process.cwd(), '.prettierrc.js'),
      )
      break

    case 'editorconfig':
      await mvFile(
        join(templateDir, 'editorconfig.tpl'),
        join(process.cwd(), '.editorconfig'),
      )
      break

    case 'gitignore':
      await mvFile(
        join(templateDir, 'gitignore.tpl'),
        join(process.cwd(), '.gitignore'),
      )
      break

    case 'typescript':
      await mvFile(
        join(templateDir, 'tsconfig.tpl'),
        join(process.cwd(), 'tsconfig.json'),
      )
      break

    case 'stylelint':
      await changeFile(
        join(templateDir, 'stylelint.tpl'),
        join(process.cwd(), '.stylelintrc.js'),
        (str: string) =>
          str.replace('{{ stylelintPath }}', `'stylelint-config-lavy'`),
      )
      break

    case 'vscode':
      await mvFile(
        join(templateDir, 'extensions.tpl'),
        join(process.cwd(), '.vscode', 'extensions.json'),
      )
      await mvFile(
        join(templateDir, 'settings.tpl'),
        join(process.cwd(), '.vscode', 'settings.json'),
      )
      break

    case 'ci':
      if (platform === 'GitHub Actions') {
        await mvFile(
          join(templateDir, 'github-actions.tpl'),
          join(process.cwd(), '.github', 'workflows', 'ci.yml'),
        )
      } else if (platform === 'GitLab CI') {
        await mvFile(
          join(templateDir, 'gitlab-ci.tpl'),
          join(process.cwd(), '.gitlab-ci.yml'),
        )
      }
      break

    default:
      throw new Error(`Unknown config type: ${type}`)
  }
}

// 导出提交验证器
export {
  commitValidator,
  CommitValidator,
  type CommitRule,
  type ValidationResult,
} from './commit-validator.js'
