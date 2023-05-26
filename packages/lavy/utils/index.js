const fs = require('fs-extra')
const { spawn } = require('cross-spawn')
const chalk = require('chalk')

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

async function installPackage(...dependencies) {
  const command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm'

  const childProcess = spawn(command, ['install', '-D'].concat(...dependencies), { stdio: 'inherit' })

  childProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(chalk.red('Error occurred while installing dependencies!'), code)
      process.exit(1)
    } else {
      console.log(chalk.cyan('Install finished'))
    }
  })
}

module.exports = {
  mvFile,
  changeFile,
  installPackage
}
