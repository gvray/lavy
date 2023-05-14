#!/usr/bin/env node

const { Command } = require('commander')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const chalk = require('chalk')
const { existsSync } = require('fs')
const { join } = require('path')
const packageJson = require('./package.json')
const eslintTemplates = require('./template/eslintTemplate')
const { mvFile } = require('./utils')

const cwd = process.cwd()
const program = new Command()

program.name(packageJson.name).description(packageJson.description).version(packageJson.version, '-v, --version')

// 创建 --init 命令
program.option('-i, --init', 'Initialize the program').action(async (options) => {
  const { init } = options
  if (init) {
    try {
      const { languageSelected } = await inquirer.prompt([
        {
          type: 'list',
          name: 'languageSelected',
          prefix: '🏄‍♂️',
          suffix: '',
          message: 'Which language does your project use?',
          choices: ['Javascript', 'Typescript']
        }
      ])
      const { frameSelected } = await inquirer.prompt([
        {
          type: 'list',
          name: 'frameSelected',
          prefix: '🏄‍♂️',
          suffix: '',
          message: 'Which framework does your project use?',
          choices: ['React', 'Vue', 'None']
        }
      ])
      const filePath = join(cwd, 'eslintrc.js') // 文件路径
      const content =
        eslintTemplates[`${languageSelected}${frameSelected}`.toLowerCase()] ??
        `// no template
`
      await fs.writeFile(filePath, content)
      // copy 一些文件
      await mvFile(join(__dirname, 'template', 'editorconfigTemplate'), join(cwd, '.editorconfig'))
      await mvFile(join(__dirname, 'template', 'eslintignoreTemplate'), join(cwd, '.eslintignore'))
      await mvFile(join(__dirname, 'template', 'prettierrcTemplate.js'), join(cwd, '.prettierrc.js'))
    } catch (error) {
      console.error
    }
  }
  if (!options || !Object.keys(options).length) {
    program.help()
  }
})

// 保存原始的 unknownOption 方法
const originalUnknownOption = program.unknownOption

// 自定义处理未知选项的错误消息
program.unknownOption = function (flag) {
  console.error(`Unknown option: ${flag}`)
  program.help()
}

// // 检查是否存在命令
// program.arguments('<command>').action(() => {
//   console.error('No command provided.')
//   program.help()
// })

program.parse(process.argv)
