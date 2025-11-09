# Round - AI Context Guide

## DEVELOPMENT RULES

### Backend as Source of Truth
**CRITICAL RULE**: Never use frontend fallbacks for data that should come from the backend. The backend is always the source of truth.

**Examples of what NOT to do**:
- Frontend currency symbol fallbacks when backend provides currency data
- Hardcoded dropdown options when API provides the data
- Client-side data transformations that duplicate backend logic

**Always**:
- Use backend data directly without client-side fallbacks
- Display loading states while waiting for backend data
- Handle backend errors properly without masking them with fallbacks
- Trust the backend data structure and content

## Google OAuth Authentication Changes (IMPORTANT)

### Updated Google Registration Flow

**CRITICAL CHANGE**: Google OAuth now creates BUSINESS accounts instead of personal accounts.

**Flow Changes**:
1. **Google Login** → Creates business account with minimal org data
2. **Redirect to `/get-started`** → User completes business setup
3. **Get-Started Flow** → Collects company info, billing address, business settings

**Frontend Changes**:
- `GoogleLoginButton.tsx`: Always sets `accountType: 'business'` 
- All Google users redirect to `/get-started` for business onboarding
- Get-started page handles missing company information gracefully

**Backend Changes**:
- `GoogleAuthAsync`: Creates business organization with `Category = "business"`
- Sets `AccountType.Business` instead of `AccountType.Personal`
- Default organization type is `"Corporation"` instead of `"Individual"`

**Rationale**: 
- Consistent business-focused platform experience
- Streamlined onboarding through get-started flow
- Business information collected where users expect it

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

### Responsive Design System
- **Mobile-first approach** with xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) breakpoints
- **Touch-friendly interface** with minimum 44px tap targets on mobile
- **Adaptive layouts** that gracefully scale from mobile to desktop
- **Safe area support** for modern mobile devices
- **No iOS zoom** - 16px minimum font size on form inputs
- **Accessible focus states** - 1px cyan border, no ring/shadow

### Mobile-Specific Enhancements
- **Sidebar behavior** - Overlay on mobile/tablet, persistent on desktop
- **Form inputs** - 16px font size minimum to prevent iOS zoom, improved touch targets  
- **Button sizing** - Enhanced touch targets with minimum heights
- **Responsive spacing** - Adaptive padding and margins based on screen size
- **Safe area handling** - Support for device notches and rounded corners

### Polar.sh-Inspired Design System (MANDATORY)

**CRITICAL**: ALL UI components MUST follow the new clean, instant-interaction design system inspired by Polar.sh's minimalist aesthetic.

#### Core Design Principles

1. **Zero Animations for Interactive Components**: Dropdowns, buttons, and inputs respond instantly without transitions
2. **Solid Backgrounds**: No glassmorphism - clean solid colors with crisp borders
3. **Lighter Typography**: Inter font family with baseline weight 300, promoting a clean, modern look
4. **Instant Feedback**: No delays, no transitions - immediate visual response

#### Color Palette

```css
/* Backgrounds */
- **Primary Background**: `#171719` (main surfaces, cards, dropdowns)
- **Page Background**: `#0a0a0a` (darker base)

/* Borders */
- **Default Border**: `#333333` (neutral state)
- **Hover Border**: `#404040` (subtle hover enhancement)
- **Focus Border**: `#14bdea` (cyan accent, 1px solid)
- **Error Border**: `#ef4444` (validation errors)

/* Brand Colors */
- **Primary**: `#D417C8` (Accent Pink)
- **Secondary**: `#14BDEA` (Accent Cyan)
- **Accent**: `#7767DA` (Purple)

/* Focus States */
- **Focus Ring**: NONE - use 1px border only
- **Focus Border**: `border-[#14bdea]` (cyan accent)
```

#### Status Colors (No Gradients)
- **Success**: Text `#38D39F`, Border `#38D39F`
- **Warning**: Text `#FF9F0A`, Border `#FF9F0A`
- **Error**: Text `#FF3B30`, Border `#FF3B30`
- **Info**: Text `#32A1E4`, Border `#32A1E4`

