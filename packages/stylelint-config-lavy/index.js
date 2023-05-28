module.exports = {
  defaultSeverity: 'warning',
  extends: ['stylelint-config-standard'],
  rules: {
    indentation: 2,
    'at-rule-no-unknown': null,
    'color-no-invalid-hex': true,
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/^v-/']
      }
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes']
      }
    ],
    'no-empty-source': null
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']
}
