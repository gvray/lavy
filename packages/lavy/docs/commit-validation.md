# Git 提交信息验证功能

## 概述

Lavy 提供了强大的 Git 提交信息验证功能，帮助团队保持一致的提交信息格式。该功能完全自定义，不依赖外部库，可以根据项目需求灵活配置。

## 功能特性

- ✅ **多种提交类型支持**：feat、fix、docs、style、refactor、perf、test、build、ci、chore、revert
- ✅ **可选的 scope 支持**：如 `feat(auth): 添加登录功能`
- ✅ **长度限制**：提交信息总长度不超过 72 个字符
- ✅ **格式验证**：自动检查格式是否符合规范
- ✅ **自定义规则**：支持添加项目特定的验证规则
- ✅ **详细错误提示**：提供清晰的错误信息和正确格式示例
- ✅ **合并提交跳过**：自动跳过合并提交的验证
- ✅ **配置文件支持**：通过 `lavy.config.js` 自定义验证规则
- ✅ **CLI 命令**：提供丰富的命令行工具

## CLI 命令

### 基本用法

```bash
# 验证当前提交信息
lavy commit

# 验证指定的提交信息
lavy commit -m "feat: 添加新功能"

# 交互模式
lavy commit --interactive

# 运行测试用例
lavy commit --test

# 显示当前配置
lavy commit --config

# 初始化配置文件
lavy commit --init
```

### 命令选项

| 选项                  | 简写 | 说明               |
| --------------------- | ---- | ------------------ |
| `--message <message>` | `-m` | 验证指定的提交信息 |
| `--test`              | `-t` | 运行测试用例       |
| `--init`              | `-i` | 初始化配置文件     |
| `--config`            | `-c` | 显示当前配置       |
| `--interactive`       | -    | 交互模式           |

## 配置文件

### 创建配置文件

```bash
lavy commit --init
```

### 配置文件示例

```javascript
// lavy.config.js
export default {
  commit: {
    // 自定义验证规则
    rules: [
      // 不允许以感叹号结尾
      {
        pattern: /^[a-z]+: .*[^!]$/,
        message: '提交信息不能以感叹号结尾',
        examples: ['feat: 新功能', 'fix: 修复问题'],
      },
      // 不允许使用中文标点符号
      {
        pattern: /^[a-z]+: [^，。！？]*$/,
        message: '提交信息不能包含中文标点符号',
        examples: ['feat: 添加新功能', 'fix: 修复登录问题'],
      },
    ],

    // 允许的提交类型（可以添加自定义类型）
    types: [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'build',
      'ci',
      'chore',
      'revert',
      'hotfix',
      'release', // 自定义类型
    ],

    // 最大长度限制
    maxLength: 80,

    // 是否允许合并提交
    allowMergeCommits: true,

    // 自定义正则表达式模式
    customPatterns: [
      // 示例：要求 scope 不能为空
      // /^[a-z]+\([^)]+\): .+$/
    ],
  },
}
```

### 配置选项说明

| 选项                | 类型           | 默认值       | 说明                 |
| ------------------- | -------------- | ------------ | -------------------- |
| `rules`             | `CommitRule[]` | `[]`         | 自定义验证规则       |
| `types`             | `string[]`     | 标准11种类型 | 允许的提交类型       |
| `maxLength`         | `number`       | `72`         | 最大长度限制         |
| `allowMergeCommits` | `boolean`      | `true`       | 是否允许合并提交     |
| `customPatterns`    | `RegExp[]`     | `[]`         | 自定义正则表达式模式 |

## 使用方法

### 1. 基本使用

```typescript
import { commitValidator } from '@lavy/utils'

const result = commitValidator.validate('feat: 添加新功能')
if (result.isValid) {
  console.log('✅ 验证通过')
} else {
  console.log('❌ 验证失败')
  for (const error of result.errors) {
    console.log(error)
  }
}
```

### 2. 创建自定义验证器

```typescript
import { CommitValidator } from '@lavy/utils'

const customValidator = new CommitValidator()

// 添加自定义规则
customValidator.addRule({
  pattern: /^[a-z]+: .*[^!]$/, // 不允许以感叹号结尾
  message: '提交信息不能以感叹号结尾',
  examples: ['feat: 新功能', 'fix: 修复问题'],
})

const result = customValidator.validate('feat: 新功能!')
```