#### Typography System (Polar.sh-Inspired)

A **lighter, cleaner typography system** with Inter font family:

```css
/* Font Configuration */
- **Font Family**: Inter, system-ui, -apple-system
- **Letter Spacing**: -0.01em (slightly tighter for cleaner look)
- **Baseline Weight**: 300 (light) for most text

/* Typography Hierarchy */
- Main Page Title: `text-base font-normal` (16px/400)
- Section Titles: `text-sm font-normal` (14px/400)
- Card Titles: `text-sm font-normal` (14px/400)
- Body Text: `text-sm font-light` (14px/300)
- Labels: `text-xs font-normal` (12px/400)
- Placeholders: `text-sm font-light` (14px/300)
- Small Text: `text-[11px] font-light` (11px/300)
```

**Weight Guidelines:**
- **NEVER use** `font-medium` for body text (too heavy)
- **Replace** `font-semibold` and `font-bold` with `font-medium` (500)
- **Default to** `font-normal` (400) or `font-light` (300)
- **Use** `font-medium` (500) sparingly for emphasis only

**Key Principles:**
- **Lighter weights** create a more refined, less aggressive appearance
- **Tighter letter spacing** (`-0.01em`) improves density and readability
- **Minimal weight variation** keeps the UI calm and professional
- **No heavy fonts** - max weight is `font-medium` (500)

### Dropdown Component Guidelines

The dashboard includes two dropdown components with distinct purposes:

#### UiDropdown Component (`/shared/components/Dropdown/UiDropdown.tsx`)

**Purpose**: Generic reusable dropdown for non-API data (static options, client-side data)

**Key Features:**
- Zero animations - instant open/close
- Searchable with built-in search input
- Multi-select support with checkmarks
- Automatic positioning (calculates available space)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Click-outside detection to close
- Custom render support for complex options

**Usage Example:**
```tsx
<UiDropdown
  options={['Option 1', 'Option 2', 'Option 3']}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Select option..."
  searchable={true}
/>
```

**Design Specifications:**
- Background: `#171719` (solid, no transparency)
- Border: `#333333` default, `#14bdea` focus, `#404040` hover
- Height: `h-10` mobile, `h-9` desktop
- No transitions or animations
- Instant feedback on all interactions

#### ApiDropdown Component (`/shared/components/Dropdown/ApiDropdown.tsx`)

**Purpose**: Dropdown for API-driven data (countries, industries, currencies, etc.)

**Key Features:**
- Same instant-interaction design as UiDropdown
- Loads data from API endpoints
- Caches responses for performance
- Loading states and error handling
- Same search and keyboard navigation
- Automatic retry logic

**Usage Example:**
```tsx
<ApiDropdown
  apiEndpoint="/api/countries"
  value={selectedCountry}
  onChange={setSelectedCountry}
  placeholder="Select country..."
  labelKey="name"
  valueKey="id"
/>
```

**When to Use Which:**
- **UiDropdown**: Static lists, client-side filtering, custom data structures
- **ApiDropdown**: Dynamic data from backend, countries, industries, currencies

**Critical Rules:**
- NEVER add Framer Motion to either component
- NEVER add CSS transitions to interactive states
- Keep instant open/close behavior
- Maintain consistent styling between both components

#### Responsive Component Sizing

- **Mobile (≤767px)**: Compact sizing for space efficiency
  - Input Fields: `h-10` (40px) - Touch-friendly
  - Buttons: `h-10` (40px) - Consistent interaction targets
  - Dropdowns: `h-10` (40px) - Match inputs for form consistency

- **Desktop (≥768px)**: Optimal sizing for usability
  - Input Fields: `h-9` (36px) - Balanced usability
  - Buttons: `h-11` (44px) - Optimal interaction targets
  - Dropdowns: `h-9` (36px) - Match inputs for form consistency

- **Text Areas**: `min-h-20` (80px) - Functional across all screens

#### Sizing & Spacing Standards

- **Border Radius**: `rounded-lg` (8px) - Consistent across all components
- **Card Padding**: Clean hierarchy for readability
  - Compact: `p-3` (12px) - Small cards, list items
  - Standard: `p-4` (16px) - Main cards, forms
  - Spacious: `p-6` (24px) - Feature sections
