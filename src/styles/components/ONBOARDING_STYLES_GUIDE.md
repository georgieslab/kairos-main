# Onboarding Component Styles Guide

## Overview
The UserOnboarding component now has dedicated CSS following the same design system as ProfileScreen for consistency.

## Design System

### Color Palette
- **Primary Green**: `#558b6e` (rgb: 85, 139, 110)
- **Success**: `#10b981`
- **Info**: `#3b82f6`

### Spacing Scale
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 0.75rem (12px)
- `lg`: 1rem (16px)
- `xl`: 1.5rem (24px)
- `2xl`: 2rem (32px)
- `3xl`: 3rem (48px)

### Border Radius
- `sm`: 0.375rem
- `md`: 0.5rem
- `lg`: 0.75rem
- `xl`: 1rem
- `2xl`: 1.5rem
- `full`: 9999px

### Typography
- `xs`: 0.75rem
- `sm`: 0.875rem
- `base`: 1rem
- `lg`: 1.125rem
- `xl`: 1.25rem
- `2xl`: 1.5rem
- `3xl`: 1.875rem

## Key Components

### Container
```css
.onboarding-container
```
- Full-height container with gradient background
- Fade-in animation on mount

### Card
```css
.onboarding-card
```
- Main content card with glass morphism effect
- Hover effect with enhanced shadow
- Responsive padding

### Progress Indicator
```css
.onboarding-progress-dots
.onboarding-progress-dot
.onboarding-progress-dot.active
.onboarding-progress-dot.completed
```
- Animated dots showing current step
- Active dot expands and glows
- Completed dots fade opacity

### Toggle Switch
```css
.onboarding-toggle
.onboarding-toggle-input
.onboarding-toggle-slider
```
- Custom styled checkbox
- Smooth sliding animation
- Green glow when active

### Goals Selection
```css
.onboarding-goal-button
.onboarding-goal-button.selected
.onboarding-goal-check
```
- Interactive buttons with hover effects
- Selected state with gradient background
- Animated checkmark icon

### Navigation
```css
.onboarding-button
.onboarding-button-back
.onboarding-button-next
```
- Primary gradient button for "Next"
- Secondary outlined button for "Back"
- Smooth transform animations

## Animations

### Available Keyframes
1. **fadeIn** - Gentle opacity fade
2. **slideUp** - Upward slide with bounce
3. **iconFloat** - Floating icon animation
4. **expandDown** - Expand animation for time input
5. **pulse** - Loading pulse effect

## Theme Support

### Dark Theme (Default)
- Background: `#0f1419` → `#1a1e2a` gradient
- Card: `#1e2430` with blur
- Text: `#f8fafc` (primary), `#cbd5e1` (secondary)
- Borders: `#334155`

### Light Theme
Add `.onboarding-light` class to container for light mode

## Responsive Breakpoints

### Mobile (< 480px)
- Reduced padding
- Smaller title (2xl instead of 3xl)
- Smaller icon (48px instead of 64px)

### Desktop (> 768px)
- Wider max-width (560px)
- Increased card padding

## Accessibility

### Focus States
All interactive elements have:
- 2px solid primary outline
- 2px offset
- Visible on keyboard navigation

### Reduced Motion
Respects `prefers-reduced-motion` media query
- Disables all animations
- Maintains functionality

## Usage Example

```jsx
import '../../styles/components/onboarding.css';

<div className="onboarding-container">
  <div className="onboarding-main">
    <div className="onboarding-content">
      <div className="onboarding-card">
        {/* Your content here */}
      </div>
    </div>
  </div>
</div>
```

## Integration with Profile.css

The onboarding styles use the same:
- Variable naming convention (`--onboarding-*`)
- Spacing scale
- Color system
- Animation timing functions
- Accessibility patterns

This ensures visual consistency across the app while maintaining component isolation.

## Performance

### Optimizations
- CSS variables for theme switching (no recalculation)
- GPU-accelerated transforms (translateY, scale)
- Efficient animations (opacity, transform only)
- Minimal reflows/repaints

### File Size
- ~8KB unminified
- ~2KB gzipped
- No external dependencies
