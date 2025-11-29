# Auto-Update Configuration

This skill includes automation scripts to keep documentation in sync with your codebase.

## Quick Update

Run this command whenever you make changes to components or theme:

```bash
npm run skill:update
```

This will:
1. Scan `src/shared/ui/shadcn/` for new components
2. Update `shadcn-components.md` with the latest component list
3. Sync theme variables from `src/index.css` to `ui-rules.md`

## Manual Updates

### Update Component List

When you add new Shadcn components:

```bash
node .claude/skills/ui-ux-shadcn/scripts/update-components.js
```

### Sync Theme Variables

When you modify CSS variables in `src/index.css`:

```bash
node .claude/skills/ui-ux-shadcn/scripts/sync-theme.js
```

## Automatic Updates

### Option 1: Git Hook (Recommended)

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run skill:update
git add .claude/skills/ui-ux-shadcn/references/
```

This automatically updates skill docs before every commit.

### Option 2: Package.json Scripts

Already configured in `package.json`:

- `npm run skill:update` - Manual update
- Runs automatically on `npm install` (postinstall hook)

### Option 3: VSCode Task

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Update Skill Docs",
      "type": "shell",
      "command": "npm run skill:update",
      "problemMatcher": [],
      "group": "build"
    }
  ]
}
```

Run with `Ctrl+Shift+P` → "Tasks: Run Task" → "Update Skill Docs"

## What Gets Updated

### shadcn-components.md
- ✅ Component list (auto-scanned from `src/shared/ui/shadcn/`)
- ✅ Component categories (Form, Layout, Feedback, etc.)
- ❌ Custom wrapper descriptions (manual)
- ❌ Code examples (manual)

### ui-rules.md
- ✅ CSS variable values (auto-synced from `index.css`)
- ❌ Usage examples (manual)
- ❌ Best practices (manual)

### SKILL.md
- ❌ Fully manual (core skill definition)

## Troubleshooting

**Script fails to run:**
```bash
chmod +x .claude/skills/ui-ux-shadcn/scripts/*.js
```

**Components not detected:**
- Ensure files are named `*.tsx` in `src/shared/ui/shadcn/`
- Check file permissions

**Theme variables not syncing:**
- Ensure `:root {}` block exists in `src/index.css`
- Variables must follow format: `--name: value;`

## File Watching (Future Enhancement)

To enable real-time updates, create a watcher:

```bash
# Install nodemon (dev dependency)
npm install -D nodemon

# Watch for changes
npx nodemon --watch src/shared/ui/shadcn --watch src/index.css --exec "npm run skill:update"
```

Add to `package.json`:
```json
{
  "scripts": {
    "skill:watch": "nodemon --watch src/shared/ui/shadcn --watch src/index.css --exec npm run skill:update"
  }
}
```
