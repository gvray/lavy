#!/usr/bin/env node

const { Command } = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { existsSync } = require('fs')
const { join } = require('path')
const packageJson = require('./package.json')
const { mvFile, changeFile, installPackage } = require('./utils')

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
          choices: ['Typescript', 'Javascript']
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
      const { styleSelected } = await inquirer.prompt([
        {
          type: 'list',
          name: 'styleSelected',
          prefix: '🏄‍♂️',
          suffix: '',
          message: 'Which style does your project use?',
          choices: ['Css', 'None']
        }
      ])
      const { editorSelected } = await inquirer.prompt([
        {
          type: 'list',
          name: 'editorSelected',
          prefix: '🏄‍♂️',
          suffix: '',
          message: 'Which editor does your project use?',
          choices: ['Vscode', 'None']
        }
      ])

      console.log(chalk.green(`🏄‍♂️ Lavy is starting the setup for your project...`))
      // 根据 options 输出 .eslintrc.js 适配的项目 code
      await changeFile(join(__dirname, 'template', 'eslint.tpl'), join(cwd, '.eslintrc.js'), (str) => {
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
      await mvFile(join(__dirname, 'template', 'editorconfig.tpl'), join(cwd, '.editorconfig'))
      await mvFile(join(__dirname, 'template', 'eslintignore.tpl'), join(cwd, '.eslintignore'))
      await mvFile(join(__dirname, 'template', 'prettierrc.tpl'), join(cwd, '.prettierrc.js'))
      if (languageSelected === 'Typescript') {
        await mvFile(join(__dirname, 'template', 'tsconfig.tpl'), join(cwd, 'tsconfig.json'))
      }
      if (styleSelected === 'Css') {
        await changeFile(join(__dirname, 'template', 'stylelint.tpl'), join(cwd, '.stylelintrc.js'), (str) =>
          str.replace('{{ stylelintPath }}', `'stylelint-config-lavy'`)
        )
      }
      // editor
      if (editorSelected === 'Vscode') {
        await mvFile(join(__dirname, 'template', 'extensions.tpl'), join(cwd, '.vscode', 'extensions.json'))
        await mvFile(join(__dirname, 'template', 'settings.tpl'), join(cwd, '.vscode', 'settings.json'))
      }

      // install package
      await installPackage('eslint-config-lavy')
      if (styleSelected === 'Css') {
        await installPackage('stylelint-config-lavy')
      }

      console.log(chalk.green('Lavy has finished, have a nice journey'), '🌈☀️')
    } catch (error) {
      console.log(chalk.red(error))
      process.exit(1)
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