- **Icons**: Consistent sizing for clarity
  - Small Icons: `w-4 h-4` (16px) - Inline, table icons
  - Standard Icons: `w-5 h-5` (20px) - Buttons, cards
  - Large Icons: `w-6 h-6` (24px) - Feature highlights
- **Grid Gaps**: `gap-4` to `gap-6` based on content density


#### Component Standards

- **Consistent Components**: Always use updated shared components (Button, Card, Input, etc.)
- **Responsive Sizing**: Use appropriate mobile/desktop breakpoints for touch targets
- **Accessibility**: Minimum 44px touch targets on mobile, proper ARIA labels
- **Form Consistency**: Match input and dropdown heights within forms

## Tech Stack

### Frontend Core
- **React 18.2.0** + TypeScript 5.3.3
- **Vite 5.4.19** (build tool)
- **React Router DOM 7.5.2** (routing)
- **Tailwind CSS 3.4.3** (styling)
- **Framer Motion 12.12.1** (animations - **NOT used in interactive components**)
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

### Performance Optimizations
- **Form Change Detection** - `useFormChangeDetection` hook prevents unnecessary API calls by tracking actual data changes
- **Debounced Updates** - `useDebouncedUpdate` hook throttles API calls with configurable delays
- **Countries/Currencies Caching** - Module-level caching with promise deduplication for static data

## Current Implementation Status

### Implemented Features
- **Authentication** - LoginPage, RegisterPage, AuthLayout, B2C + B2B dual flows with design
- **B2B Registration** - BusinessRegisterPage, CompanyDetailsForm, BillingAddressForm with multi-step interface
- **Account Type Selection** - Enhanced AccountTypeSelector with brand-consistent colors and minimalist design
- **Multi-Step Forms** - useMultiStepForm hook for progressive registration
- **Company Validation** - Business data validation utilities with real-time feedback
- **Navigation Components** - Breadcrumb system with auto-route generation
- **UI Components** - Button, WhiteLogo, Breadcrumb, form components with clean, solid styling
- **Dropdown Components** - UiDropdown and ApiDropdown with instant interactions (zero animations)
- **Utilities** - cn function, type definitions, validation utilities
- **Development Tools** - ESLint, Prettier, Husky hooks
- **Clean Minimal UI** - Y Combinator pitch-ready design with solid backgrounds and instant interactions Polar.sh and Spotify inspired

### Project Structure
round-dashboard/
├── src/
│   ├── features/auth/ # Authentication module
│   ├── features/billing/ # Billing pages
│   ├── features/catalog/ # Product catalog with reusable components
│   ├── features/dashboard/ # Dashboard pages
│   ├── shared/components/ # UI components
│   │   ├── Breadcrumb/ # Navigation breadcrumb system
│   │   ├── Button/ # Enhanced button with variants
│   │   ├── DashboardLayout/ # Main layout wrapper
│   │   ├── Dropdown/ # UiDropdown and ApiDropdown (zero animations)
│   │   ├── FormInput/ # Form input with validation
│   │   ├── Modal/ # Reusable modal component
│   │   ├── Card/ # Universal card component for all card-like elements
│   │   ├── NavigationCard/ # Card component for navigation items
│   │   ├── SectionHeader/ # Consistent section headers with accents
│   │   └── StatsCard/ # Statistics display cards with trends
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

### Global Toast System (MANDATORY)

**CRITICAL**: Always use the global toast system for all user notifications. Never create local toast implementations.

#### Usage Rules
- **MANDATORY**: Use `useGlobalToast()` for ALL user notifications
- **NEVER**: Create local toast state or components
- **ALWAYS**: Import from `@/shared/contexts/ToastContext`

#### Implementation
```tsx
import { useGlobalToast } from '@/shared/contexts/ToastContext'

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useGlobalToast()
  
  // ✅ CORRECT: Use global toast
  const handleSuccess = () => {
    showSuccess('Operation completed successfully!')
    showError('Something went wrong', { field: 'Validation error' })
    showWarning('Please check your input')
    showInfo('Processing your request...')
  }
  
  // ❌ NEVER DO: Local toast state
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  <Toast isVisible={localToast.isVisible} .../> // DON'T DO THIS
}
```

