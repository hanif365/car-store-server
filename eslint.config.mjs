import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Variables
      'no-unused-vars': 'error', // Disallow unused variables
      'no-undef': 'error', // Disallow use of undeclared variables

      // Imports
      'no-duplicate-imports': 'error', // Disallow duplicate imports

      // Variables declaration
      'no-var': 'error', // Require let or const instead of var
      'prefer-const': 'error', // Suggest using const for variables that are never reassigned
      'no-const-assign': 'error', // Disallow reassigning const variables

      // Code style
      'no-unused-expressions': 'error', // Disallow unused expressions
      'no-multiple-empty-lines': ['error', { max: 1 }], // Limit consecutive empty lines
      'no-trailing-spaces': 'error', // Disallow trailing whitespace
      'eol-last': 'error', // Require newline at the end of files
      'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline

      // Console usage
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow only console.warn and console.error
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage'],
  },
];
