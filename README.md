# Round Dashboard

A modern, AI-powered enterprise billing and customer intelligence platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Glassmorphism Design** - Modern glass-effect UI with beautiful gradients
- **Mobile-First Responsive Design** - Fully responsive interface optimized for all screen sizes
- **Dark/Light Mode** - Full theme support with accessibility
- **TypeScript** - Type-safe development experience
- **Feature-Based Architecture** - Scalable and maintainable code structure
- **Performance Optimized** - Code splitting, lazy loading, and memoization

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

# Quality
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

The project uses a comprehensive design system with:

- **Brand Colors**: Primary (#D417C8), Secondary (#14BDEA), Accent (#7767DA)
- **Status Gradients**: Success, Warning, Error, Info with glass morphism variants
- **Glass Morphism**: Semi-transparent surfaces with backdrop blur effects
- **Typography**: Inter font family with 8 size variants
- **Animations**: Smooth micro-interactions with Framer Motion

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

1. Prettier formatting
2. ESLint auto-fix
3. TypeScript validation
4. Test coverage check (fails if <80%)
5. Stages formatted files

### Design System Compliance

- Use established brand colors and gradients
- Follow glass morphism patterns
- Implement responsive design (mobile-first)
- Ensure accessibility compliance (WCAG standards)
- Use Tailwind CSS utility classes consistently

## 📄 License

Private - Round Dashboard
