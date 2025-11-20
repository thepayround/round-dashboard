/**
 * Accessibility Checker Script
 * Scans components for common accessibility issues
 * Run with: npm run audit:accessibility
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ACCESSIBILITY_PATTERNS = {
  missingAlt: {
    pattern: /<img(?![^>]*alt=)/gi,
    severity: 'HIGH',
    message: 'Image missing alt attribute'
  },
  missingLabel: {
    pattern: /<input(?![^>]*aria-label)(?![^>]*id=["'][^"']*["'])(?![^>]*<label)/gi,
    severity: 'HIGH',
    message: 'Input without label or aria-label'
  },
  clickableDiv: {
    pattern: /<div[^>]*onClick/gi,
    severity: 'MEDIUM',
    message: 'Clickable div (should use button)'
  },
  missingAriaRequired: {
    pattern: /required(?![^>]*aria-required)/gi,
    severity: 'MEDIUM',
    message: 'Required field missing aria-required'
  },
  buttonWithoutAriaLabel: {
    pattern: /<button(?![^>]*aria-label)(?![^>]*>\s*\w)/gi,
    severity: 'LOW',
    message: 'Icon button may need aria-label'
  }
};

const IGNORE_DIRS = ['node_modules', 'dist', 'build', '.git', 'coverage'];
const SCAN_EXTENSIONS = ['.tsx', '.jsx'];

let totalIssues = 0;
let highCount = 0;
let mediumCount = 0;
let lowCount = 0;

function scanDirectory(dir, basePath = '') {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const relativePath = join(basePath, item);

    if (IGNORE_DIRS.includes(item)) continue;

    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath, relativePath);
    } else if (SCAN_EXTENSIONS.some(ext => item.endsWith(ext))) {
      scanFile(fullPath, relativePath);
    }
  }
}

function scanFile(filePath, relativePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  for (const [name, config] of Object.entries(ACCESSIBILITY_PATTERNS)) {
    lines.forEach((line, index) => {
      const regex = new RegExp(config.pattern);
      regex.lastIndex = 0;

      if (regex.test(line)) {
        totalIssues++;

        if (config.severity === 'HIGH') highCount++;
        else if (config.severity === 'MEDIUM') mediumCount++;
        else if (config.severity === 'LOW') lowCount++;

        console.log(`\n${getSeverityEmoji(config.severity)} [${config.severity}] ${config.message}`);
        console.log(`   File: ${relativePath}:${index + 1}`);
        console.log(`   Code: ${line.trim().substring(0, 80)}...`);
      }
    });
  }
}

function getSeverityEmoji(severity) {
  switch(severity) {
    case 'HIGH': return '🔴';
    case 'MEDIUM': return '🟡';
    case 'LOW': return '🔵';
    default: return '⚪';
  }
}

console.log('♿ Running Accessibility Check...\n');
console.log('Scanning src/ directory for accessibility issues...\n');

scanDirectory('./src');

console.log('\n' + '='.repeat(60));
console.log('ACCESSIBILITY CHECK SUMMARY');
console.log('='.repeat(60));
console.log(`Total Issues Found: ${totalIssues}`);
console.log(`  🔴 High: ${highCount}`);
console.log(`  🟡 Medium: ${mediumCount}`);
console.log(`  🔵 Low: ${lowCount}`);
console.log('='.repeat(60));

if (highCount > 0) {
  console.log('\n⚠️  HIGH severity accessibility issues found.');
  console.log('   These may prevent some users from using your application.');
} else if (totalIssues > 0) {
  console.log('\n✅ No high severity issues, but some improvements recommended.');
} else {
  console.log('\n✅ No accessibility issues detected!');
}

console.log('\nFor detailed WCAG compliance, run: /accessibility-check');
