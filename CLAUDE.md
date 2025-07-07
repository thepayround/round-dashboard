# Round Platform - AI Context Guide

## Project Overview
Round Platform is a comprehensive AI-powered enterprise billing and customer intelligence platform for B2B SaaS companies. Provides revenue management, customer analytics, and business intelligence to optimize billing operations and maximize revenue growth.

## Core Business Features

### Revenue Problems Solved
1. **Revenue Optimization** - Identifies leakage through churn prediction/expansion opportunities
2. **Customer Success** - Predicts churn, identifies at-risk customers for proactive intervention
3. **Billing Efficiency** - Automates complex billing with intelligent retry logic
4. **Business Intelligence** - Delivers real-time AI insights for strategic planning
5. **Operational Excellence** - Centralizes revenue operations in one platform

### Key Feature Areas

#### Smart Billing Management (`/billing`)
- AI-powered revenue health scoring (87-92% confidence), churn prediction, payment forecasting
- Comprehensive subscription lifecycle management with health monitoring
- Automated payment retry logic and collection workflows
- Success rate tracking, retry optimization, payment method analytics

#### Customer Intelligence (`/customers`)
- AI-driven health scoring, churn prediction, engagement analysis
- Customer segmentation: Champions, Loyal, Potential, At-Risk, Hibernating
- Advanced analytics: health scores (0-100), churn probability, LTV predictions
- Proactive alerts for at-risk customers and up-sell opportunities

#### Revenue Analytics (`/revenue-analytics`)
- MRR/ARR tracking with AI forecasting
- Customer metrics: LTV analysis, CAC optimization, Net Revenue Retention
- Predictive revenue modeling with confidence intervals
- Cohort analysis for retention and revenue trends

#### AI Enterprise Assistant (`/ai-assistant`)
- Advanced AI assistant for data-driven decision making
- Quick actions: Revenue Deep Dive, Customer Intelligence, Performance Dashboard
- Natural language queries for complex business questions
- Streaming responses with confidence scoring

#### Invoice Management (`/invoices`)
- Smart processing: automated invoice generation with templates
- AI payment predictions: payment probability scoring and risk assessment
- Advanced filtering by status, payment methods, customers, amounts, risk levels
- Bulk operations: export, send, mark paid, cancel multiple invoices

#### Dashboard & Analytics (`/dashboard`)
- Real-time KPIs: MRR, churn rate, customer health, payment success rates
- AI insights: revenue optimization opportunities and risk alerts
- Predictive analytics: growth forecasting with confidence levels
- Overall business health scoring and trend analysis

#### Additional Features
- **Pricing Intelligence** - Usage metrics, price tier management, AI pricing recommendations
- **Integration Marketplace** - Third-party integration subscriptions
- **Customer Portal** - Self-service customer management
- **Orders & Products** - Product catalog and order processing
- **Quotes & Contracts** - Quote generation and contract lifecycle management

## Design System

### Brand Colors
- **Primary**: `#D417C8` (Accent Pink)
- **Secondary**: `#14BDEA` (Accent Cyan)
- **Accent**: `#7767DA` (Purple)

### Status Gradients
- **Success**: `#42E695` → `#3BB2B8` | Glass: `rgba(66, 230, 149, 0.1)` | Text: `#38D39F`
- **Warning**: `#FFC107` → `#FF8A00` | Glass: `rgba(255, 193, 7, 0.1)` | Text: `#FF9F0A`
- **Error**: `#FF4E50` → `#F44336` | Glass: `rgba(244, 67, 54, 0.1)` | Text: `#FF3B30`
- **Info**: `#14BDEA` → `#7767DA` | Glass: `rgba(20, 189, 234, 0.1)` | Text: `#32A1E4`

### Glass Morphism System
- **Background**: `rgba(255, 255, 255, 0.08)` | Border: `rgba(255, 255, 255, 0.15)`
- **Hover**: `rgba(255, 255, 255, 0.12)` | Border: `rgba(255, 255, 255, 0.2)`
- **Disabled**: `rgba(150, 150, 150, 0.1)` | Text: `rgba(150, 150, 150, 0.5)`

### Typography & Spacing
- **Font**: Inter with fallbacks
- **Typography Scale**: 8 size variants (xs to 4xl)
- **Spacing System**: 25+ spacing utilities
- **Shadow System**: 15+ shadow variants including glass effects

## 🛠 Tech Stack

### Frontend Core
- **React 18.2.0** + TypeScript 5.3.3
- **Vite 5.4.19** (build tool)
- **React Router DOM 7.5.2** (routing)
- **Tailwind CSS 3.4.3** (styling)
- **Framer Motion 12.12.1** (animations)
- **Headless UI 2.2.2** (accessible components)

### Data & State
- **Zustand 5.0.4** (global state)
- **React Context** (user/account management)
- **Axios 1.6.7** (HTTP client)
- **Recharts 2.15.3** (data visualization)

### Development Tools
- **ESLint 9.26.0** + Prettier 3.5.3 (code quality)
- **Vitest 1.2.2** + Testing Library (testing)
- **Husky 9.1.7** (Git hooks)
- **Lucide React 0.509.0** + React Icons 5.5.0 (icons)

## Project Structure

