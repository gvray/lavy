export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue'
  ],
  
  plugins: [
    'stylelint-order'
  ],
  
  rules: {
    // 颜色
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-named': 'never',
    'color-no-invalid-hex': true,
    
    // 字体
    'font-family-name-quotes': 'always-where-required',
    'font-family-no-duplicate-names': true,
    'font-weight-notation': 'numeric',
    
    // 函数
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'function-name-case': 'lower',
    'function-url-no-scheme-relative': true,
    'function-url-quotes': 'always',
    
    // 数字
    'number-leading-zero': 'always',
    'number-max-precision': 4,
    'number-no-trailing-zeros': true,
    
    // 字符串
    'string-no-newline': true,
    'string-quotes': 'single',
    
    // 长度
    'length-zero-no-unit': true,
    
    // 单位
    'unit-case': 'lower',
    'unit-no-unknown': true,
    
    // 值
    'value-keyword-case': 'lower',
    'value-list-comma-newline-after': 'always-multi-line',
    'value-list-comma-space-after': 'always-single-line',
    'value-list-comma-space-before': 'never',
    'value-list-max-empty-lines': 0,
    'value-no-vendor-prefix': true,
    
    // 属性
    'property-case': 'lower',
    'property-no-vendor-prefix': true,
    'property-no-unknown': true,
    
    // 声明
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-block-semicolon-newline-after': 'always-multi-line',
    'declaration-block-semicolon-space-after': 'always-single-line',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'declaration-colon-newline-after': 'always-multi-line',
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'declaration-empty-line-before': 'never',
    'declaration-no-important': true,
    
    // 声明块
    'declaration-block-no-duplicate-custom-properties': true,
    
    // 块
    'block-closing-brace-empty-line-before': 'never',
    'block-closing-brace-newline-after': 'always',
    'block-closing-brace-newline-before': 'always-multi-line',
    'block-closing-brace-space-after': 'always-single-line',
    'block-closing-brace-space-before': 'always-single-line',
    'block-no-empty': true,
    'block-opening-brace-newline-after': 'always-multi-line',
    'block-opening-brace-space-after': 'always-single-line',
    'block-opening-brace-space-before': 'always',
    
    // 选择器
    'selector-attribute-brackets-space-inside': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-operator-space-before': 'never',
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': null,
    'selector-combinator-space-after': 'always',
    'selector-combinator-space-before': 'always',
    'selector-descendant-combinator-no-non-space': true,
    'selector-id-pattern': null,
    'selector-list-comma-newline-after': 'always',
    'selector-list-comma-space-after': 'always-single-line',
    'selector-list-comma-space-before': 'never',
    'selector-max-empty-lines': 0,
    'selector-no-qualifying-type': true,
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-pseudo-element-case': 'lower',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-pseudo-element-no-unknown': true,
    'selector-type-case': 'lower',
    'selector-type-no-unknown': true,
    
    // 规则
    'rule-empty-line-before': 'always-multi-line',
    
    // 媒体查询
    'media-feature-colon-space-after': 'always',
    'media-feature-colon-space-before': 'never',
    'media-feature-name-case': 'lower',
    'media-feature-name-no-unknown': true,
    'media-feature-name-no-vendor-prefix': true,
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-range-operator-space-before': 'always',
    'media-query-list-comma-newline-after': 'always-multi-line',
    'media-query-list-comma-space-after': 'always-single-line',
    'media-query-list-comma-space-before': 'never',
    
    // 注释
    'comment-empty-line-before': 'always',
    'comment-no-empty': true,
    'comment-whitespace-inside': 'always',
    
    // 一般
    'indentation': 2,
    'linebreaks': 'unix',
    'max-empty-lines': 1,
    'max-line-length': 80,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-eol-whitespace': true,
    'no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,
    'no-missing-end-of-source-newline': true,
    'no-unknown-animations': true,
    
    // 顺序
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'float',
      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'border',
      'border-style',
      'border-width',
      'border-color',
      'border-top',
      'border-top-style',
      'border-top-width',
      'border-top-color',
      'border-right',
      'border-right-style',
      'border-right-width',
      'border-right-color',
      'border-bottom',
      'border-bottom-style',
      'border-bottom-width',
      'border-bottom-color',
      'border-left',
      'border-left-style',
      'border-left-width',
      'border-left-color',
      'border-radius',
      'background',
      'background-color',
      'background-image',
      'background-repeat',
      'background-attachment',
      'background-position',
      'background-size',
      'color',
      'font',
      'font-family',
      'font-size',
      'font-style',
      'font-variant',
      'font-weight',
      'font-stretch',
      'font-size-adjust',
      'line-height',
      'text-align',
      'text-align-last',
      'vertical-align',
      'white-space',
      'text-decoration',
      'text-emphasis',
      'text-emphasis-color',
      'text-emphasis-style',
      'text-emphasis-position',
      'text-indent',
      'text-justify',
      'text-outline',
      'text-transform',
      'text-wrap',
      'text-overflow',
      'text-shadow',
      'letter-spacing',
      'word-spacing',
      'word-wrap',
      'word-break',
      'tab-size',
      'hyphens',
      'pointer-events',
      'cursor',
      'visibility',
      'zoom',
      'opacity',
      'filter',
      'transform',
      'transform-origin',
      'transition',
      'transition-delay',
      'transition-timing-function',
      'transition-duration',
      'transition-property',
      'animation',
      'animation-name',
      'animation-duration',
      'animation-play-state',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
      'animation-direction',
      'content',
      'quotes',
      'counter-reset',
      'counter-increment',
      'resize',
      'user-select',
      'nav-index',
      'nav-up',
      'nav-right',
      'nav-down',
      'nav-left',
      'table-layout',
      'empty-cells',
      'caption-side',
      'border-spacing',
      'border-collapse',
      'list-style',
      'list-style-position',
      'list-style-type',
      'list-style-image',
      'outline',
      'outline-width',
      'outline-style',
      'outline-color',
      'outline-offset',
      'overflow',
      'overflow-x',
      'overflow-y',
      'clip',
      'clear',
      'zoom'
    ]
  }
} 