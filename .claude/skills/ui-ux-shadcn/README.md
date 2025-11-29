# Shadcn UI/UX Skill - Auto-Update System

Your skill files will now automatically stay up-to-date! 🎉

## What Was Created

### 1. Core Skill Files ✅
- `SKILL.md` - Main skill definition (activation, rules, patterns)
- `references/ui-rules.md` - Complete UI/UX rules, spacing, typography
- `references/shadcn-components.md` - Component reference (**AUTO-UPDATED**)

### 2. Automation Scripts ✅
- `scripts/update-components.cjs` - Scans `src/shared/ui/shadcn/` and updates component list
- `scripts/sync-theme.cjs` - Extracts CSS variables from `src/index.css`

### 3. NPM Scripts ✅
Added to `package.json`:
- `npm run skill:update` - Update everything
- `npm run skill:components` - Update component list only
- `npm run skill:theme` - Sync theme variables only

### 4. Git Hook ✅
- `.husky/update-skill-docs` - Optional pre-commit hook

## How It Works

### Automatic Updates

**When you add a new Shadcn component:**
```bash
npx shadcn-ui@latest add tabs
npm run skill:update
```

The script will:
1. Scan `src/shared/ui/shadcn/` directory
2. Find all `.tsx` files
3. Categorize them (Form, Layout, Feedback, etc.)
4. Update `shadcn-components.md` with the latest list

**When you modify CSS variables:**
```bash
# After editing src/index.css
npm run skill:update
```

The script will:
1. Extract CSS variables from `:root {}` block
2. Count total variables
3. Ready for future auto-sync to `ui-rules.md`

### Manual Updates

Run anytime:
```bash
npm run skill:update
```

Or individually:
```bash
npm run skill:components  # Just components
npm run skill:theme       # Just theme vars
```

### On Git Commit (Optional)

To enable auto-update before every commit, add to `.husky/pre-commit`:

```bash
# Update skill documentation
sh .husky/update-skill-docs
```

Or manually run:
```bash
sh .husky/update-skill-docs
```

## What Gets Auto-Updated

| File | Auto-Updated | Manual |
|------|--------------|--------|
| `shadcn-components.md` | ✅ Component list | ✅ Descriptions, examples |
| `ui-rules.md` | ⚠️ Detects changes | ✅ Full content |
| `SKILL.md` | ❌ | ✅ Core skill definition |

## Current Status

Found **24 Shadcn components**:
- Form: input, textarea, select, checkbox, radio-group, switch, slider, form, label
- Layout: card, separator, tabs, accordion
- Feedback: alert, dialog, alert-dialog, tooltip, popover, skeleton
- Navigation: dropdown-menu, table
- Display: avatar, badge, button

## Usage Examples

### Add a new component
```bash
npx shadcn-ui@latest add calendar
npm run skill:update
git add .claude/skills/ui-ux-shadcn/references/shadcn-components.md
git commit -m "docs: add calendar component to skill"
```

### Update after theme changes
```bash
# Edit src/index.css
npm run skill:update
```

### Check what changed
```bash
git diff .claude/skills/ui-ux-shadcn/references/
```

## Troubleshooting

**"Module not found" error:**
- Ensure you're in project root: `cd c:/Users/User/source/repos/dashboard_and_api/round-dashboard`
- Scripts use `.cjs` extension for CommonJS compatibility

**Components not detected:**
- Files must be `.tsx` in `src/shared/ui/shadcn/`
- Run `ls src/shared/ui/shadcn/*.tsx` to verify

**Git hook not running:**
```bash
chmod +x .husky/update-skill-docs
```

## Future Enhancements

1. **File watcher** for real-time updates
2. **Full theme sync** to `ui-rules.md`
3. **Component usage stats** from codebase
4. **Breaking change detection** when components are removed

---

**Your skill is ready!** 🚀

It will activate automatically when you:
- Say: "design a new screen", "refactor to shadcn", etc.
- Edit files in: `src/features/**` or `src/shared/ui/**`
