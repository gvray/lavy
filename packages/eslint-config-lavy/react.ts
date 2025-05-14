module.exports = {
	extends: ["./index", "./rules/react"],
	parserOptions: {
		babelOptions: {
			presets: ["@babel/preset-react"],
		},
	},
};
