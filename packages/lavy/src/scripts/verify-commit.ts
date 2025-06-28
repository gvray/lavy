import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { CommitValidator } from '../utils/commit-validator.js'
import { getCommitConfig } from '../utils/config-loader.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  const commitMsgFile = process.argv[2]
  const commitMsg = readFileSync(commitMsgFile, 'utf-8').trim()

  // 使用配置文件创建验证器
  const config = await getCommitConfig()
  const validator = new CommitValidator(config)

  // 使用验证器验证提交信息
  const result = validator.validate(commitMsg)

  if (!result.isValid) {
    console.error('\n❌ 提交信息验证失败！')
    console.error('\n错误信息：')
    for (const error of result.errors) {
      console.error(`  • ${error}`)
    }

    if (result.warnings.length > 0) {
      console.error('\n警告信息：')
      for (const warning of result.warnings) {
        console.error(`  • ${warning}`)
      }
    }

    console.error(`\n${validator.getTypeDescription()}`)
    process.exit(1)
  }

  if (result.warnings.length > 0) {
    console.warn('\n⚠️  警告信息：')
    for (const warning of result.warnings) {
      console.warn(`  • ${warning}`)
    }
  }

  console.log('✅ 提交信息验证通过！')
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ 验证过程中出现错误:', error)
  process.exit(1)
})
