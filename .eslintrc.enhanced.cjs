/**
 * Enhanced ESLint Configuration for Round Dashboard
 * 
 * This is an improved version with additional rules and plugins for better code quality.
 * To use this configuration, rename it to .eslintrc.cjs and install the required packages.
 */

module.exports = {
  root: true,
  
  // Define environments
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  
  // Extended rule sets (order matters - later configs override earlier ones)
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',      // React hooks rules
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // Stricter TS rules
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:security/recommended',         // Security rules
    'plugin:sonarjs/recommended',          // Code smell detection
    'plugin:unicorn/recommended',          // Modern JS best practices
    'plugin:prettier/recommended',         // Must be last
  ],
  
  parser: '@typescript-eslint/parser',
  
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',           // Required for type-aware rules
    tsconfigRootDir: __dirname,
  },
  
  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
    '@typescript-eslint',
    'jsx-a11y',
    'import',
    'security',
    'sonarjs',
    'unicorn',
    'prefer-arrow',                       // Prefer arrow functions
    'no-loops',                          // Discourage loops (prefer functional)
    'prettier',
  ],
  
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',
    
    // React rules
    'react/react-in-jsx-scope': 'off',    // Not needed with new JSX transform
    'react/prop-types': 'off',            // TypeScript handles this
    'react/jsx-props-no-spreading': 'warn', // Warn on prop spreading
    'react/jsx-no-useless-fragment': 'warn',
    'react/self-closing-comp': 'warn',
    'react/jsx-boolean-value': ['warn', 'never'],
    'react/function-component-definition': [
      'warn',
      { namedComponents: 'arrow-function' }
    ],
    
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports' }
    ],
    
    // Import organization
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',
    'import/prefer-default-export': 'off',
    
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
    
    // Arrow functions
    'prefer-arrow/prefer-arrow-functions': [
      'warn',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    'arrow-body-style': ['warn', 'as-needed'],
    
    // Discourage loops (prefer functional programming)
    'no-loops/no-loops': 'warn',
    
    // Modern JavaScript practices
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    'unicorn/no-null': 'off',             // Allow null in React
    'unicorn/prevent-abbreviations': 'off', // Allow common abbreviations
    'unicorn/no-array-reduce': 'off',     // Allow reduce
    
    // Performance
    'sonarjs/cognitive-complexity': ['warn', 15],
    'sonarjs/no-duplicate-string': ['warn', 3],
    
    // Security
    'security/detect-object-injection': 'warn',
    
    // Accessibility
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    
    // React Fast Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  
  // Override rules for specific file patterns
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'sonarjs/no-duplicate-string': 'off',
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