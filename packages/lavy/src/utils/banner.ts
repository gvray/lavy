import cfonts from 'cfonts'
import boxen from 'boxen'
import { bold, cyan } from 'colorette'

export function showWelcome() {
  cfonts.say('LAVY', {
    font: 'block',
    align: 'center',
    colors: ['cyan']
  })

  console.log(boxen(bold(cyan('🚀 项目初始化工具 - 企业级项目规范引导器')), {
    padding: 1,
    borderColor: 'cyan',
    align: 'center'
  }))
}