import { execa } from 'execa';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupHooks() {
  try {
    // 确保 .git 目录存在
    await execa('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' });
  } catch (e) {
    console.error('❌ 当前目录不是 git 仓库！');
    process.exit(1);
  }

  // 创建 commit-msg hook
  const hookContent = `#!/usr/bin/env node
require('tsx')('${join(__dirname, 'verify-commit.ts')}', process.argv[2])
`;

  const hooksDir = join(process.cwd(), '.git', 'hooks');
  const commitMsgHookPath = join(hooksDir, 'commit-msg');

  try {
    await execa('mkdir', ['-p', hooksDir]);
    await execa('echo', [hookContent], { stdio: 'pipe' }).then(({ stdout }) =>
      execa('echo', [stdout], { stdio: 'pipe' }).then(({ stdout }) =>
        execa('sh', ['-c', `cat > ${commitMsgHookPath}`], { input: stdout })
      )
    );
    await execa('chmod', ['+x', commitMsgHookPath]);
    console.log('✅ Git hooks 设置成功！');
  } catch (e) {
    console.error('❌ Git hooks 设置失败！', e);
    process.exit(1);
  }
}

setupHooks(); 