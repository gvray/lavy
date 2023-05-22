const fs = require('fs-extra')

async function mvFile(src, dest) {
  try {
    const content = await fs.readFile(src)
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

module.exports = {
  mvFile,
  changeFile
}
