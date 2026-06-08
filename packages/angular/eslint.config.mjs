/**
 *  Extends the shared Content SDK flat config (repo-wide TypeScript + base rules) and adds
 * only Angular-specific config: angular-eslint recommended, processor for inline templates,
 * and library overrides (e.g. component-selector off for sc-*, test-*).
 * @see https://github.com/angular-eslint/angular-eslint/blob/main/docs/CONFIGURING_FLAT_CONFIG.md
 */
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import config from '../../eslint.config.mjs';

export default tseslint.config(
  // Shared repo config (TypeScript + base rules; test files get relaxed rules from createConfig)
  ...config,
  // Angular overlay: source .ts files — add Angular recommended, processor, and library overrides
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.server.json', './tsconfig.spec.json'],
        createDefaultProgram: true,
      },
    },
    rules: {
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // Angular overlay: spec files — Angular recommended, Jasmine globals, same overrides (no processor)
  {
    files: ['src/**/*.spec.ts'],
    extends: [...angular.configs.tsRecommended],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.spec.json'],
        createDefaultProgram: true,
      },
      globals: {
        jasmine: 'readonly',
        spyOn: 'readonly',
        spyOnProperty: 'readonly',
        expectAsync: 'readonly',
        DoneFn: 'readonly',
        pending: 'readonly',
        fail: 'readonly',
      },
    },
    rules: {
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
    },
  },
  // Angular templates (external .html and inline via processor above)
  {
    files: ['src/**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  }
);
