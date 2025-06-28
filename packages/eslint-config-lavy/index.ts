// src/index.ts
import type {Linter} from "eslint"; // Optional typing
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

export const recommended: Linter.Config[] = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {},
    rules: {
      ...pluginTs.configs.recommended.rules, // ⬅️ 官方推荐规则
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

// 允许 default 导出（方便引用）
export default {
  recommended,
};