#### Toast Features
- **Types**: success (green), error (red), warning (yellow), info (blue)
- **Position**: Always top-right corner globally
- **Auto-close**: 5 seconds with manual close option
- **Details**: Support for additional error details object
- **Animations**: Consistent Framer Motion animations

#### Architecture
- **ToastProvider**: Wraps entire app in App.tsx
- **Single Toast**: One toast component globally positioned
- **Global State**: Centralized toast state management
- **Consistent UX**: Same behavior across entire application

### Bad pattern 
#### Avoiding useEffect Anti-Patterns in React

`useEffect` is useful but often misused. Use it only for real side effects.

##### When useEffect is OK
- Data fetching (prefer `useQuery`, `SWR`)
- Event subscriptions, cleanup
- DOM manipulation
- Syncing with non-React state (timers, localStorage)

##### Common Anti-Patterns

###### 1. Deriving state from props
```tsx
// Bad
useEffect(() => { setX(a + 1); }, [a]);
// Good
const x = a + 1;
```

###### 2. Manual data fetching
```tsx
// Bad
useEffect(() => {
  fetch('/api').then(res => res.json()).then(setData);
}, []);
// Good
const { data } = useQuery(['data'], fetchData);
```

###### 3. Responding to state
```tsx
// Bad
useEffect(() => { if (flag) doSomething(); }, [flag]);
// Good
handleAction() {
  setFlag(true);
  doSomething();
}
```

## Best Practices

| Goal            | Better Approach        |
|-----------------|------------------------|
| Derived values  | Inline or `useMemo`    |
| Fetching data   | `useQuery`, `SWR`      |
| Layout effects  | `useLayoutEffect` or CSS |
| Global state    | `useContext`, `zustand` |
| Event handling  | In handlers, not effects |

Avoid `useEffect` for things React can do declaratively.

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
6. **Global Toast System** - **MANDATORY**: Always use `useGlobalToast()` for notifications, never create local toast implementations

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
1. **Solid Design** - Clean solid backgrounds (#171719), crisp borders, zero animations on interactive components
2. **Instant Interactions** - No transitions or animations on dropdowns, buttons, or form inputs
3. **Lighter Typography** - Inter font with baseline weight 300, lighter weights throughout
4. **Accessibility** - WCAG compliance, ARIA standards, keyboard navigation, 44px minimum touch targets
5. **Component-Driven** - Modular, reusable components with Tailwind CSS

### Standard Component Patterns

#### ActionButton for Add/Create/New Actions
**MANDATORY**: Use `ActionButton` component for ALL add/create/new actions

### Architecture Patterns
1. **Compound Components** - Card system (Header, Title, Content, Footer)
2. **Polymorphic Components** - Button with extensive variant system
3. **Custom Hooks** - useUIState, useErrorHandler, usePagination, useTableSort, useFormChangeDetection, useDebouncedUpdate, useResponsive
4. **State Management** - Multi-paradigm (Zustand + Context + Local)
5. **API Architecture** - Axios wrapper with interceptors, retry logic, caching

### Responsive Hooks (NEW)
- **useResponsive()** - Comprehensive responsive state with debounced resize handling
- **useIsMobile()** - Simple mobile detection hook
- **useIsTablet()** - Tablet-specific detection  
- **useIsDesktop()** - Desktop detection (includes large desktop)
- **useViewport(breakpoint)** - Conditional rendering based on viewport size

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

## Component Documentation

### Card System (Updated Architecture)

**CRITICAL**: Use the improved card system with composable parts and specialized variants. The card system is now performance-optimized and fully accessible.

### SearchFilterToolbar Component

**CRITICAL**: Always use the SearchFilterToolbar component for any page that needs search and filter functionality. Do not create custom toolbar implementations.
Any modifications must maintain compatibility with all existing implementations.

---
*Keep this file updated with every significant change to maintain accurate AI context.*