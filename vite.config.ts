/**
 * Vite Configuration for Round Dashboard
 *
 * PURPOSE:
 * Vite is a modern build tool that provides fast development and optimized production builds.
 * This configuration customizes Vite for React development with TypeScript support.
 *
 * WHEN TO MODIFY:
 * - Adding new plugins or build optimizations
 * - Configuring environment variables
 * - Setting up proxy for API calls
 * - Adding path aliases or custom resolvers
 * - Configuring build output or chunking
 *
 * KEY CONFIGURATION AREAS:
 * - plugins: Extend Vite functionality (React, TypeScript, etc.)
 * - resolve: Configure module resolution and aliases
 * - build: Production build configuration
 * - server: Development server configuration
 * - define: Global constants for build
 *
 * ALTERNATIVE CONFIGURATIONS:
 * - For PWA: Add @vite/plugin-pwa
 * - For legacy browsers: Add @vitejs/plugin-legacy
 * - For testing: Add vitest configuration
 * - For deployment: Add build.outDir, build.assetsDir
 * - For monorepos: Add build.lib configuration
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Vite configuration - https://vitejs.dev/config/
export default defineConfig({
  // Plugins extend Vite functionality
  plugins: [
    react(), // React support with Fast Refresh
    // Additional plugins to consider:
    // eslint(),                    // ESLint integration
    // checker({ typescript: true }), // TypeScript type checking
    // { name: 'singleHMR', handleHotUpdate({ modules }) { /* custom HMR */ } }
  ],

  // Module resolution configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Map @ to src directory
      // Add more aliases as needed:
      // "@/components": resolve(__dirname, "./src/components"),
      // "@/utils": resolve(__dirname, "./src/utils"),
      // "@/types": resolve(__dirname, "./src/types"),
    },
  },

  // Development server configuration
  server: {
    port: 3000, // Preferred port for frontend
    open: false, // Don't auto-open browser
    host: true, // Allow external connections
    strictPort: false, // Try next available port if 3000 is in use
  },

  // Production build configuration
  // build: {
  //   outDir: 'dist',                // Output directory
  //   assetsDir: 'assets',           // Assets directory
  //   sourcemap: true,               // Generate source maps
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {              // Code splitting
  //         vendor: ['react', 'react-dom'],
  //         ui: ['@headlessui/react', 'framer-motion']
  //       }
  //     }
  //   }
  // },

  // Global constants
  // define: {
  //   __VERSION__: JSON.stringify(process.env.npm_package_version),
  //   __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  // },

  // Environment variables
  // envPrefix: 'VITE_',              // Environment variable prefix

  // CSS configuration
  // css: {
  //   modules: {
  //     localsConvention: 'camelCase' // CSS modules naming
  //   },
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/styles/variables.scss";`
  //     }
  //   }
  // }
})
