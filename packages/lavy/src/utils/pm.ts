import { existsSync } from 'node:fs'

export function detectPackageManager(): 'pnpm' | 'yarn' | 'npm' {
  if (existsSync('pnpm-lock.yaml')) return 'pnpm'
  if (existsSync('yarn.lock')) return 'yarn'
  return 'npm'
}