# Phase 4: Component Library Optimization for v0

## Overview

This phase focuses on optimizing the Inngest component library to be fully v0.dev compatible. Components should be AI-generatable, easy to understand, and follow consistent patterns.

## v0 Component Design Principles

### 1. Clear Component Boundaries
Each component should:
- Have a single, clear responsibility
- Export a named component function
- Have well-defined TypeScript interfaces for props
- Include JSDoc comments explaining usage

```tsx
/**
 * Button component for user interactions
 * @param label - The button text
 * @param variant - Button style variant (primary, secondary, outline)
 * @param size - Button size (sm, md, lg)
 * @param onClick - Click handler function
 * @param disabled - Whether button is disabled
 */
export function Button({
  label,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
}: ButtonProps) {
  // Implementation
}
```

### 2. Semantic HTML
Use semantic HTML elements and ARIA attributes:

```tsx
// Good
<button 
  aria-label="Close dialog"
  aria-pressed={isActive}
  className="..."
>
  Close
</button>

// Avoid
<div 
  role="button" 
  onClick={handleClick}
  className="..."
>
  Close
</div>
```

### 3. Tailwind CSS Only
Use Tailwind CSS for all styling, with design tokens:

```tsx
// Good
<div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
  Content
</div>

// Avoid
<div style={{ display: 'flex', padding: '8px 16px', backgroundColor: '#6200ea' }}>
  Content
</div>
```

### 4. Props Consistency
All components should follow consistent prop patterns:

```tsx
interface BaseComponentProps {
  // Content
  children?: React.ReactNode;
  
  // Styling
  className?: string;
  
  // State
  disabled?: boolean;
  
  // Callbacks
  onClick?: () => void;
  
  // Accessibility
  ariaLabel?: string;
}
```

### 5. Export Patterns
Export components in a predictable way:

```tsx
// src/Button/Button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button {...props} />;
}
```

## Component Audit Results

### High Priority Components (Critical for Core UX)
1. **Button** - Primary interaction element
2. **Card** - Container/layout component
3. **Input** - Form input component
4. **Select** - Dropdown selection
5. **Modal/Dialog** - Overlay component
6. **Toast/Notification** - Feedback component

### Medium Priority Components (Important Features)
7. **Tabs** - Content organization
8. **Accordion** - Collapsible sections
9. **Badge** - Status indicators
10. **Loading Spinner** - Feedback state
11. **Dropdown Menu** - Navigation
12. **Tooltip** - Contextual help

### Low Priority Components (Nice to Have)
13. **Pagination** - List navigation
14. **Breadcrumbs** - Navigation trail
15. **Progress Bar** - Process feedback
16. **Timeline** - Event sequence
17. **Chart Components** - Data visualization

## Optimization Checklist

### For Each Component:

- [ ] Component has single export function
- [ ] All props are TypeScript-typed with interface
- [ ] JSDoc comment with usage example
- [ ] Uses semantic HTML (button, input, label, etc.)
- [ ] All interactive elements have aria-* attributes
- [ ] All styling uses Tailwind CSS only
- [ ] No inline styles or CSS-in-JS
- [ ] No hard-coded colors (uses design tokens)
- [ ] Responsive design using Tailwind breakpoints
- [ ] No external dependencies (except React)
- [ ] Component can be used standalone
- [ ] Props match common patterns in Radix UI / shadcn
- [ ] Has default props for optional variations
- [ ] Includes proper theme color support
- [ ] Works in both light and dark modes

## v0 Generation Best Practices

### 1. Component Naming
Name components clearly and descriptively:
- `Button` not `Btn`
- `LoadingSpinner` not `Loader`
- `ConfirmDialog` not `ConfirmBox`

### 2. Props Interface Pattern
```tsx
export interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  // Your custom props
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}
```

### 3. Variant System
Use consistent variant patterns:

```tsx
const variantClasses = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border text-foreground hover:bg-secondary/50",
};

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};
```

### 4. Composition Over Props Drilling
Prefer component composition:

```tsx
// Good - Composable
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogTitle>Title</DialogTitle>
    <DialogBody>Content</DialogBody>
  </DialogContent>
</Dialog>

// Avoid - Too many props
<Dialog
  title="Title"
  content="Content"
  trigger="Open"
  // ... many more props
/>
```

## Migration Strategy

### Phase 4A: High Priority (Week 1)
1. Refactor Button component
2. Refactor Card component
3. Refactor Input component
4. Refactor Select component
5. Refactor Modal/Dialog component
6. Refactor Toast component

### Phase 4B: Medium Priority (Week 2)
7. Refactor Tabs component
8. Refactor Accordion component
9. Refactor Badge component
10. Refactor LoadingSpinner component
11. Refactor Dropdown component
12. Refactor Tooltip component

### Phase 4C: Low Priority (Week 3)
13. Refactor Pagination component
14. Refactor Breadcrumbs component
15. Refactor Progress component
16. Refactor Timeline component
17. Refactor Chart components

## Example Refactoring: Button Component

### Before (Current)
```tsx
// Complex, hard to understand
export const Button = ({ 
  className, 
  variant, 
  size, 
  isLoading, 
  isDisabled,
  leftIcon,
  rightIcon,
  ...rest 
}: any) => {
  const buttonClass = `inline-flex items-center justify-center...`;
  return <button className={buttonClass} {...rest} />;
};
```

### After (v0 Optimized)
```tsx
/**
 * Primary interactive button component
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={() => {}}>
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input text-foreground hover:bg-secondary/50",
    ghost: "text-foreground hover:bg-secondary/30",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
```

## Testing Strategy

### Unit Tests
- Component renders with default props
- All variants render correctly
- Size prop changes dimensions
- Disabled state prevents interaction
- Accessibility attributes present

### Visual Tests
- Component works in light mode
- Component works in dark mode
- Responsive on mobile/tablet/desktop
- Hover states visible
- Focus states for keyboard navigation

### Accessibility Tests
- Keyboard navigation works
- Screen reader announces label
- Color contrast meets WCAG AA
- Focus indicator visible
- ARIA attributes correct

## Documentation

Each component should have:
- Component name and description
- Import statement
- Basic usage example
- All props with descriptions
- Variants showcase
- Accessibility notes
- Related components

## Success Metrics

- All high-priority components refactored
- 100% TypeScript coverage
- 0 linting errors
- All components work in light/dark modes
- v0 can generate new instances without errors
- Components are in separate files
- Clear naming and organization

## Next Steps

1. Start with high-priority components
2. Create test file for each component
3. Update Storybook stories
4. Run accessibility audits
5. Update component documentation
6. Test v0 generation on each component
