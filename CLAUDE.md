# 🚀 Project Standards & UI/UX Trends (2025)

## Color Palette & Design System

### Main Colors (Gradient-friendly)
- **Accent Pink**: `#D417C8` - Primary brand color
- **Accent Cyan**: `#14BDEA` - Secondary brand color  
- **Secondary Purple**: `#7767DA` - Accent color

These main colors are optimized for glass-style UI and gradient-based designs.

### Gradient Feedback Colors

#### Success (Emerald Gradient)
- **Gradient**: `#42E695` → `#3BB2B8`
- **Background (glass-style)**: `rgba(66, 230, 149, 0.1)`
- **Text/Icons**: `#38D39F`

#### Warning (Amber Gradient)
- **Gradient**: `#FFC107` → `#FF8A00`
- **Background (glass-style)**: `rgba(255, 193, 7, 0.1)`
- **Text/Icons**: `#FF9F0A`

#### Error (Coral Gradient)
- **Gradient**: `#FF4E50` → `#F44336`
- **Background (glass-style)**: `rgba(244, 67, 54, 0.1)`
- **Text/Icons**: `#FF3B30`

#### Info (Cyan-Purple Gradient)
- **Gradient**: `#14BDEA` → `#7767DA`
- **Background (glass-style)**: `rgba(20, 189, 234, 0.1)`
- **Text/Icons**: `#32A1E4`

### Neutral & Utility Glass Colors

#### Glass Background
- **Background**: `rgba(255, 255, 255, 0.08)`
- **Border**: `rgba(255, 255, 255, 0.15)`
- **Shadow**: `rgba(0, 0, 0, 0.1)`

#### Glass Card Highlight (Hover effect)
- **Background**: `rgba(255, 255, 255, 0.12)`
- **Border**: `rgba(255, 255, 255, 0.2)`

#### Disabled State
- **Background**: `rgba(150, 150, 150, 0.1)`
- **Text**: `rgba(150, 150, 150, 0.5)`

### Usage Guidelines
- Use gradient colors for vibrant, modern feel with glassmorphism
- Glass-style backgrounds provide depth and modern aesthetics
- Colors maintain excellent visual contrast and readability
- Palette aligns with existing primary and accent colors

## 🛠 Tech Stack

- **Framework:** React
- **Styling:** Tailwind CSS
- **Component Library:** NextUI
- **Icons:** React-icons
- **Fonts:** Google Fonts – *Inter*
- **Testing:** Vitest & React Testing Library
- **State Management:** Zustand
- **API Client:** Custom client (`src/api/apiClient.ts`)

---

## 🎯 Latest Trends in UI/UX (2025)

The following UI/UX trends should be consistently applied:

1. 🧊 **Glassmorphism & Aurora UI**

   - Semi-transparent, blurred-glass surfaces with vivid gradients.
   - Emphasis on depth, shadows, and subtle highlights.

2. 🌑 **Dark & Light Mode Integration**

   - Support both modes.
   - Ensure good contrast and accessibility.

3. 🎨 **Microinteractions & Motion Design**

   - Smooth, subtle animations using Framer Motion.

4. 📱 **Adaptive & Fluid UI**

   - Design adaptive interfaces considering user context and device capability.

5. 🤖 **Conversational and AI-Driven UI**

   - Integrate natural language processing (chatbots, voice).
   - Personalization with AI.

6. 🎭 **Neumorphism (Selective Use)**

   - Use soft, embossed UI elements sparingly as accents.

7. 🎖️ **Minimalism & Cleanliness**

   - Minimalist aesthetics with careful typography.
   - Simplified design to reduce cognitive load.

8. 📌 **Accessibility as Core Principle**

   - Inclusive typography, ARIA standards, and accessible color schemes.

9. 💡 **Advanced Typography & Variable Fonts**

   - Use expressive, dynamic fonts for enhanced performance.

10. 🚀 **Utility-First & Component-Driven Development**

    - Modular, reusable components leveraging Tailwind CSS and NextUI.

---

## 📁 Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Shared components
├── features/         # Feature-based modules
├── hooks/            # Custom React hooks
├── layouts/          # Layout components
├── pages/            # Page components
├── services/         # Shared services
├── store/            # Zustand state management
├── styles/           # Global styles
├── types/            # TypeScript types
└── utils/            # Utility functions
```

---

## ⚙️ ESLint & Prettier

- **ESLint:** Configured in `.eslintrc.js`
- **Prettier:** Configured in `.prettierrc`

---

## 🔎 Testing

- Use **Vitest** and **React Testing Library**.
- Tests located in the `__tests__` directory alongside source files.

---

## 🔐 API Client (`src/api/apiClient.ts`)

Includes:

- Request/response interceptors
- Centralized error handling
- Authentication
- Automatic retry logic

---

## 🐞 Error Handling Strategy

- **React Error Boundaries** for component errors
- **Global API Client Error Handling**
- **Logger service** for error tracking

---

## 🌐 Environment Variables

Required environment variables:

- `VITE_API_BASE_URL` - Base URL for API calls

---

## 📝 Documentation Maintenance

**IMPORTANT:** When adding new files, components, or making structural changes to the project:

1. **Update this CLAUDE.md file** to reflect the changes
2. **Update project structure** section if new directories/files are added
3. **Add any new commands** or environment variables to relevant sections
4. **Document new dependencies** or tech stack changes

This ensures AI context remains accurate and up-to-date for future interactions.

---