import prompts from 'prompts'
import { isInGitRepository } from '../utils/git-utils.js'

export async function promptOptions() {
  // 检查是否为 Git 项目
  const isGitProject = await isInGitRepository()

  const questions: prompts.PromptObject[] = [
    {
      type: 'select',
      name: 'language',
      message: '选择开发语言',
      choices: [
        { title: 'TypeScript', value: 'ts' },
        { title: 'JavaScript', value: 'js' },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'framework',
      message: '选择框架',
      choices: [
        { title: 'React', value: 'react' },
        { title: 'Vue', value: 'vue' },
        { title: 'None', value: 'none' },
      ],
    },
    {
      type: 'select',
      name: 'style',
      message: '选择样式预处理器',
      choices: [
        { title: 'SCSS', value: 'scss' },
        { title: 'LESS', value: 'less' },
        { title: 'CSS', value: 'css' },
        { title: 'None', value: 'none' },
      ],
    },
    {
      type: 'select',
      name: 'platform',
      message: '选择运行平台',
      choices: [
        { title: 'Browser', value: 'browser' },
        { title: 'Node', value: 'node' },
        { title: 'Universal (两者都支持)', value: 'universal' },
      ],
      initial: 0,
    },
    // 新增：选择代码检查工具
    {
      type: 'select',
      name: 'linter',
      message: '选择代码检查工具',
      choices: [
        { title: 'ESLint + Prettier', value: 'eslint' },
        { title: 'Biome', value: 'biome' },
      ],
      initial: 0,
    },
  ]

  // 只有在 Git 项目中才显示 commitlint 选项
  if (isGitProject) {
    questions.push({
      type: 'toggle',
      name: 'useCommitLint',
      message: '是否启用 commitlint 规范？（←→ 切换，回车确认）',
      initial: true,
      active: '启用',
      inactive: '跳过',
    })
  }

  return prompts(questions, {
    onCancel: () => {
      console.log('\n❌ 用户取消输入，已退出。')
      process.exit(1)
    },
  })
}
