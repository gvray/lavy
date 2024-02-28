const fs = require('fs-extra')
const { spawn } = require('cross-spawn')
const chalk = require('chalk')
const emoji = require('./emoji')

async function mvFile(src, dest) {
  try {
    const content = await fs.readFile(src)
    await fs.ensureFile(dest)
    await fs.writeFile(dest, content)
  } catch (error) {
    return Promise.reject(error)
  }
}

async function changeFile(src, dest, pipe) {
  try {
    const data = await fs.readFile(src)
    const str = pipe(data.toString())
    await fs.writeFile(dest, str)
  } catch (error) {
    return Promise.reject(error)
  }
}

function installPackage(...dependencies) {
  return new Promise((resolve, reject) => {
    let command
    if (fs.existsSync('yarn.lock')) {
      command = /^win/.test(process.platform) ? 'yarn.cmd' : 'yarn'
    } else if (fs.existsSync('pnpm-lock.yaml')) {
      command = /^win/.test(process.platform) ? 'pnpm.cmd' : 'pnpm'
    } else {
      command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm'
    }

    // 根据选择的包管理器，确定使用的命令
    let installCommand
    if (command.includes('yarn')) {
      installCommand = ['add', '-D']
    } else if (command.includes('pnpm')) {
      if (fs.existsSync('pnpm-workspace.yaml')) {
        installCommand = ['add', '-D', '-w']
      } else {
        installCommand = ['add', '-D']
      }
    } else {
      installCommand = ['install', '-D']
    }

    const childProcess = spawn(command, installCommand.concat(...dependencies), { stdio: 'inherit' })

    childProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(chalk.red('Error occurred while installing dependencies!'), `with code ${code}`)
        reject(
          `❌ Unable to install dependencies, manually install dependencies according to the specific conditions of your project, such as npm yarn or pnpm, the next dependencies you need to see ${dependencies.toString()} 🔧`
        )
        // process.exit(1)
      } else {
        console.log(chalk.cyan(`Install finished with ${dependencies.toString()}`))
        resolve(...dependencies)
      }
    })
  })
}

function removeComment(msg) {
  return msg.replace(/^#.*[\n\r]*/gm, '')
}

module.exports = {
  mvFile,
  changeFile,
  installPackage,
  removeComment,
  emoji
}
