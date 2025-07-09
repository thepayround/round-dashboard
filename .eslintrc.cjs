/**
 * ESLint Configuration for Round Dashboard
 *
 * This configuration prioritizes functionality over strict import resolution
 * to prevent pre-commit hook failures while maintaining code quality.
 */

module.exports = {
  root: true,

  // Define environments
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  // Extended rule sets - simplified to avoid import resolver issues
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },

  plugins: ['react', 'react-hooks', 'react-refresh', '@typescript-eslint', 'jsx-a11y'],

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'warn',
    'react/jsx-no-useless-fragment': 'warn',
    'react/self-closing-comp': 'warn',
    'react/jsx-boolean-value': ['warn', 'never'],
    'react/function-component-definition': ['warn', { namedComponents: 'arrow-function' }],
    'react/no-unescaped-entities': 'error',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

    // General code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'warn',
    'prefer-destructuring': 'warn',
    'prefer-template': 'warn',
    'no-nested-ternary': 'warn',
    'no-unneeded-ternary': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    'no-useless-escape': 'error',

    // Security-related rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // React Fast Refresh
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },

  // Override rules for specific file patterns
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/test/**/*', '**/setup.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'react-refresh/only-export-components': 'off',
      },
    },
    {
      files: ['vite.config.ts', '*.config.{js,ts}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