### Current Implementation Status
```
round-dashboard/
├── src/
│   ├── features/       # Feature-based modules
│   │   └── auth/       # ✅ Authentication feature (IMPLEMENTED)
│   │       ├── components/  # ✅ AuthLayout
│   │       └── pages/       # ✅ LoginPage, RegisterPage
│   ├── shared/         # ✅ Shared components, utilities, services
│   │   ├── components/ # ✅ UI components (Button, etc.)
│   │   │   └── ui/     # ✅ Reusable UI components
│   │   ├── types/      # ✅ TypeScript type definitions
│   │   │   ├── auth.ts # ✅ Authentication types
│   │   │   └── api.ts  # ✅ API response types
│   │   └── utils/      # ✅ Utility functions (cn, etc.)
│   ├── index.css       # ✅ Global styles with Tailwind
│   ├── main.tsx        # ✅ Application entry point
│   └── App.tsx         # ✅ Root component with routing
├── tailwind.config.js  # ✅ Custom design system configuration
├── vite.config.ts      # ✅ Vite configuration with path aliases
├── package.json        # ✅ Dependencies and scripts
└── README.md           # ✅ Project documentation
```

### Target Full Structure (For Future Features)
```
src/
├── features/           # Feature-based modules (20+ business domains)
│   ├── auth/          # ✅ IMPLEMENTED - Authentication
│   ├── dashboard/      # 🔲 Main analytics dashboard
│   ├── customers/      # 🔲 Customer management
│   ├── billing/        # 🔲 Billing and subscriptions
│   ├── invoices/       # 🔲 Invoice management
│   ├── revenue-analytics/ # 🔲 Revenue insights
│   ├── ai-assistant/   # 🔲 AI chat assistant
│   ├── pricing/        # 🔲 Pricing intelligence
│   ├── marketplace/    # 🔲 Integration marketplace
│   └── [other features] # 🔲 Future business domains
├── shared/             # ✅ Shared components, utilities, services
│   ├── components/     # ✅ UI components (25+ components planned)
│   ├── config/         # 🔲 Configuration files
│   ├── services/       # 🔲 API clients and utilities
│   ├── hooks/          # 🔲 Custom React hooks
│   └── utils/          # ✅ Utility functions
├── assets/             # 🔲 Static assets and logos
├── test/               # 🔲 Test utilities and setup
├── theme.ts            # 🔲 Comprehensive design system
├── main.tsx            # ✅ Application entry point
└── App.tsx             # ✅ Root component with routing
```

**Legend:** ✅ Implemented | 🔲 Planned

## 🎯 Development Standards

### UI/UX Guidelines
1. **Glass Morphism & Aurora UI** - Semi-transparent surfaces with blur effects and gradients
2. **Dark/Light Mode** - Full theme support with accessibility compliance
3. **Micro-interactions** - Smooth animations using Framer Motion
4. **Adaptive UI** - Context-aware interfaces for device capability
5. **AI-Driven UI** - Natural language processing integration with personalization
6. **Minimalism** - Clean aesthetics with reduced cognitive load
7. **Accessibility** - WCAG compliance, ARIA standards, keyboard navigation
8. **Component-Driven** - Modular, reusable components with Tailwind CSS

### Code Standards
1. **TypeScript Strict** - Maximum type safety with all strict flags enabled
2. **Feature-Based Architecture** - Self-contained modules with lazy loading
3. **Performance** - Code splitting, memoization, virtualization
4. **Error Handling** - Structured error types with severity levels
5. **Testing** - 80% coverage threshold with co-located tests

### Architecture Patterns
1. **Compound Components** - Card system (Header, Title, Content, Footer)
2. **Polymorphic Components** - Button with extensive variant system
3. **Custom Hooks** - useUIState, useErrorHandler, usePagination, useTableSort
4. **State Management** - Multi-paradigm (Zustand + Context + Local)
5. **API Architecture** - Axios wrapper with interceptors, retry logic, caching

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

## Technical Architecture

### API Client Architecture
- **Axios Wrapper**: Custom ApiClient class with request/response interceptors
- **Automatic Retry**: Exponential backoff with response caching (TTL)
- **Request Tracking**: Request ID tracking for debugging
- **Type Safety**: Generic methods with proper TypeScript support
- **Error Handling**: Structured API error responses with retry logic

### Error Handling System
- **Structured Types**: Enum-based categorization (NETWORK, AUTH, VALIDATION, etc.)
- **Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL with appropriate handling
- **Sentry Integration**: Comprehensive error reporting with context
- **Toast Notifications**: User-friendly error messaging

### Performance Optimizations
- **Code Splitting**: Route-level and component-level splitting
- **Lazy Loading**: Dynamic imports for non-critical components
- **Memoization**: Strategic use of React.memo and useMemo
- **Virtualization**: For large lists and tables

### State Management Strategy
- **Zustand**: Global application state
- **React Context**: User/account management
- **Custom Hooks**: Feature-specific state
- **Local State**: Component-level interactions

## 🚀 Production & Quality

### Build Optimizations
- Code splitting (automatic route-based)
- Tree shaking (dead code elimination)
- Asset optimization (images, fonts)
- Bundle analysis and size monitoring

### Performance Monitoring
- Error reporting (Sentry integration)
- Performance metrics (Core Web Vitals)
- User analytics and usage tracking
- Regular load testing

### Security Measures
- Input validation and sanitization
- XSS prevention measures
- CSRF protection with tokens
- Secure authentication and session management

## Environment Variables

Required environment variables:
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_SENTRY_DSN` - Error tracking (optional)

## Documentation Rules

**CRITICAL**: When making ANY changes to the project:

1. **Update this CLAUDE.md file** immediately
2. **Update project structure** if adding new directories/files
3. **Document new dependencies** in tech stack section
4. **Add new commands** to development commands
5. **Update environment variables** if adding new ones

This ensures AI context remains accurate and development stays consistent.

---

*Keep this file updated with every significant change to maintain accurate AI context.*