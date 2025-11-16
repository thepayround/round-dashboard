# Component Validation - Pre-Commit Hooks

This document explains the automated component validation system that enforces the use of reusable components instead of raw HTML elements.

## 🎯 Purpose

The validation system ensures:
- **Consistency**: All developers use the same reusable components
- **Maintainability**: Centralized styling and behavior changes
- **Quality**: Prevents accidental use of raw HTML elements
- **Best Practices**: Enforces component-based architecture

## 🚀 How It Works

### Pre-Commit Hook

Every time you commit code, the validation automatically runs and checks:
1. ✅ **Component Usage** - Ensures reusable components are used
2. ✅ **Code Formatting** - Auto-formats with Prettier
3. ✅ **Linting** - Auto-fixes linting issues
4. ✅ **Type Checking** - Verifies TypeScript types

If any **errors** are found, the commit will be **blocked** until fixed.

### Validation Rules

Located in `.component-rules.json`, the validation checks for:

#### ❌ Blocked (Errors)
- Raw `<button>` elements → Use `Button` or `IconButton`
- Raw `<input>` elements → Use `Input`, `FormInput`, `AuthInput`, etc.
- Raw `<textarea>` elements → Use `Textarea`
- Raw `<select>` elements → Use `Select`, `ApiDropdown`, or `UiDropdown`

#### ⚠️ Warned (Warnings)
- Informational warnings about component usage patterns

## 📦 Available Reusable Components

### Input Components

```tsx
// Basic Input
import { Input } from '@/shared/ui'
<Input label="Email" type="email" value={email} onChange={handleChange} />

// Full-Featured Form Input
import { FormInput } from '@/shared/ui'
<FormInput
  label="Company Name"
  leftIcon={Building}
  type="text"
  value={company}
  onChange={handleChange}
  error={errors.company}
  helpText="Enter your registered company name"
/>

// Auth Input (for auth pages)
import { AuthInput } from '@/shared/ui'
<AuthInput label="Password" type="password" value={password} onChange={handleChange} />

// Search Input
import { SearchInput } from '@/shared/ui'
<SearchInput value={query} onChange={setQuery} placeholder="Search..." />

// Phone Input
import { PhoneInput } from '@/shared/ui'
<PhoneInput value={phone} onChange={setPhone} />

// File Input
import { FileInput } from '@/shared/ui'
<FileInput
  label="Upload Logo"
  accept="image/*"
  onChange={(file) => setFile(file)}
  showPreview
/>
```

### Selection Components

```tsx
// Checkbox
import { Checkbox } from '@/shared/ui'
<Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree" />

// Toggle
import { Toggle } from '@/shared/ui'
<Toggle checked={enabled} onCheckedChange={setEnabled} label="Enable feature" />

// Radio Group
import { RadioGroup } from '@/shared/ui'
<RadioGroup value={selected} onValueChange={setSelected} options={options} />

// Dropdowns
import { UiDropdown, ApiDropdown } from '@/shared/ui'
<UiDropdown
  value={selected}
  onChange={setSelected}
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
/>
```

### Text Area

```tsx
// Textarea
import { Textarea } from '@/shared/ui'
<Textarea
  label="Description"
  value={description}
  onChange={handleChange}
  rows={4}
/>
```

### Buttons

```tsx
// Button
import { Button, IconButton } from '@/shared/ui'
<Button variant="primary" onClick={handleClick}>Save</Button>
<IconButton icon={Plus} onClick={handleAdd} aria-label="Add item" />
```

## 🛠️ Manual Validation

Run validation manually anytime:

```bash
npm run validate:components
```

This checks **all staged files** and reports any violations.

## 🔧 Configuration

### `.component-rules.json`

Defines validation rules:

```json
{
  "rules": [
    {
      "name": "No raw input elements",
      "pattern": "<input\\s",
      "message": "Use reusable input components instead of raw <input> elements",
      "suggestion": "import { Input, FormInput, ... } from '@/shared/ui'",
      "severity": "error",
      "excludePaths": [
        "src/shared/ui/Input/",
        "*.test.tsx"
      ]
    }
  ]
}
```

#### Rule Properties

- **name**: Rule identifier
- **pattern**: Regex pattern to match
- **message**: Error message shown to developer
- **suggestion**: Helpful suggestion for fixing
- **severity**: `"error"` (blocks commit) or `"warning"` (informational)
- **excludePaths**: Directories/files to skip (e.g., component implementations, tests)

## 🚫 Bypass Validation (Not Recommended)

In rare cases where you need to bypass validation:

```bash
git commit --no-verify -m "Your message"
```

**⚠️ Warning:** Only use this for emergencies. Always prefer fixing violations.

## 📝 Adding New Rules

To add a new validation rule:

1. Edit `.component-rules.json`
2. Add your rule with pattern, message, and severity
3. Specify excludePaths for component implementations
4. Test with `npm run validate:components`
5. Commit your changes

### Example: Adding Button Rule

```json
{
  "name": "No raw anchor elements",
  "pattern": "<a\\s",
  "message": "Use <Link> component from react-router-dom instead of raw <a> elements",
  "suggestion": "import { Link } from 'react-router-dom'",
  "severity": "warning",
  "excludePaths": ["*.test.tsx"]
}
```

## 🐛 Troubleshooting

### Validation Failing?

1. **Check the error message** - It tells you exactly what's wrong
2. **Look at the line number** - Navigate to the problematic line
3. **See the suggestion** - Follow the import/usage suggestion
4. **Fix the issue** - Replace raw element with component
5. **Re-stage files**: `git add .`
6. **Try committing again**

### False Positives?

If validation incorrectly flags your code:

1. Check if the file should be in `excludePaths`
2. Adjust the regex pattern to be more specific
3. Add the file/directory to `excludePaths` in `.component-rules.json`

### Validation Not Running?

```bash
# Reinstall husky hooks
npm run prepare

# Verify .husky/pre-commit exists and is executable
ls -la .husky/
```

## 📊 Validation Report

After each validation, you'll see:

```
🔍 Validating component usage...
Checking 30 file(s)...

✖ Found 0 error(s)
⚠ Found 41 warning(s)

✅ All files passed component validation!
```

- **Errors** = Violations that block commit
- **Warnings** = Informational, doesn't block commit
- **No errors** = Commit can proceed

## 🎓 Best Practices

1. **Always use reusable components** - Never raw HTML elements
2. **Import from `@/shared/ui`** - Centralized component exports
3. **Read error messages** - They provide helpful suggestions
4. **Update components** - If you need new features, enhance existing components
5. **Test locally** - Run `npm run validate:components` before committing

## 📚 Related Documentation

- [REUSABLE_COMPONENTS.md](./REUSABLE_COMPONENTS.md) - Component usage guide
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - General development guidelines
- `.component-rules.json` - Validation rules configuration

## 🔄 Continuous Improvement

This validation system is designed to evolve:

- Add new rules as patterns emerge
- Update suggestions based on developer feedback
- Refine regex patterns to reduce false positives
- Document common scenarios

Have suggestions? Update this document and the rules configuration!

---

**Last Updated**: November 2025
**Maintained by**: Development Team

