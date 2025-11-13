// Centralized execa wrapper for the lavy project.
// Works with execa v5 (default export, CommonJS) and v6+/v8 (named export, ESM-only).
// Always import from this module elsewhere: `import { execa } from '../utils/execa'`

import * as execaModule from 'execa'

// Runtime fallback: prefer named export, then default, then module itself.
const execaImpl =
  (execaModule as any).execa ?? (execaModule as any).default ?? (execaModule as any)

export const execa = execaImpl as any