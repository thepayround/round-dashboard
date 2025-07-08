/**
 * ESLint Configuration for Round Dashboard
 * 
 * PURPOSE:
 * ESLint is a static code analysis tool that identifies and reports patterns in JavaScript/TypeScript code.
 * It helps maintain code quality, consistency, and catch potential bugs before runtime.
 * 
 * WHEN TO MODIFY:
 * - Adding new coding standards or rules
 * - Integrating with new frameworks or libraries
 * - Adjusting rule severity (error, warn, off)
 * - Adding custom rules for team-specific patterns
 * 
 * CONFIGURATION OPTIONS:
 * - env: Defines global variables for specific environments (browser, node, es6, etc.)
 * - extends: Inherits rules from popular rule sets (airbnb, standard, recommended)
 * - parser: Specifies which parser to use (@typescript-eslint/parser, babel-eslint, etc.)
 * - plugins: Extends ESLint with additional rules (react, jsx-a11y, import, etc.)
 * - rules: Override or add specific rules with custom severity levels
 * - ignorePatterns: Files/directories to exclude from linting
 * - parserOptions: Parser-specific options (ecmaVersion, sourceType, etc.)
 * 
 * ALTERNATIVE CONFIGURATIONS:
 * - For React projects: Add 'plugin:react/recommended', 'plugin:react-hooks/recommended'
 * - For accessibility: Add 'plugin:jsx-a11y/recommended'
 * - For imports: Add 'plugin:import/recommended'
 * - For testing: Add 'plugin:jest/recommended' or 'plugin:vitest/recommended'
 * - For performance: Add 'plugin:react-perf/recommended'
 */

module.exports = {
  // Tells ESLint this is the root config (stops looking for configs in parent directories)
  root: true,
  
  // Define environments - adds global variables for each environment
  env: { 
    browser: true,  // Adds browser globals (window, document, etc.)
    es2020: true    // Enables ES2020 syntax and globals
  },
  
  // Extend from popular rule sets - order matters (later configs override earlier ones)
  extends: [
    'eslint:recommended',              // Core ESLint recommended rules
    '@typescript-eslint/recommended',  // TypeScript-specific recommended rules
    // Consider adding:
    // 'plugin:react/recommended',     // React-specific rules
    // 'plugin:react-hooks/recommended', // React hooks rules
    // 'plugin:jsx-a11y/recommended',  // Accessibility rules
  ],
  
  // Files to ignore during linting
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  
  // Parser to use for TypeScript files
  parser: '@typescript-eslint/parser',
  
  // Plugins add additional rules beyond core ESLint
  plugins: [
    'react-refresh',    // Validates React Fast Refresh usage
    '@typescript-eslint' // TypeScript-specific linting rules
  ],
  
  // Custom rule configurations - can override extended rules
  rules: {
    // TypeScript Rules
    '@typescript-eslint/no-unused-vars': 'warn',     // Warn on unused variables
    '@typescript-eslint/no-explicit-any': 'warn',    // Warn on explicit 'any' usage
    
    // React Fast Refresh Rules
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },  // Allow constant exports alongside components
    ],
    
    // Additional useful rules to consider:
    // 'no-console': 'warn',                           // Warn on console.log usage
    // 'prefer-const': 'error',                        // Enforce const for never-reassigned variables
    // '@typescript-eslint/no-non-null-assertion': 'warn', // Warn on non-null assertions (!)
    // 'react-hooks/rules-of-hooks': 'error',          // Enforce hooks rules
    // 'react-hooks/exhaustive-deps': 'warn',          // Warn on missing dependencies
  },
  
  // Parser options for TypeScript
  // parserOptions: {
  //   ecmaVersion: 2020,
  //   sourceType: 'module',
  //   ecmaFeatures: {
  //     jsx: true
  //   }
  // }
}