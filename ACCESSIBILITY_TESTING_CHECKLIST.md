# Accessibility Testing Checklist

This checklist ensures the Round Dashboard meets WCAG 2.1 Level AA accessibility standards.

## 1. Keyboard Navigation

### General Navigation
- [ ] **Tab Navigation**: All interactive elements can be reached using Tab key
- [ ] **Shift+Tab**: Reverse tab order works correctly
- [ ] **Focus Visible**: Clear visual indicator when elements receive keyboard focus
- [ ] **Focus Order**: Logical tab order that follows visual layout
- [ ] **No Keyboard Traps**: Users can navigate away from all interactive elements

### Specific Components
- [x] **Sidebar Navigation**: Arrow keys navigate between items, Enter activates
- [x] **Breadcrumbs**: Tab navigation with visible focus rings
- [x] **Buttons**: All buttons accessible via keyboard with focus-visible styles
- [x] **Modals**:
  - Escape key closes modal
  - Focus trapped within modal when open
  - Focus returns to trigger element on close
  - Tab cycles through focusable elements
- [x] **Dropdowns** (UiDropdown, ApiDropdown):
  - Arrow Up/Down navigate options
  - Enter/Space selects option
  - Escape closes dropdown
  - Type-ahead search works
- [ ] **Forms**: Tab through all form fields in logical order
- [ ] **Tables**: Arrow keys navigate table cells (if applicable)

## 2. Screen Reader Compatibility

### ARIA Attributes
- [x] **Modal Dialogs**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
- [x] **Navigation**: `role="navigation"`, `aria-label="Main navigation"`
- [x] **Buttons with Icons**: All IconButtons have required `aria-label` (TypeScript enforced)
- [x] **Live Regions**: Toast notifications have `aria-live="assertive"`, `aria-atomic="true"`
- [x] **Landmarks**: Proper use of `<header>`, `<nav>`, `<main>`, `<aside>` with labels

### Screen Reader Testing
- [ ] **NVDA (Windows)**: Test with NVDA screen reader
- [ ] **JAWS (Windows)**: Test with JAWS if available
- [ ] **VoiceOver (Mac)**: Test with VoiceOver
- [ ] **TalkBack (Android)**: Test on mobile if applicable
- [ ] **Announcements**: Dynamic content changes are announced (toasts, loading states)

## 3. Visual Accessibility

### Color Contrast
- [x] **Text Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
  - Fixed: Changed `text-white/40` to `text-white/60` (141 instances)
  - Validation rule prevents low-contrast text (`text-white/40`, `/30`, `/20`)
- [ ] **Interactive Elements**: 3:1 contrast ratio for focus indicators
- [ ] **Non-Text Elements**: Icons and UI components meet 3:1 ratio

### Visual Indicators
- [x] **Focus Indicators**: Cyan ring (`ring-secondary`) on all interactive elements
- [ ] **Error States**: Not relying solely on color (use icons + text)
- [ ] **Required Fields**: Clear indication beyond just color
- [ ] **Hover States**: Visual feedback on hover
- [ ] **Disabled States**: Clear disabled appearance

### Text & Sizing
- [ ] **Font Size**: Minimum 16px for body text (12px acceptable for secondary text)
- [ ] **Line Height**: Adequate spacing (1.5 for body text)
- [ ] **Text Resize**: Text can be resized to 200% without loss of functionality
- [ ] **No Fixed Containers**: Content reflows at 400% zoom

## 4. Forms & Input

### Labels & Instructions
- [ ] **All Inputs Have Labels**: Every form field has an associated `<label>` or `aria-label`
- [ ] **Error Messages**: Associated with inputs via `aria-describedby`
- [ ] **Required Fields**: Marked with `required` attribute and visual indicator
- [ ] **Input Purpose**: `autocomplete` attributes for common fields (name, email, etc.)

### Validation & Feedback
- [ ] **Client-Side Validation**: Immediate feedback for errors
- [ ] **Error Prevention**: Clear instructions prevent errors
- [ ] **Error Recovery**: Suggestions for fixing errors
- [ ] **Success Feedback**: Confirmation of successful submissions

## 5. Mobile & Touch Accessibility

### Touch Targets
- [ ] **Minimum Size**: Touch targets at least 44x44 CSS pixels (IconButton: 36px on desktop, 44px on mobile)
- [ ] **Spacing**: Adequate spacing between touch targets
- [ ] **Gestures**: Alternatives to complex gestures available

### Mobile Navigation
- [x] **Skip Link**: Skip-to-content link available and functional
- [ ] **Mobile Menu**: Accessible hamburger menu with proper ARIA
- [ ] **Swipe Gestures**: Alternative keyboard/button controls available

