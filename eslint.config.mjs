import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';

import prettier from 'eslint-plugin-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  // Global ignores
  globalIgnores([
    'lib/',
    'packages/*/node_modules/',
    'packages/*/lib/',
    'packages/*/dist/',
    'packages/create-content-sdk-app/src/templates/**/*',
  ]),

  // React hooks configuration for ESLint v9+
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...reactHooks.configs['recommended-latest'],
  },

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
      '@typescript-eslint': typescriptEslint,
      '@stylistic/ts': stylisticTs,
      prettier,
      jsdoc,
      import: importPlugin,
    },
    rules: {
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
      'linebreak-style': ['error', 'windows'],
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
      '@stylistic/ts/space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],

      // Import rules
      'import/no-anonymous-default-export': 'warn',
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
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
      ],
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/typedef': 'error',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false, variables: false }],
      '@stylistic/ts/type-annotation-spacing': 'error',
      '@stylistic/ts/semi': 'error',

      // Relaxed TS rules
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
]);
