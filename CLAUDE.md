# Round - AI Context Guide

## Project Overview
Round is a comprehensive AI-powered enterprise billing and customer intelligence platform for B2B SaaS companies. Provides revenue management, customer analytics, and business intelligence to optimize billing operations and maximize revenue growth.

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
- **Background**: `rgba(255, 255, 255, 0.04)` | Border: `rgba(255, 255, 255, 0.12)`
- **Hover**: `rgba(255, 255, 255, 0.08)` | Border: `rgba(255, 255, 255, 0.15)`
- **Focus**: `rgba(255, 255, 255, 0.12)` | Border: `rgba(255, 255, 255, 0.35)`
- **Disabled**: `rgba(150, 150, 150, 0.1)` | Text: `rgba(150, 150, 150, 0.5)`
- **Enhanced Effects**: Multi-layer gradients, subtle grid patterns, advanced blur effects (24px)
- **Sophisticated Shadows**: Multi-layer shadows with brand color accents

### Typography & Spacing
- **Font**: Inter with fallbacks
- **Typography Scale**: 8 size variants (xs to 4xl)
- **Spacing System**: 25+ spacing utilities
- **Shadow System**: 15+ shadow variants including glass effects

## Tech Stack

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

## Current Implementation Status

### Implemented Features
- **Authentication** - LoginPage, RegisterPage, AuthLayout, B2C + B2B dual flows with dark glassmorphism design
- **B2B Registration** - BusinessRegisterPage, CompanyDetailsForm, BillingAddressForm with sophisticated multi-step interface
- **Account Type Selection** - Enhanced AccountTypeSelector with brand-consistent colors, minimalist design, and glass morphism effects
- **Multi-Step Forms** - useMultiStepForm hook for progressive registration with smooth Framer Motion animations
- **Company Validation** - Business data validation utilities with real-time feedback
- **Navigation Components** - Glassmorphism breadcrumb system with auto-route generation and smooth animations
- **UI Components** - Button, WhiteLogo, Breadcrumb, form components with dark glassmorphism styling and accessibility compliance
- **Utilities** - cn function, type definitions, validation utilities
- **Development Tools** - ESLint, Prettier, Husky hooks
- **Dark Glassmorphism UI** - Y Combinator pitch-ready design inspired by Channel Analytics and Spotify dashboards

### Project Structure
round-dashboard/
├── src/
│   ├── features/auth/ # Authentication module
│   ├── features/billing/ # Billing pages
│   ├── features/dashboard/ # Dashboard pages
│   ├── shared/components/ # UI components
│   │   ├── Breadcrumb/ # Navigation breadcrumb system
│   │   └── DashboardLayout/ # Main layout wrapper
│   ├── shared/types/ # TypeScript types
│   ├── shared/utils/ # Utility functions
│   └── test/ # Test utilities
├── .husky/ # Git hooks
└── package.json # Dependencies

## Component Architecture

### File Organization Pattern
src/components/ComponentName/
├── ComponentName.tsx # Main component (<200 lines)
├── ComponentName.test.tsx # Core tests (<150 lines)
├── ComponentName.types.ts # Type definitions (<50 lines)
├── __tests__/ # Extended test modules
│   ├── ComponentName.variants.test.tsx
│   ├── ComponentName.accessibility.test.tsx
│   └── ComponentName.interactions.test.tsx
└── index.ts # Clean exports

### Component Composition Pattern
// ✅ GOOD: Composable components
<Card>
  <Card.Header><Card.Title>Title</Card.Title></Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card>

// ❌ BAD: Monolithic props
<Card title="Title" content="Content" footer="Footer" showHeader={true} />

### Single Responsibility Principle
- **HTML Structure**: Component handles markup and props
- **CSS Styling**: Tailwind classes for styling, separate .styles.ts for complex logic
- **TypeScript Logic**: Business logic in custom hooks or utils
- **State Management**: Local state with useState/useReducer, global with Zustand

## Development Standards

### Code Standards
1. **TypeScript Strict** - Maximum type safety with all strict flags enabled
2. **Feature-Based Architecture** - Self-contained modules with lazy loading
3. **Performance** - Code splitting, memoization, virtualization
4. **Error Handling** - Structured error types with severity levels
5. **File Size Limits** - Components <200 lines, tests <150 lines, utils <100 lines

### API Naming Conventions
**CRITICAL: Follow these naming conventions consistently**

3. **API Integration Rules**:
   - **NEVER use PascalCase in frontend** - this causes undefined values
   - **Always use camelCase** to match backend JSON serialization
   - **Backend automatically converts** PascalCase → camelCase in JSON responses
   - **Frontend must access** camelCase properties from API responses


### ESLint/TypeScript Rules
1. **Nullish Coalescing** - Always use `??` instead of `||` for null/undefined checks
2. **HTML Entities** - Escape all special characters in JSX text:
   - `'` → `&apos;`
   - `"` → `&quot;`
   - `<` → `&lt;`
   - `>` → `&gt;`