### 3. 格式化提交信息

```typescript
import { commitValidator } from '@lavy/utils'

const formatted = commitValidator.formatCommitMessage(
  'feat',
  '添加新功能',
  'auth',
)
console.log(formatted) // 输出: feat(auth): 添加新功能
```

## 提交信息格式

### 标准格式

```
<type>(<scope>): <subject>
```

### 类型说明

| 类型     | 说明      | 示例                         |
| -------- | --------- | ---------------------------- |
| feat     | 新功能    | `feat: 添加用户登录功能`     |
| fix      | 修复bug   | `fix(api): 修复数据获取问题` |
| docs     | 文档更新  | `docs: 更新 README 文档`     |
| style    | 代码格式  | `style: 格式化代码`          |
| refactor | 重构      | `refactor: 重构用户模块`     |
| perf     | 性能优化  | `perf: 优化查询性能`         |
| test     | 增加测试  | `test: 添加用户模块测试`     |
| build    | 构建配置  | `build: 更新构建配置`        |
| ci       | CI/CD配置 | `ci: 添加 GitHub Actions`    |
| chore    | 其他改动  | `chore: 更新依赖版本`        |
| revert   | 回滚提交  | `revert: 回滚到上一个版本`   |

### 规则说明

1. **类型必须小写**：不能以大写字母开头
2. **scope 可选**：用括号包围，如 `(auth)`
3. **冒号后必须有空格**：格式为 `type: subject`
4. **描述长度限制**：不超过配置的最大长度
5. **不能以句号结尾**：避免不必要的标点符号

## 错误示例

```bash
# ❌ 错误的格式
update something
Feat: 大写开头
feat: 这是一个非常长的提交信息描述，超过了字符限制
feat: 以句号结尾.

# ✅ 正确的格式
feat: 添加新功能
fix(login): 修复登录问题
docs: 更新文档
```

## 集成到项目

### 1. 安装依赖

```bash
npm install --save-dev husky lint-staged tsx
```

### 2. 设置 Git Hooks

```bash
npx husky install
npx husky add .husky/commit-msg 'npx tsx scripts/verify-commit.ts "$1"'
```

### 3. 创建配置文件

```bash
lavy commit --init
```

### 4. 运行测试

```bash
lavy commit --test
```

## API 参考

### CommitValidator 类

#### 方法

- `validate(message: string): ValidationResult` - 验证提交信息
- `addRule(rule: CommitRule): void` - 添加自定义验证规则
- `formatCommitMessage(type: string, subject: string, scope?: string): string` - 格式化提交信息
- `getTypeDescription(): string` - 获取类型说明
- `getConfig(): CommitConfig` - 获取当前配置
- `updateConfig(newConfig: Partial<CommitConfig>): void` - 更新配置

#### 接口

```typescript
interface CommitRule {
  pattern: RegExp
  message: string
  examples?: string[]
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface CommitConfig {
  rules: CommitRule[]
  types: string[]
  maxLength: number
  allowMergeCommits: boolean
  customPatterns: RegExp[]
}
```

## 最佳实践

1. **团队统一**：确保团队成员都了解并遵循提交信息规范
2. **自动化**：使用 Git hooks 自动验证，避免手动检查
3. **文档化**：在项目 README 中说明提交信息规范
4. **渐进式**：可以逐步添加更严格的验证规则
5. **自定义**：根据项目特点添加特定的验证规则
6. **配置文件**：使用 `lavy.config.js` 管理项目特定的验证规则

## 故障排除

### 常见问题

1. **验证脚本无法运行**

   - 确保已安装 `tsx` 依赖
   - 检查文件路径是否正确

2. **Git hooks 不生效**

   - 确保 `.git/hooks` 目录存在
   - 检查 hook 文件是否有执行权限

3. **自定义规则不生效**

   - 检查正则表达式语法
   - 确保规则添加顺序正确

4. **配置文件不生效**
   - 确保 `lavy.config.js` 在项目根目录
   - 检查配置文件语法是否正确

### 调试模式

```typescript
import { commitValidator } from '@lavy/utils'

// 启用详细日志
const result = commitValidator.validate('test message')
console.log('验证结果:', JSON.stringify(result, null, 2))
```
