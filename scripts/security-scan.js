/**
 * Security Scanner Script
 * Scans codebase for common security vulnerabilities
 * Run with: npm run audit:security
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DANGEROUS_PATTERNS = {
  hardcodedSecrets: {
    pattern: /(password|secret|api_key|token|private_key)\s*[:=]\s*['"]\w+['"]/gi,
    severity: 'CRITICAL',
    message: 'Potential hardcoded secret detected'
  },
  dangerousHTML: {
    pattern: /dangerouslySetInnerHTML|innerHTML/gi,
    severity: 'HIGH',
    message: 'Dangerous HTML rendering detected'
  },
  consoleSecrets: {
    pattern: /console\.log.*\b(password|token|secret|key)\b/gi,
    severity: 'MEDIUM',
    message: 'Sensitive data in console.log'
  },
  unsafeUrls: {
    pattern: /href\s*=\s*\{[^}]*\}/gi,
    severity: 'MEDIUM',
    message: 'Dynamic href without sanitization'
  },
  localStorage: {
    pattern: /localStorage\.setItem\([^,]+,\s*[^)]*token[^)]*\)/gi,
    severity: 'HIGH',
    message: 'Storing tokens in localStorage (use httpOnly cookies)'
  }
};

const IGNORE_DIRS = ['node_modules', 'dist', 'build', '.git', 'coverage'];
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

let totalIssues = 0;
let criticalCount = 0;
let highCount = 0;
let mediumCount = 0;

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

  for (const [name, config] of Object.entries(DANGEROUS_PATTERNS)) {
    let match;
    const regex = new RegExp(config.pattern);

    lines.forEach((line, index) => {
      regex.lastIndex = 0;
      if (regex.test(line)) {
        totalIssues++;

        if (config.severity === 'CRITICAL') criticalCount++;
        else if (config.severity === 'HIGH') highCount++;
        else if (config.severity === 'MEDIUM') mediumCount++;

        console.log(`\n${getSeverityEmoji(config.severity)} [${config.severity}] ${config.message}`);
        console.log(`   File: ${relativePath}:${index + 1}`);
        console.log(`   Code: ${line.trim().substring(0, 80)}...`);
      }
    });
  }
}

function getSeverityEmoji(severity) {
  switch(severity) {
    case 'CRITICAL': return '🚨';
    case 'HIGH': return '🔴';
    case 'MEDIUM': return '🟡';
    default: return '🔵';
  }
}

console.log('🔒 Running Security Scan...\n');
console.log('Scanning src/ directory for security issues...\n');

scanDirectory('./src');

console.log('\n' + '='.repeat(60));
console.log('SECURITY SCAN SUMMARY');
console.log('='.repeat(60));
console.log(`Total Issues Found: ${totalIssues}`);
console.log(`  🚨 Critical: ${criticalCount}`);
console.log(`  🔴 High: ${highCount}`);
console.log(`  🟡 Medium: ${mediumCount}`);
console.log('='.repeat(60));

if (criticalCount > 0) {
  console.log('\n❌ CRITICAL issues found! Fix immediately.');
  process.exit(1);
} else if (highCount > 0) {
  console.log('\n⚠️  HIGH severity issues found. Please review.');
  process.exit(0); // Don't block, but warn
} else if (totalIssues > 0) {
  console.log('\n✅ No critical issues, but some warnings to review.');
} else {
  console.log('\n✅ No security issues detected!');
}
