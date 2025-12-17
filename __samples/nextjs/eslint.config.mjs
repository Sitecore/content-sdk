// packages/create-content-sdk-app/src/templates/nextjs/eslint.config.mjs
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import * as nextEslintPlugin from '@next/eslint-plugin-next'
import tsParser from '@typescript-eslint/parser'
import * as tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import * as importEslintPlugin from 'eslint-plugin-import'
import * as reactHooksEslintPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

// Normalize ESM/CJS shapes to plugin objects
const nextPlugin = nextEslintPlugin.default ?? nextEslintPlugin
const tsPlugin = tsEslintPlugin.default ?? tsEslintPlugin
const importPlugin = importEslintPlugin.default ?? importEslintPlugin
const reactHooksPlugin = reactHooksEslintPlugin.default ?? reactHooksEslintPlugin

export default defineConfig([
  // ignores
  { ignores: ['node_modules/**', '.next/**', 'dist/**', 'build/**', 'coverage/**'] },

  // core ESLint recommended
  js.configs.recommended,

  // register plugins (applies to all files)
  {
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'react-hooks': reactHooksPlugin,
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
      'import/resolver': { typescript: {} },
    },
    rules: {
      // Next.js
      ...(nextPlugin.configs?.recommended?.rules ?? {}),
      ...(nextPlugin.configs?.['core-web-vitals']?.rules ?? {}),
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

      // Temporary: ignore escapes in strings/regex to align with new-starter components
      'no-useless-escape': 'off',
    },
  },
])