3. **Import Statements** - Use proper ES6 imports, avoid `require()` in TypeScript
4. **Array Destructuring** - Use `const [first] = array` instead of `const first = array[0]`
5. **Type Safety** - Avoid `any` type, use proper type definitions or `Record<string, unknown>`
6. **React Fast Refresh** - Keep component files pure (only export components), move hooks to separate files
7. **Error Handling** - Always type caught errors as `AxiosError` or specific types instead of `unknown`
8. **Type Consistency** - Keep interface property names consistent between local and shared types
9. **Business User Types** - Always include required properties like `companyInfo` for BusinessUser types
10. **API Response Mapping** - Ensure backend property names match frontend type expectations (camelCase vs PascalCase)

### UI/UX Guidelines
1. **Glass Morphism & Aurora UI** - Semi-transparent surfaces with blur effects and gradients
2. **Dark/Light Mode** - Full theme support with accessibility compliance
3. **Micro-interactions** - Smooth animations using Framer Motion
4. **Accessibility** - WCAG compliance, ARIA standards, keyboard navigation
5. **Component-Driven** - Modular, reusable components with Tailwind CSS

### Architecture Patterns
1. **Compound Components** - Card system (Header, Title, Content, Footer)
2. **Polymorphic Components** - Button with extensive variant system
3. **Custom Hooks** - useUIState, useErrorHandler, usePagination, useTableSort
4. **State Management** - Multi-paradigm (Zustand + Context + Local)
5. **API Architecture** - Axios wrapper with interceptors, retry logic, caching

## Testing Standards

### Mandatory Rules
- Every code change MUST include tests
- 80% coverage minimum (lines, functions, branches, statements)
- Tests fail build if coverage drops below 80%

### Test Types Required
1. **Unit Tests** - All components/functions
2. **Integration Tests** - Complex user flows
3. **Accessibility Tests** - Keyboard nav, screen readers, ARIA
4. **Responsive Tests** - Mobile (375px), Tablet (768px), Desktop (1920px)

### Test Structure
describe('ComponentName', () => {
  describe('Rendering', () => {}) // Basic rendering tests
  describe('Interactions', () => {}) // User interaction tests
  describe('Accessibility', () => {}) // A11y compliance tests
  describe('Integration', () => {}) // Component integration tests
})

### Test Scenarios (ALL components)
- Renders without crashing
- Renders with required props
- Handles user interactions
- Supports keyboard navigation
- Has proper ARIA attributes
- Works on mobile/desktop

### Testing Technology
- **Framework**: Vitest (fast, Vite-native)
- **Testing Library**: React Testing Library
- **Environment**: jsdom (DOM simulation)
- **User Events**: @testing-library/user-event
- **Coverage**: V8 provider

### Pre-commit Hooks
.husky/pre-commit runs:
1. npm run format (Prettier formatting)
2. npm run lint:fix (ESLint auto-fix)
3. npm run type-check (TypeScript validation)
4. npm run test:coverage (Coverage check)
5. git add -A (Stage formatted files)
6. Fail commit if coverage <80%

## API Client Architecture
- **Axios Wrapper**: Custom ApiClient class with request/response interceptors
- **Automatic Retry**: Exponential backoff with response caching (TTL)
- **Request Tracking**: Request ID tracking for debugging
- **Type Safety**: Generic methods with proper TypeScript support
- **Error Handling**: Structured API error responses with retry logic

## Error Handling System
- **Structured Types**: Enum-based categorization (NETWORK, AUTH, VALIDATION, etc.)
- **Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL with appropriate handling
- **Sentry Integration**: Comprehensive error reporting with context
- **Toast Notifications**: User-friendly error messaging

## Performance Optimizations
- **Code Splitting**: Route-level and component-level splitting
- **Lazy Loading**: Dynamic imports for non-critical components
- **Memoization**: Strategic use of React.memo and useMemo
- **Virtualization**: For large lists and tables

## State Management Strategy
- **Zustand**: Global application state
- **React Context**: User/account management
- **Custom Hooks**: Feature-specific state
- **Local State**: Component-level interactions

## Test Patterns
// ✅ GOOD: Tests user behavior
test('submits form when user clicks submit', async () => {
  const handleSubmit = vi.fn()
  render(<Form onSubmit={handleSubmit} />)
  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(handleSubmit).toHaveBeenCalled()
})

// ❌ BAD: Tests implementation details
test('calls setState when input changes', () => {
  // Don't test internal state changes
})

## Rules

**CRITICAL**: When making ANY changes to the project:

1. **Update this CLAUDE.md file** immediately
2. **Update project structure** if adding new directories/files
3. **Document new dependencies** in tech stack section
4. **Add new commands** to development commands
5. **Update environment variables** if adding new ones
6. **WRITE TESTS** for all new functionality
7. **MAINTAIN 80%+ test coverage** at all times
8. **UPDATE test documentation** when test patterns change

This ensures AI context remains accurate, development stays consistent, and code quality is maintained.

---
*Keep this file updated with every significant change to maintain accurate AI context.*