import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';

export default defineConfig([
  {
    plugins: {
      '@next/next': pluginNext,
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // ESLint’s own recommended JS rules:
      ...js.configs.recommended.rules,
      // Next.js’s recommended + Core Web Vitals sets:
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,

      // Your template’s custom rules:
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]);
