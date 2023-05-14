const fs = require('fs-extra')
const packageJson = require('../package.json')

async function mvFile(src, dest) {
  try {
    const content = await fs.readFile(src)
    await fs.writeFile(dest, content)
  } catch (error) {
    console.log(error)
  }
}

async function changeFile(src, dest) {
  try {
    const data = await fs.readFile(src)
    const str = data.toString().replace("require('./dist/index')", `require(${packageJson.name})`)
    await fs.writeFile(dest, str)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  mvFile,
  changeFile
}
