import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';

import prettier from 'eslint-plugin-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import pluginNext from '@next/eslint-plugin-next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  // Global ignores
  globalIgnores([
    'lib/',
    'packages/*/node_modules/',
    'packages/*/lib/',
    'packages/*/dist/',
    'packages/create-content-sdk-app/src/templates/**/*',
    'packages/create-content-sdk-app/src/templates/**/*.json',
  ]),

  // Global linter settings
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },

  // Base JS/TS config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        es6: true,
      },
    },
    plugins: {
      '@next/next': pluginNext,
      '@typescript-eslint': typescriptEslint,
      '@stylistic': stylistic,
      'react-hooks': reactHooks,
      import: importPlugin,
      prettier,
      jsdoc,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-sync-scripts': 'off',
      '@next/next/no-assign-module-variable': 'off',
      // Include ESLint recommended rules
      ...js.configs.recommended.rules,
      // Include JSDoc recommended rules
      ...jsdoc.configs.recommended.rules,
      // JSDoc relaxations
      'jsdoc/newline-after-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-returns-type': 'off',

      // General
      'no-use-before-define': 'off',
      'no-useless-escape': 'off',
      'no-unused-vars': ['error'],
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'spaced-comment': 'error',
      curly: ['error', 'multi-line'],
      'eol-last': ['error', 'always'],
      'guard-for-in': 'error',
      'no-unused-labels': 'error',
      'no-caller': 'error',
      'no-bitwise': 'error',
      'no-multiple-empty-lines': 'error',
      'no-new-wrappers': 'error',
      'no-eval': 'error',
      'dot-notation': 'error',
      'no-trailing-spaces': 'error',
      'brace-style': 'error',
      quotes: ['error', 'single'],
      radix: 'error',
      'default-case': 'error',
      eqeqeq: 'error',
      'jsx-quotes': ['error', 'prefer-double'],

      // Formatting
      'prettier/prettier': 'off', // handled via specific rules below
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/no-anonymous-default-export': 'error',

      // Prettier conflict resolution - must come LAST to override conflicting rules
      ...eslintConfigPrettier.rules,
    },
  },

  // TypeScript-specific overrides
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
      ],
      'no-undef': 'off',
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/typedef': 'error',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false, variables: false }],
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/semi': 'error',

      // Relaxed TS rules
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // Jest test files: enable Jest globals (describe, it, beforeEach, etc.)
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest
      },
    },
  },
]);
