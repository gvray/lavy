module.exports = {
  extends: ['prettier', 'eslint:recommended', ...['./rules/prettier', './rules/base/es6'].map(require.resolve)],
  parser: '@babel/eslint-parser',
  plugins: ['prettier'],
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
      jsx: true
    }
  },
  root: true
}
