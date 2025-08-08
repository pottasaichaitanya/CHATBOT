import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true, // Enables browser globals like document, localStorage
        es2021: true,
        node: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off', // Disable prop-types if not used
      'react/react-in-jsx-scope': 'error', // Enforce React import for JSX (React < 17)
      quotes: ['error', 'double'], // Enforce double quotes
      semi: ['error', 'always'], // Enforce semicolons
      'no-unused-vars': 'warn', // Warn on unused variables
      'no-undef': 'error', // Ensure undefined variables are caught
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
  },
];