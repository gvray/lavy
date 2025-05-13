module.exports = {
	extends: [
		"prettier",
		"eslint:recommended",
		// 'plugin:import/recommended',
		...[
			"./rules/prettier",
			"./rules/base/variables",
			"./rules/base/es6",
			"./rules/base/strict",
			"./rules/imports",
		].map(require.resolve),
	],
	parser: "@babel/eslint-parser",
	plugins: ["prettier"],
	parserOptions: {
		requireConfigFile: false,
		ecmaVersion: 2020,
		sourceType: "module",
		ecmaFeatures: {
			globalReturn: false,
			impliedStrict: true,
			jsx: true,
		},
	},
	root: true,
};
