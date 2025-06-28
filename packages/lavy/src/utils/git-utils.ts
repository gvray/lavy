import { execa } from 'execa'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * 检查指定目录是否为 Git 仓库
 * @param dir 要检查的目录路径
 * @returns 是否为 Git 仓库
 */
export async function isGitRepository(
  dir: string = process.cwd(),
): Promise<boolean> {
  try {
    // 检查 .git 目录是否存在
    const gitDir = join(dir, '.git')
    if (!existsSync(gitDir)) {
      return false
    }

    // 进一步验证 Git 命令是否可用
    await execa('git', ['rev-parse', '--git-dir'], {
      cwd: dir,
      stdio: 'pipe',
    })

    return true
  } catch {
    return false
  }
}

/**
 * 检查当前目录是否在 Git 仓库内（包括子目录）
 * @param dir 要检查的目录
 * @returns 是否在 Git 仓库内
 */
export async function isInGitRepository(
  dir: string = process.cwd(),
): Promise<boolean> {
  try {
    const { stdout } = await execa('git', ['rev-parse', '--git-dir'], {
      cwd: dir,
      stdio: 'pipe',
    })
    return !!stdout.trim()
  } catch {
    return false
  }
}
