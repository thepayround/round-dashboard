#!/usr/bin/env node

/**
 * Component Validation Script
 *
 * Validates that developers use reusable components instead of raw HTML elements.
 * Reads rules from .component-rules.json and checks staged files.
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ANSI color codes - disabled for Windows compatibility
const colors = {
  reset: '',
  red: '',
  yellow: '',
  green: '',
  blue: '',
  gray: '',
}

/**
 * Load component rules from config file
 */
function loadRules() {
  const configPath = path.join(__dirname, '..', '.component-rules.json')

  if (!fs.existsSync(configPath)) {
    console.error(`${colors.red}Error: .component-rules.json not found${colors.reset}`)
    process.exit(1)
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  return config.rules
}

/**
 * Get staged files from git
 */
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8'
    })

    return output
      .split('\n')
      .filter(file => file.trim() !== '')
      .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
      .filter(file => !file.includes('node_modules'))
  } catch (error) {
    console.error(`${colors.red}Error getting staged files:${colors.reset}`, error.message)
    return []
  }
}

/**
 * Check if file should be excluded based on rule
 */
function shouldExclude(filePath, excludePaths) {
  if (!excludePaths) return false

  return excludePaths.some(pattern => {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\//g, '[\\\\/]')

    return new RegExp(regexPattern).test(filePath)
  })
}

/**
 * Check if an input element is a checkbox or radio (even across multiple lines)
 */
function isCheckboxOrRadio(content, matchIndex) {
  // Get the full tag (up to the closing >)
  const tagStart = matchIndex
  const tagEnd = content.indexOf('>', matchIndex)
  if (tagEnd === -1) return false

  const fullTag = content.substring(tagStart, tagEnd + 1)

  // Check if it has type="checkbox" or type="radio"
  return /type\s*=\s*["']?(checkbox|radio)["']?/i.test(fullTag)
}

/**
 * Validate a single file against all rules
 */
function validateFile(filePath, rules) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const violations = []

  for (const rule of rules) {
    if (shouldExclude(filePath, rule.excludePaths)) {
      continue
    }

    const regex = new RegExp(rule.pattern, 'gm')
    let match

    while ((match = regex.exec(content)) !== null) {
      // Skip checkboxes and radios for input rules
      if (rule.name === 'No raw input elements' && isCheckboxOrRadio(content, match.index)) {
        continue
      }

      // Find line number
      const lineNumber = content.substring(0, match.index).split('\n').length
      const lineContent = lines[lineNumber - 1].trim()

      violations.push({
        rule: rule.name,
        line: lineNumber,
        content: lineContent,
        message: rule.message,
        suggestion: rule.suggestion,
        severity: rule.severity || 'error',
      })
    }
  }

  return violations
}

/**
 * Format and display violations
 */
function displayViolations(fileViolations) {
  let hasErrors = false
  let hasWarnings = false

  for (const [file, violations] of Object.entries(fileViolations)) {
    if (violations.length === 0) continue

    console.log(`\n${colors.blue}${file}${colors.reset}`)

    for (const violation of violations) {
      const icon = violation.severity === 'error' ? '✖' : '⚠'
      const color = violation.severity === 'error' ? colors.red : colors.yellow

      if (violation.severity === 'error') hasErrors = true
      else hasWarnings = true

      console.log(`  ${color}${icon} Line ${violation.line}:${colors.reset}`)
      console.log(`    ${colors.gray}${violation.content}${colors.reset}`)
      console.log(`    ${violation.message}`)

      if (violation.suggestion) {
        console.log(`    ${colors.green}💡 ${violation.suggestion}${colors.reset}`)
      }
      console.log('')
    }
  }

  return { hasErrors, hasWarnings }
}

/**
 * Main validation function
 */
function main() {
  console.log(`${colors.blue}🔍 Validating component usage...${colors.reset}\n`)

  const rules = loadRules()
  const stagedFiles = getStagedFiles()

  if (stagedFiles.length === 0) {
    console.log(`${colors.gray}No TypeScript/TSX files to validate${colors.reset}`)
    process.exit(0)
  }

  console.log(`${colors.gray}Checking ${stagedFiles.length} file(s)...${colors.reset}`)

  const fileViolations = {}

  for (const file of stagedFiles) {
    const violations = validateFile(file, rules)
    if (violations.length > 0) {
      fileViolations[file] = violations
    }
  }

  const { hasErrors, hasWarnings } = displayViolations(fileViolations)

  if (hasErrors || hasWarnings) {
    const errorCount = Object.values(fileViolations)
      .flat()
      .filter(v => v.severity === 'error').length

    const warningCount = Object.values(fileViolations)
      .flat()
      .filter(v => v.severity === 'warning').length

    console.log(`${colors.red}✖ Found ${errorCount} error(s)${colors.reset}`)
    if (warningCount > 0) {
      console.log(`${colors.yellow}⚠ Found ${warningCount} warning(s)${colors.reset}`)
    }
    if (hasErrors) {
      process.exit(1)
    }
  } else {
    console.log(`${colors.green}✔ All files passed component validation!${colors.reset}`)
  }

  process.exit(0)
}

// Run validation
main()
