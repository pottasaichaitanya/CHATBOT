export default {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': 'off', // Disable prop-types if not used
    quotes: ['error', 'double'], // Enforce double quotes
    semi: ['error', 'always'], // Enforce semicolons
    'no-unused-vars': 'warn', // Optional: Warn on unused variables
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
};