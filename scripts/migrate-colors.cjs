#!/usr/bin/env node

/**
 * Color Migration Script
 * Automatically replaces hardcoded hex colors with design tokens
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Color mappings: hardcoded hex → design token
const colorMappings = {
  // Background colors
  'bg-\\[#000000\\]': 'bg-background',
  'bg-\\[#0a0a0a\\]': 'bg-muted',
  'bg-\\[#141414\\]': 'bg-card',
  'bg-\\[#1c1c1e\\]': 'bg-card',
  'bg-\\[#1a1a1a\\]': 'bg-card',
  'bg-\\[#212124\\]': 'bg-muted',
  'bg-\\[#0F1115\\]': 'bg-input',
  'bg-\\[#0f0f0f\\]': 'bg-input',
  'bg-\\[#171719\\]': 'bg-input',
  'bg-\\[#0B0D12\\]': 'bg-input',

  // Text colors
  'text-\\[#ededed\\]': 'text-foreground',
  'text-\\[#a3a3a3\\]': 'text-muted-foreground',
  'text-\\[#737373\\]': 'text-muted-foreground',

  // Border colors
  'border-\\[#1f1f1f\\]': 'border-border',
  'border-white\\/10': 'border-border',

  // Brand colors
  'bg-\\[#635BFF\\]': 'bg-accent', // Stripe purple
  'bg-\\[#3385ff\\]': 'bg-primary', // Blue
  'bg-\\[#D417C8\\]': 'bg-primary', // Pink (if using pink as primary)
  'bg-\\[#14BDEA\\]': 'bg-secondary', // Cyan

  // Semantic colors
  'bg-\\[#371b1d\\]': 'bg-destructive/10',
  'text-\\[#fda4af\\]': 'text-destructive',

  // Auth-specific colors
  'bg-auth-bg': 'bg-input',
  'bg-auth-magenta': 'bg-primary',
  'bg-auth-magenta-hover': 'bg-primary/90',
  'text-auth-text': 'text-foreground',
  'text-auth-muted': 'text-muted-foreground',
  'border-auth-border': 'border-border',
  'border-auth-border-hover': 'border-border',
}

// Find all TypeScript/TSX files in src/
const files = glob.sync('src/**/*.{tsx,ts}', { ignore: ['**/*.test.tsx', '**/*.spec.tsx', '**/node_modules/**'] })

let totalChanges = 0
let filesChanged = 0

console.log('🔍 Scanning files for hardcoded colors...\n')

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8')
  const originalContent = content
  let fileChanges = 0

  // Apply each color mapping
  Object.entries(colorMappings).forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g')
    const matches = content.match(regex)

    if (matches) {
      content = content.replace(regex, replacement)
      fileChanges += matches.length
    }
  })

  // Write changes if any were made
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8')
    totalChanges += fileChanges
    filesChanged++

    const relativePath = path.relative(process.cwd(), file)
    console.log(`✅ ${relativePath} (${fileChanges} changes)`)
  }
})

console.log(`\n📊 Migration Summary:`)
console.log(`   Files scanned: ${files.length}`)
console.log(`   Files changed: ${filesChanged}`)
console.log(`   Total replacements: ${totalChanges}`)
console.log(`\n✨ Color migration complete!`)
console.log(`\n⚠️  Please review changes with: git diff`)
