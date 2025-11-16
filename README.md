# Round Dashboard

A modern, AI-powered enterprise billing and customer intelligence platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Polar.sh-Inspired Design** - Clean, solid backgrounds with instant interactions
- **100% Component-Based** - Zero raw HTML elements, all reusable components
- **WCAG AA/AAA Compliant** - Enterprise-grade accessibility
- **Mobile-First Responsive** - 44px touch targets, optimized for all devices
- **Interactive Component Library** - Storybook with 114+ stories
- **TypeScript Strict** - Full type safety across the codebase
- **Feature-Based Architecture** - Scalable and maintainable
- **Pre-commit Validation** - Automated quality enforcement

## 🛠 Tech Stack

- **React 18.2.0** + TypeScript 5.3.3
- **Vite 5.4.19** (build tool)
- **Tailwind CSS 3.4.3** (styling)
- **Framer Motion 12.12.1** (animations)
- **Zustand 5.0.4** (state management)
- **React Router DOM 7.5.2** (routing)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Component Library
npm run storybook        # Start Storybook (http://localhost:6006)
npm run build-storybook  # Build static Storybook site

# Quality
npm run validate:components  # Validate component usage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Run Prettier
npm run type-check   # TypeScript check

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🎨 Design System

**Polar.sh-Inspired Minimalist Design:**

- **Colors**: Primary Pink (#D417C8), Cyan (#14BDEA), Purple (#7767DA)
- **Backgrounds**: Solid dark (`#171719` cards, `#0a0a0a` page)
- **Typography**: Inter font, lighter weights (300 baseline)
- **Zero Animations**: Instant interactions on interactive components
- **Touch Targets**: 44px minimum on mobile (WCAG AAA)
- **Focus Indicators**: Cyan ring on keyboard focus

**See:** Run `npm run storybook` for interactive component library

## 📱 Mobile-First Responsive Design

All components and layouts must be fully responsive and optimized for mobile devices:

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Mobile-First Approach**: Design for mobile first, then scale up for larger screens
- **Touch-Friendly**: Minimum 44px touch targets for interactive elements
- **Adaptive Navigation**: Collapsible menus and drawer patterns for mobile
- **Responsive Typography**: Fluid text scaling across all device sizes
- **Flexible Grids**: CSS Grid and Flexbox for adaptive layouts
- **Performance**: Optimized images and lazy loading for mobile networks

## 📁 Project Structure

```
src/
├── features/           # Feature-based modules
│   └── auth/          # Authentication feature
├── shared/            # Shared components and utilities
│   ├── components/    # UI components
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── assets/            # Static assets
└── App.tsx           # Root component
```

## 🌐 Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚦 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Start development server: `npm run dev`
5. Open [http://localhost:5173](http://localhost:5173)

### Explore Component Library

```bash
npm run storybook
```

Opens interactive component documentation at `http://localhost:6006` with:
- 13 component types
- 114+ interactive stories
- Accessibility testing
- Responsive viewport testing
- Copy-paste code snippets

See `/docs/README.md` for comprehensive documentation index.

## 📝 Contributing

### Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Write Tests First** (TDD encouraged): Create test files before implementation
3. **Implement Feature**: Follow component architecture patterns
4. **Run Tests**: `npm run test:coverage` - must maintain 80%+ coverage
5. **Pre-commit Hooks**: Automatically run on commit (formatting, linting, type checking, tests)
6. **Update Documentation**: Update CLAUDE.md when adding new features
7. **Create Pull Request**: Include test results and feature description

### Code Standards

- **TypeScript Strict**: All strict flags enabled, maximum type safety
- **Component Architecture**: Use modular structure with separate .types.ts files
- **File Size Limits**: Components <200 lines, tests <150 lines, utils <100 lines
- **Test Coverage**: 80% minimum coverage required for all metrics
- **Pre-commit Hooks**: Automated quality checks prevent bad commits

### Component Development

```bash
# Create new component structure
mkdir src/components/NewComponent
touch src/components/NewComponent/NewComponent.tsx
touch src/components/NewComponent/NewComponent.test.tsx
touch src/components/NewComponent/NewComponent.types.ts
touch src/components/NewComponent/index.ts
```

### Testing Requirements

- **Unit Tests**: All components and functions
- **Integration Tests**: Complete user flows
- **Accessibility Tests**: Keyboard navigation, ARIA compliance
- **Responsive Tests**: Mobile (375px), Tablet (768px), Desktop (1920px)

### Pre-commit Quality Checks

The `.husky/pre-commit` hook automatically runs:

1. **Component Validation** - Blocks raw HTML elements
2. Prettier formatting
3. ESLint auto-fix
4. TypeScript validation
5. Stages formatted files

**Configuration:** `.component-rules.json`

### Component Standards

**MANDATORY:** Use reusable components from `@/shared/ui`:
- ✅ `Button`, `IconButton`, `ActionButton` (not `<button>`)
- ✅ `Input`, `FormInput`, `AuthInput` (not `<input>`)
- ✅ `Checkbox`, `Toggle`, `RadioGroup` (not `<input type="checkbox">`)
- ✅ `Textarea` (not `<textarea>`)
- ✅ `UiDropdown`, `ApiDropdown` (not `<select>`)
- ✅ `FileInput` (not `<input type="file">`)

**Pre-commit validation will block raw HTML elements.**

### Accessibility Compliance

- ✅ WCAG 2.1 Level AA (all features)
- ✅ WCAG 2.1 Level AAA (touch targets)
- ✅ 131+ ARIA attributes
- ✅ Focus trap in modals
- ✅ 44px touch targets on mobile
- ✅ Screen reader support

**See:** `/docs/COMPONENT_VALIDATION.md` for details

## 📄 License

Private - Round Dashboard
