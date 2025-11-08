import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export type ProjectPlatform = 'node' | 'browser' | 'universal'

export function getProjectPlatform(): ProjectPlatform {
  try {
    const tryFiles = ['lavy.config.js', 'lavy.config.ts']
    for (const fname of tryFiles) {
      const configPath = join(process.cwd(), fname)
      if (existsSync(configPath)) {
        const content = readFileSync(configPath, 'utf-8')
        const platform = content.match(/platform\s*:\s*['\"](node|browser|universal)['\"]/i)?.[1]
        if (platform === 'node' || platform === 'browser' || platform === 'universal') {
          return platform
        }
      }
    }
  } catch {}
  return 'browser'
}