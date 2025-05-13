/**
 * 本文件的规则由 eslint-plugin-import 提供
 * 与 eslint-plugin-import 推荐配置对齐
 * @see https://github.com/import-js/eslint-plugin-import
 * @see https://github.com/import-js/eslint-plugin-import/blob/main/config/recommended.js
 */

module.exports = {
	plugins: ["import"],

	rules: {
		// analysis/correctness
		"import/no-unresolved": "error",
		"import/named": "error",
		"import/namespace": "error",
		"import/default": "error",
		"import/export": "error",

		// red flags (thus, warnings)
		"import/no-named-as-default": "warn",
		"import/no-named-as-default-member": "warn",
		"import/no-duplicates": "warn",
	},
};
