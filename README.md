# Round Platform Dashboard

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
VITE_SENTRY_DSN=your_sentry_dsn_here
```

## 🚦 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Start development server: `npm run dev`
5. Open [http://localhost:5173](http://localhost:5173)

## 📝 Contributing

1. Follow the TypeScript strict mode guidelines
2. Use the established design system
3. Write tests for new features
4. Follow the feature-based architecture
5. Update CLAUDE.md when adding new features

## 📄 License

Private - Round Platform Dashboard