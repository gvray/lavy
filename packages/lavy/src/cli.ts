import { cac } from 'cac'
import { runInit } from './core/init'
import { showWelcome } from './utils/banner'
import { runCommitCommand } from './commands/commit.js'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// 读取 package.json
let pkg: any = { version: '1.0.0' }
const packageJsonPath = join(process.cwd(), 'package.json')

try {
  if (existsSync(packageJsonPath)) {
    pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  }
} catch (error) {
  // 忽略 package.json 读取错误
  console.warn('⚠️  无法读取 package.json，使用默认版本号')
}

const cli = cac('lavy')

cli.command('init', '初始化项目规范').action(() => {
  showWelcome() // 展示欢迎信息
  runInit() // 运行初始化
})

cli
  .command('commit', 'Git 提交信息验证')
  .option('-m, --message <message>', '验证指定的提交信息')
  .option('-e, --edit <file>', '验证提交信息文件（用于 Git hooks）')
  .option('-t, --test', '运行测试用例')
  .option('-i, --init', '初始化配置文件')
  .option('-c, --config', '显示当前配置')
  .action((options) => {
    runCommitCommand(options)
  })

cli.help()
cli.version(pkg.version)
cli.parse()
