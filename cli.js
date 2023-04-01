#!/usr/bin/env node

const { Command } = require('commander')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const chalk = require('chalk')
const { existsSync } = require('fs')
const { join } = require('path')
const packageJson = require('./package.json')

const cwd = process.cwd()
const program = new Command()

const rcs = ['.editorconfig', '.prettierrc.js', '.eslintrc.js', '.stylelintrc.js']

program.name(packageJson.name).description(packageJson.description).version(packageJson.version, '-v, --version')

program
  .command('init')
  .description('initialization')
  .option('-y, --yes', 'Skip installation query')
  .action((options) => {
    if (options.yes) {
      rcs.forEach((format) => changeFile(join(__dirname, 'dist', format), join(cwd, `${format}`)))
    } else {
      inquirer
        .prompt([
          {
            type: 'checkbox',
            message: 'Start your journey:',
            name: 'formats',
            default: ['editorconfig', 'prettierrc', 'eslintrc', 'stylelintrc'],
            prefix: '🏄‍♂️',
            suffix: '',
            choices: rcs.map((item) => item.replace(/(^\.|\.js$)/g, ''))
          }
        ])
        .then(({ formats }) => {
          rcs
            .filter((item) => formats.join('').includes(item.replace(/(^\.|\.js$)/g, '')))
            .forEach((format) => changeFile(join(__dirname, 'dist', format), join(cwd, `${format}`)))
        })
    }
  })

program.parse()

async function changeFile(src, dest) {
  try {
    const data = await fs.readFile(src)
    const str = data.toString().replace("require('./dist/index')", `require(${packageJson.name})`)
    await fs.writeFile(dest, str)
  } catch (error) {}
}
