const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: {
      'only-warn': require('eslint-plugin-only-warn'),
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: ['customrenderedcomponents'], style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: ['customrenderedcomponents'], style: 'camelCase' }],
      '@angular-eslint/use-lifecycle-interface': 'off',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
      '@typescript-eslint/naming-convention': ['error', { selector: 'property', modifiers: ['readonly', 'static'], format: ['UPPER_CASE'] }],
      'brace-style': ['error', '1tbs'],
      'curly': 'off',
      'id-blacklist': 'off',
      'id-match': 'off',
      'max-len': ['error', { code: 200 }],
      'no-underscore-dangle': 'off',
      'valid-typeof': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
