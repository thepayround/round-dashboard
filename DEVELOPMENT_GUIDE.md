# Development Guide - Round Dashboard

## ESLint & Code Quality

### Current Configuration

The project uses a simplified ESLint configuration that prioritizes functionality over strict import resolution to prevent pre-commit hook failures.

### Before Making Changes

Always run these commands before committing:

```bash
# 1. Format code
npm run format

# 2. Fix linting issues
npm run lint:fix

# 3. Run type checking
npm run type-check

# 4. Run tests
npm test -- --run
```

### Common Issues & Solutions

#### 1. **Console Statements**

❌ **Avoid**: `console.log('debug info')`
✅ **Use**: `console.warn('warning')` or `console.error('error')`

#### 2. **React Escaped Entities**

❌ **Avoid**: `Don't use apostrophes directly`
✅ **Use**: `Don&apos;t use HTML entities`

#### 3. **Unused Variables**

❌ **Avoid**: `const { getByRole, container } = render()` (if getByRole is unused)
✅ **Use**: `const { container } = render()` or prefix with `_` for intentionally unused

#### 4. **TypeScript Types**

❌ **Avoid**: `any` type
✅ **Use**: `unknown` or specific types

#### 5. **Nullish Coalescing**

❌ **Avoid**: `value || defaultValue`
✅ **Use**: `value ?? defaultValue`

#### 6. **Regex Escaping**

❌ **Avoid**: `/^[+]?[(]?[0-9\\s\\-\\(\\)]{10,}$/`
✅ **Use**: `/^[+]?[(]?[0-9\\s\\-()]{10,}$/`

### Validation Implementation Standards

When adding new forms or validation:

1. **Use onBlur validation** for immediate feedback
2. **Use amber colors** for error states (better contrast against gradients)
3. **Clear errors** when user starts typing
4. **Provide loading states** during form submission
5. **Use proper TypeScript types** for validation functions

### File Organization

```
src/
├── features/
│   └── auth/
│       ├── components/
│       ├── pages/
│       └── __tests__/
├── shared/
│   ├── components/
│   ├── utils/
│   └── types/
└── test/
    ├── setup.ts
    └── utils.tsx
```

### CSS Classes for Validation

Use these established classes:

```css
.auth-input-error {
  border-color: #fbbf24 !important;
  background-color: rgba(251, 191, 36, 0.1) !important;
}

.auth-validation-error {
  color: #fbbf24;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}
```

### Pre-commit Hook

The `.husky/pre-commit` hook runs:

1. Code formatting
2. Linting with auto-fix
3. Type checking
4. Test coverage validation

If pre-commit fails, check:

1. Run `npm run lint:fix` manually
2. Fix any remaining TypeScript errors
3. Ensure all tests pass
4. Check that coverage is above 80%

### Adding New Dependencies

When adding new dependencies that might affect linting:

1. Add to `package.json` devDependencies if it's a linting/dev tool
2. Update ESLint configuration if needed
3. Test the pre-commit hook works
4. Update this guide if new patterns emerge

### Testing Standards

- Test files should be under 150 lines
- Use descriptive test names
- Test user behavior, not implementation details
- Maintain 80%+ code coverage
- Place tests in `__tests__/` directories for better organization

### Common Commands

```bash
# Development
npm run dev

# Testing
npm run test:watch
npm run test:coverage

# Code Quality
npm run lint
npm run lint:fix
npm run type-check
npm run format

# Build
npm run build
```

---

**Remember**: The goal is to maintain code quality while ensuring the development workflow is smooth and predictable. Always test your changes before committing.
