#!/usr/bin/env node

const { Command } = require('commander')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const chalk = require('chalk')
const { existsSync } = require('fs')
const { join } = require('path')
const packageJson = require('./package.json')
const { mvFile, changeFile } = require('./utils')

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
      // 根据输入项输出.eslintrc.js
      await changeFile(join(__dirname, 'template', 'eslint.tpl'), join(cwd, '.22eslintrc.js'), (str) => {
        const getLavy = () => {
          const pathName = []
          if (languageSelected !== 'Javascript') {
            pathName.push(languageSelected.toLowerCase())
          }
          if (frameSelected !== 'None') {
            pathName.push(frameSelected.toLowerCase())
          }
          return pathName.length > 0 ? `/${pathName.join('/')}` : ''
        }
        const newStr = str.replace('{{ eslintPath }}', `'lavy${getLavy()}'`)
        return newStr
      })
      // copy 一些文件
      await mvFile(join(__dirname, 'template', 'editorconfig.tpl'), join(cwd, '.22editorconfig'))
      await mvFile(join(__dirname, 'template', 'eslintignore.tpl'), join(cwd, '.22eslintignore'))
      await mvFile(join(__dirname, 'template', 'prettierrc.tpl'), join(cwd, '.22prettierrc.js'))
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
