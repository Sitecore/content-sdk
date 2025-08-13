// eslint.config.mjs (updated)
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import * as nextNS from '@next/eslint-plugin-next'
import tsParser from '@typescript-eslint/parser'
import * as tsNS from '@typescript-eslint/eslint-plugin'
import * as importNS from 'eslint-plugin-import'
import * as hooksNS from 'eslint-plugin-react-hooks'
import globals from 'globals'

// normalize CJS/ESM shapes
const pluginNext = nextNS.default ?? nextNS
const tsPlugin = tsNS.default ?? tsNS
const importPlugin = importNS.default ?? importNS
const reactHooks = hooksNS.default ?? hooksNS

export default defineConfig([
  // common ignores
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'build/**', 'coverage/**'],
  },

  // core ESLint recommended rules
  js.configs.recommended,

  // register plugins (applies to all files)
  {
    plugins: {
      '@next/next': pluginNext,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'react-hooks': reactHooks,
    },
  },

  // project rules
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
        ...(globals.node ?? {}),
        ...(globals.browser ?? {}),
        ...(globals.es2021 ?? {}), // guarded to avoid "Cannot convert undefined or null to object"
        URL: 'readonly',
      },
    },
    settings: {
      // helps eslint-plugin-import resolve TS paths
      'import/resolver': { typescript: {} },
    },
    rules: {
      // Next.js
      ...(pluginNext.configs?.recommended?.rules ?? {}),
      ...(pluginNext.configs?.['core-web-vitals']?.rules ?? {}),
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-sync-scripts': 'off',
      '@next/next/no-assign-module-variable': 'off',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // Plugins
      'import/no-anonymous-default-export': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',

      // Preferences
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
])
