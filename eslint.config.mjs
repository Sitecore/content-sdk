import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import prettier from "eslint-plugin-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores([
        "lib/", 
        "packages/*/node_modules/", 
        "packages/*/lib/", 
        "packages/*/dist/",
        "packages/create-content-sdk-app/src/templates/**/*",
    ]),
    
    // Global settings
    {
        linterOptions: {
            reportUnusedDisableDirectives: false,
        },
    },
    
    // Base configuration for all JavaScript/TypeScript files
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        extends: compat.extends(
            "eslint:recommended",
            "plugin:jsdoc/recommended",
            "prettier",
        ),

        plugins: {
            "@typescript-eslint": typescriptEslint,
            "@stylistic/ts": stylisticTs,
            prettier,
            import: importPlugin,
            "react-hooks": reactHooks,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                RequestInit: "readonly", // From typescript config
            },

            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        rules: {
            "jsdoc/newline-after-description": "off",
            "jsdoc/require-property-description": "off",
            "jsdoc/require-param-description": "off",
            "jsdoc/require-returns": "off",
            "jsdoc/no-undefined-types": "off",
            "jsdoc/require-returns-type": "off",
            "prettier/prettier": "error",
            "no-use-before-define": "off",
            "no-useless-escape": "off",
            "spaced-comment": "error",
            curly: ["error", "multi-line"],
            "eol-last": ["error", "always"],
            "linebreak-style": ["error", "windows"],
            "guard-for-in": "error",
            "no-unused-labels": "error",
            "no-caller": "error",
            "no-bitwise": "error",
            "no-multiple-empty-lines": "error",
            "no-new-wrappers": "error",
            "no-eval": "error",
            "dot-notation": "error",
            "no-trailing-spaces": "error",

            "no-unused-expressions": ["error", {
                allowShortCircuit: true,
                allowTernary: true,
            }],

            "no-unused-vars": ["error"],
            "brace-style": "error",
            quotes: ["error", "single"],
            radix: "error",
            "default-case": "error",
            eqeqeq: "error",
            "jsx-quotes": ["error", "prefer-double"],
        },
    },

    // TypeScript-specific configuration for all packages
    {
        files: ["packages/**/*.{ts,tsx}"],
        extends: compat.extends("plugin:@typescript-eslint/recommended"),
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    format: ["PascalCase"],
                    selector: "typeLike",
                    custom: {
                        regex: "^I[A-Z]",
                        match: false,
                    },
                },
            ],
            "@typescript-eslint/member-ordering": "error",
            "@typescript-eslint/no-use-before-define": ["error", { functions: false, variables: false }],
            "@typescript-eslint/typedef": "error",
            "@stylistic/ts/type-annotation-spacing": "error",
            "@stylistic/ts/semi": "error",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
        },
    },

    // React-specific configuration for React and NextJS packages
    {
        files: ["packages/react/**/*.{jsx,tsx}", "packages/nextjs/**/*.{jsx,tsx}"],
        ...compat.extends("plugin:react/recommended")[0],
        settings: {
            react: {
                version: "detect",
            },
        },
        languageOptions: {
            globals: {
                React: "writable",
                JSX: "readonly",
            },
        },
    },
]);