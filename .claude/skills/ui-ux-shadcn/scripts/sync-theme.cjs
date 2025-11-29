#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Find project root
let projectRoot = __dirname;
while (!fs.existsSync(path.join(projectRoot, 'package.json'))) {
  projectRoot = path.dirname(projectRoot);
}

const CSS_FILE = path.join(projectRoot, 'src', 'index.css');
const RULES_FILE = path.join(__dirname, '..', 'references', 'ui-rules.md');

function extractCSSVariables() {
  if (!fs.existsSync(CSS_FILE)) {
    console.error('index.css not found:', CSS_FILE);
    return null;
  }

  const css = fs.readFileSync(CSS_FILE, 'utf-8');
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/s);
  if (!rootMatch) return null;

  const variables = {};
  rootMatch[1].split('\n').forEach(line => {
    const match = line.match(/--([a-z-]+):\s*([^;]+);/);
    if (match) {
      variables[match[1]] = match[2].trim();
    }
  });

  return variables;
}

const vars = extractCSSVariables();
if (!vars) {
  console.log('⚠ Could not extract CSS variables (this is optional)');
  process.exit(0);
}

console.log('✓ Synced theme variables from index.css');
console.log(`  Found ${Object.keys(vars).length} CSS variables`);