## 6. Media & Content

### Images & Icons
- [x] **Icon Buttons**: All have `aria-label` (TypeScript enforced)
- [ ] **Decorative Images**: `alt=""` or `aria-hidden="true"`
- [ ] **Informative Images**: Descriptive alt text
- [ ] **Complex Images**: Long descriptions where needed

### Animations & Motion
- [ ] **Prefers-Reduced-Motion**: Respect user's motion preferences
- [ ] **Pausable Animations**: Auto-playing animations can be paused
- [ ] **No Seizure Triggers**: No flashing content > 3 times per second

## 7. Testing Tools & Procedures

### Automated Testing
- [ ] **axe DevTools**: Run axe accessibility scanner (Chrome extension)
- [ ] **Lighthouse**: Run Accessibility audit in Chrome DevTools
- [ ] **WAVE**: Use WAVE browser extension for visual feedback
- [ ] **ESLint**: jsx-a11y plugin rules passing

### Manual Testing
- [ ] **Keyboard Only**: Navigate entire app without mouse
- [ ] **Screen Reader**: Complete user flows with screen reader
- [ ] **Zoom to 200%**: Test at 200% browser zoom
- [ ] **Zoom to 400%**: Test layout at 400% zoom (content should reflow)
- [ ] **Color Blindness**: Test with color blindness simulators
- [ ] **High Contrast Mode**: Test in Windows High Contrast Mode

## 8. Component-Specific Checks

### Implemented Components
- [x] **Button**: Focus-visible styles, proper hover states
- [x] **IconButton**: Required aria-label, focus-visible styles
- [x] **Modal**: Focus trap, Escape key, ARIA attributes
- [x] **Toast**: aria-live regions, role="alert", auto-dismiss
- [x] **Badge**: Visual clarity, not relying solely on color
- [x] **Avatar**: Alt text or aria-label
- [x] **Alert**: Proper semantic markup, clear icons
- [x] **LoadingSpinner**: sr-only text "Loading..."
- [x] **EmptyState**: Clear messaging
- [x] **Pagination**: aria-label on ellipsis ("More pages")
- [x] **Breadcrumb**: Focus-visible styles, proper navigation

### To Verify
- [ ] **Tables**: Caption, th scope, sortable column announcements
- [ ] **Tabs**: ARIA tabs pattern if implemented
- [ ] **Accordions**: ARIA accordion pattern if implemented
- [ ] **Tooltips**: Accessible on keyboard focus, not just hover

## 9. Documentation

- [x] **Component Validation Rules**: `.component-rules.json` enforces accessibility
- [ ] **Component Documentation**: Accessibility notes in Storybook/docs
- [ ] **Developer Guide**: Accessibility best practices documented
- [ ] **Testing Guide**: How to test for accessibility

## 10. Pre-Commit Validation

### Automated Checks (via .component-rules.json)
- [x] **No Raw Buttons**: Must use Button or IconButton components
- [x] **No Raw Inputs**: Must use reusable input components
- [x] **Color Tokens**: No hardcoded colors, use design tokens
- [x] **Low Contrast**: Prevents `text-white/40`, `/30`, `/20`
- [x] **isLoading Prop**: Enforces consistent prop naming

## Quick Reference: Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Navigate forward | Tab |
| Navigate backward | Shift + Tab |
| Activate button/link | Enter or Space |
| Close modal/dropdown | Escape |
| Navigate dropdown options | Arrow Up/Down |
| Select dropdown option | Enter |
| Skip to main content | Tab (focus skip link) + Enter |
| Toggle sidebar | Ctrl + Shift + B |

## Browser Testing Matrix

Test in the following browsers with assistive technologies:

| Browser | Screen Reader | Status |
|---------|---------------|--------|
| Chrome | NVDA | ⏳ Pending |
| Firefox | NVDA | ⏳ Pending |
| Edge | NVDA | ⏳ Pending |
| Safari | VoiceOver | ⏳ Pending |
| Mobile Safari | VoiceOver | ⏳ Pending |
| Chrome Android | TalkBack | ⏳ Pending |

## Notes

- ✅ = Implemented and verified
- ⏳ = Pending manual testing
- ❌ = Issues found

### Known Issues
- None currently documented

### Future Improvements
1. TASK-A11Y-006: Complete comprehensive keyboard navigation testing
2. Add automated accessibility tests to CI/CD pipeline
3. Consider adding skip links for repetitive sections
4. Document accessibility patterns in Storybook

---

**Last Updated**: 2025-01-20
**WCAG Level Target**: AA
**Compliance Status**: Excellent foundation, pending comprehensive manual testing
