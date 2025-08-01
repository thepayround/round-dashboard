/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'src/test/utils'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/types.ts',
        '**/index.ts',
        '**/constants.ts',
        '**/styles.ts',
        'src/main.tsx',
        'src/App.tsx',
        'src/vite-env.d.ts',
        '**/*.config.js',
        '**/*.config.cjs',
        '.eslintrc.cjs',
        'tailwind.config.js',
        'postcss.config.js',
        'vite.config.ts',
        'vitest.config.ts',
        '**/tailwind.config.enhanced.cjs',
        '**/tailwind.config.practical.cjs',
        '**/tailwind.config copy.js',
      ],
      all: true,
      thresholds: {
        branches: 70,
        functions: 80,
        lines: 70,
        statements: 70,
      },
    },
    server: {
      deps: {
        inline: ['@testing-library/user-event', '@testing-library/jest-dom'],
      },
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    sequence: {
      shuffle: true,
    },
    reporters: ['default'],
  },
})
