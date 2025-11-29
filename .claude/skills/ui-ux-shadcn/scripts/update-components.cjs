#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Find project root
let projectRoot = __dirname;
while (!fs.existsSync(path.join(projectRoot, 'package.json'))) {
  projectRoot = path.dirname(projectRoot);
}

const SHADCN_DIR = path.join(projectRoot, 'src', 'shared', 'ui', 'shadcn');
const OUTPUT_FILE = path.join(__dirname, '..', 'references', 'shadcn-components.md');

const categories = {
  form: ['input', 'textarea', 'select', 'checkbox', 'radio-group', 'switch', 'slider', 'form', 'label'],
  layout: ['card', 'separator', 'tabs', 'accordion'],
  feedback: ['alert', 'dialog', 'alert-dialog', 'tooltip', 'popover', 'skeleton'],
  navigation: ['dropdown-menu', 'table'],
  display: ['avatar', 'badge', 'button']
};

function scanComponents() {
  if (!fs.existsSync(SHADCN_DIR)) {
    console.error('Shadcn directory not found:', SHADCN_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(SHADCN_DIR)
    .filter(f => f.endsWith('.tsx'))
    .map(f => f.replace('.tsx', ''));

  const found = { form: [], layout: [], feedback: [], navigation: [], display: [], other: [] };

  files.forEach(file => {
    let categorized = false;
    for (const [category, components] of Object.entries(categories)) {
      if (components.includes(file)) {
        found[category].push(file);
        categorized = true;
        break;
      }
    }
    if (!categorized) found.other.push(file);
  });

  return found;
}

const descriptions = {
  'input': 'Text inputs', 'textarea': 'Multi-line text inputs', 'select': 'Dropdown select',
  'checkbox': 'Checkbox inputs', 'radio-group': 'Radio button groups', 'switch': 'Toggle switches',
  'slider': 'Range sliders', 'form': 'Form field wrappers', 'label': 'Form labels',
  'card': 'Cards', 'separator': 'Divider lines', 'tabs': 'Tab navigation',
  'accordion': 'Collapsible sections', 'alert': 'Alert messages', 'dialog': 'Modal dialogs',
  'alert-dialog': 'Confirmation dialogs', 'tooltip': 'Hover tooltips', 'popover': 'Popovers',
  'skeleton': 'Loading skeletons', 'dropdown-menu': 'Dropdown menus', 'table': 'Data tables',
  'avatar': 'User avatars', 'badge': 'Status badges', 'button': 'Buttons'
};

function getDesc(c) { return descriptions[c] || 'Component'; }

const components = scanComponents();
const markdown = `# Shadcn Components Reference

## Installed Components

All Shadcn components are located in \`src/shared/ui/shadcn/\`

### Form Components

${components.form.map(c => `- \`${c}.tsx\` - ${getDesc(c)}`).join('\n')}

### Layout Components

${components.layout.map(c => `- \`${c}.tsx\` - ${getDesc(c)}`).join('\n')}

### Feedback Components

${components.feedback.map(c => `- \`${c}.tsx\` - ${getDesc(c)}`).join('\n')}

### Navigation Components

${components.navigation.map(c => `- \`${c}.tsx\` - ${getDesc(c)}`).join('\n')}

### Display Components

${components.display.map(c => `- \`${c}.tsx\` - ${getDesc(c)}`).join('\n')}${components.other.length > 0 ? `\n\n### Other Components\n\n${components.other.map(c => `- \`${c}.tsx\``).join('\n')}` : ''}

## Custom Wrapper Components

### Button Wrapper
Location: \`@/shared/ui/Button/Button.tsx\`
Provides backward compatibility with variant mapping.

### Card Wrapper
Location: \`@/shared/ui/Card/Card.tsx\`
Supports stats, feature, navigation, compact variants.

### DataTable Component
Location: \`@/shared/ui/DataTable/DataTable.tsx\`
Features: pagination, sorting, filtering, row selection, search.

## Import Patterns

Direct Shadcn imports:
\`\`\`tsx
import { Dialog } from '@/shared/ui/shadcn/dialog'
import { Form, FormField } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
\`\`\`

Wrapper imports:
\`\`\`tsx
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { DataTable } from '@/shared/ui/DataTable/DataTable'
\`\`\`

## Best Practices

1. Always import from correct path (shadcn vs wrappers)
2. Use semantic variants (destructive for dangerous actions)
3. Leverage Form components for all forms
4. Use consistent sizing (default is sufficient for most cases)
5. All components support accessibility features
`;

fs.writeFileSync(OUTPUT_FILE, markdown);
console.log('✓ Updated shadcn-components.md');
console.log(`  Found ${Object.values(components).flat().length} components`);
