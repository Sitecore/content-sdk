import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig([
  {
    plugins: {
      '@next/next': pluginNext,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'react-hooks': reactHooks,
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // bring in Node + Browser + modern JS globals
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        // ensure URL is defined
        URL: 'readonly',
      },
    },
    rules: {
      // ESLint’s own recommended JS rules
      ...js.configs.recommended.rules,
      // Next.js “recommended” + “core-web-vitals”
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
      // TypeScript-specific unused‐vars rule
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      'no-undef': 'off',
      // import+react-hooks rules now that the plugins are loaded
      'import/no-anonymous-default-export': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      // custom prefs
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]);
