import { cac } from 'cac'
import { runInit } from './core/init'
import { showWelcome } from './utils/banner'
import { runCommitCommand } from './commands/commit.js'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// 从包自身的 package.json 读取版本号，避免受当前工作目录影响
let version = '1.0.0'
try {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const pkgPath = join(__dirname, '../package.json')
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  if (pkgJson?.version) version = pkgJson.version
} catch {}

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
cli.version(version)
// 如果未提供任何参数，自动显示帮助
if (process.argv.length <= 2) {
  process.argv.push('-h')
}
cli.parse()
