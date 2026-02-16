# v0 Component Refactoring Guide

## Overview
This guide provides patterns and best practices for refactoring the Inngest component library to be AI-generatable and maintainable with v0. The goal is to create components that v0 can easily understand, modify, and generate.

## Core Principles

### 1. Separation of Concerns
**Bad**: Business logic mixed with presentation
```tsx
// ❌ Don't do this
export function Button({ onClick, loading, ...props }) {
  const [state, setState] = useState();
  useEffect(() => {
    // Complex API logic here
    fetchData();
  }, []);
  return <button onClick={() => { onClick(); setState(...) }} {...props} />
}
```

**Good**: Clear presentational component
```tsx
// ✅ Do this
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**Loading state indicator */
  loading?: boolean;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, variant = 'primary', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variantStyles[variant], sizeStyles[size])}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && children}
    </button>
  )
);
Button.displayName = 'Button';
```

### 2. TypeScript-First with JSDoc
**Every prop should be documented**:
```tsx
interface ComponentProps {
  /** The primary action label */
  label: string;
  
  /** Handler called when button is clicked
   * @param event - The click event */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Whether the component is in a loading state
   * @default false */
  loading?: boolean;
  
  /** Visual style variant
   * @default 'primary' */
  variant?: 'primary' | 'secondary' | 'danger';
}
```

### 3. Compound Component Pattern
**For complex UI that needs internal state**:
```tsx
// ✅ Compound components are v0-friendly
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = React.createContext<TabsContextType | null>(null);

export function TabsRoot({ value, onValueChange, children }: TabsProps) {
  return (
    <Tabs.Provider value={{ value, onValueChange }}>
      <div className="tabs">{children}</div>
    </Tabs.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="tabs-list">{children}</div>;
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(Tabs);
  return (
    <button onClick={() => context?.onValueChange?.(value)}>
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(Tabs);
  return context?.value === value ? <div>{children}</div> : null;
}
```

### 4. Utility Functions vs Components
**Extract styling logic to utilities**:
```tsx
// util.ts - Pure, testable, v0-understandable
export function getButtonStyles(variant: string, size: string): string {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-black hover:bg-secondary-light',
    danger: 'bg-danger text-white hover:bg-danger-dark',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return cn(variants[variant] || variants.primary, sizes[size] || sizes.md);
}

// Component.tsx - Minimal, uses utility
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, ...props }, ref) => (
    <button ref={ref} className={getButtonStyles(variant, size)} {...props} />
  )
);
```

---

## Component Structure Template

### Directory Layout
```
Component/
├── index.ts                 # Main export (1-2 lines)
├── Component.tsx            # Main component (50-100 lines)
├── Component.stories.tsx    # Storybook/showcase (optional)
├── types.ts                 # TypeScript interfaces (10-20 lines)
├── constants.ts             # Enums and constants (5-15 lines)
├── utils.ts                 # Helper functions (10-50 lines)
└── Component.test.tsx       # Unit tests (optional)
```

### File Templates

#### `index.ts` - Minimal export
```tsx
export { Component } from './Component';
export type { ComponentProps } from './types';
```

#### `types.ts` - All prop interfaces
```tsx
import { ButtonHTMLAttributes } from 'react';

/**Props for the Button component */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Loading state */
  loading?: boolean;
}
```

#### `constants.ts` - Static values
```tsx
export const BUTTON_VARIANTS = ['primary', 'secondary', 'danger'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

export const DEFAULT_BUTTON_SIZE = 'md';
export const DEFAULT_BUTTON_VARIANT = 'primary';
```

#### `utils.ts` - Pure functions
```tsx
import { cn } from '../utils/classNames';

export function getButtonClassName(variant: string, size: string): string {
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover',
    secondary: 'bg-secondary hover:bg-secondary-hover',
    danger: 'bg-danger hover:bg-danger-hover',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-sm h-6',
    md: 'px-4 py-2 text-base h-8',
    lg: 'px-6 py-3 text-lg h-10',
  };
  
  return cn(
    'font-medium rounded-md transition-colors duration-200',
    variants[variant],
    sizes[size]
  );
}
```

#### `Component.tsx` - Main export
```tsx
import React, { forwardRef } from 'react';
import { cn } from '../utils/classNames';
import type { ButtonProps } from './types';
import { getButtonClassName } from './utils';

/**
 * Button component with multiple variants and sizes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(getButtonClassName(variant, size), className)}
      {...props}
    />
  )
);

Button.displayName = 'Button';
```

---

## Component Categories

### 1. Primitives (Base Components)
**Examples**: Button, Input, Checkbox, Radio, Label
- **Characteristics**: Pure UI, no business logic
- **Pattern**: Direct Tailwind styling + compound components
- **v0 Approach**: Excellent candidates for shadcn/ui migration
- **Refactoring Priority**: HIGH

```tsx
// Simple, no external dependencies, reusable
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => <button ref={ref} className={...} {...props} />
);
```

### 2. Composite Components  (Combination of primitives)
**Examples**: Tabs, Accordion, Dialog, Dropdown
- **Characteristics**: Compose multiple primitives
- **Pattern**: Compound component pattern
- **v0 Approach**: Good candidates, extract utility logic
- **Refactoring Priority**: HIGH

```tsx
// Tabs = TabsRoot + TabsList + TabsTrigger + TabsContent
// Accordion = AccordionRoot + AccordionItem + AccordionTrigger + AccordionContent
```

### 3. Feature Components (Domain-specific)
**Examples**: WorkflowTable, RunTimeline, EventSchema, LogViewer
- **Characteristics**: Business logic + complex state
- **Pattern**: Container + Presentational split
- **v0 Approach**: Keep logic separate, expose only UI props
- **Refactoring Priority**: MEDIUM

```tsx
// Container handles data fetching, logic
function WorkflowTableContainer({ workflowId }: { workflowId: string }) {
  const { data, loading } = useWorkflows(workflowId);
  return <WorkflowTableUI data={data} loading={loading} />;
}

// Presentational component is v0-friendly
function WorkflowTableUI({ data, loading }: WorkflowTableUIProps) {
  return <table>{/* Pure UI */}</table>;
}
```

### 4. Specialized Components (Highly custom)
**Examples**: SchemaViewer, CodeEditor, MonacoEditor, TimelineViewer
- **Characteristics**: Significant custom logic, external libraries
- **Pattern**: Wrapper components, expose lib props
- **v0 Approach**: Document and keep as-is, but make props clear
- **Refactoring Priority**: LOW

```tsx
// Wrap external library but keep interface clear
interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language = 'javascript',
  readOnly = false,
}) => (
  <MonacoEditor value={code} onChange={onChange} language={language} readOnly={readOnly} />
);
```

---

## Refactoring Priorities

### Phase 1: Core Primitives (Week 1)
These are most important for v0 and have high usage:
- [ ] Button & variants (existing custom)
- [ ] Input & variants
- [ ] Label
- [ ] Checkbox
- [ ] Radio
- [ ] Select/Dropdown
- [ ] Textarea

### Phase 2: Composite Components (Week 2-3)
- [ ] Tabs
- [ ] Accordion
- [ ] Dialog/Modal
- [ ] Dropdown Menu
- [ ] Tooltip
- [ ] Popover

### Phase 3: Feature Components (Week 4-5)
- [ ] Table (core)
- [ ] Pagination
- [ ] Status Badge
- [ ] Filter components
- [ ] Forms (composite)

### Phase 4: Specialized Components (Week 6+)
- [ ] SchemaViewer
- [ ] CodeEditor (Monaco)
- [ ] TimelineViewer
- [ ] Complex tables (FunctionTable, EventsTable, etc.)

---

## v0 Metadata & Documentation

### Add Component Metadata
```tsx
/**
 * Button - A versatile button component
 * 
 * @component
 * @category Primitive
 * @usage Common buttons across the application
 * 
 * @example
 * ```tsx
 * <Button variant="primary">Primary Action</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="danger">Delete</Button>
 * ```
 * 
 * @variants
 * - **primary**: For main actions (green/matcha)
 * - **secondary**: For secondary actions (blue/breeze)
 * - **danger**: For destructive actions (red/ruby)
 * 
 * @sizes
 * - **sm**: 24px height, small padding
 * - **md**: 32px height, medium padding (default)
 * - **lg**: 40px height, large padding
 * 
 * @accessibility
 * - Follows WCAG 2.1 AA standards
 * - Supports keyboard navigation (Enter, Space)
 * - Includes focus indicators
 * - Supports aria-label for icon-only buttons
 */
```

### Create Component Stories
```tsx
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: 'Primary', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
};

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger' },
};

export const Loading: Story = {
  args: { children: 'Loading...', loading: true },
};

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
};
```

---

## Common Refactoring Patterns

### Pattern 1: Extract Style Functions
**Before**:
```tsx
export function Button({ variant, size, className, ...props }) {
  return (
    <button className={cn(
      variant === 'primary' ? 'bg-primary text-white' :
      variant === 'secondary' ? 'bg-secondary' :
      'bg-danger',
      size === 'sm' ? 'px-2 py-1' :
      size === 'lg' ? 'px-6 py-3' :
      'px-4 py-2',
      className
    )} {...props} />
  );
}
```

**After**:
```tsx
// utils.ts
export function getButtonStyles(variant, size) {
  return cn(variantStyles[variant], sizeStyles[size]);
}

// Component.tsx
export const Button = forwardRef(({ variant = 'primary', size = 'md', className, ...props }, ref) => (
  <button ref={ref} className={cn(getButtonStyles(variant, size), className)} {...props} />
));
```

### Pattern 2: Create Constants File
**Before**:
```tsx
const variants = ['primary', 'secondary', 'danger'];
const sizes = ['small', 'medium', 'large'];
```

**After**:
```tsx
// constants.ts
export const BUTTON_VARIANTS = ['primary', 'secondary', 'danger'] as const;
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[number];
export type ButtonSize = typeof BUTTON_SIZES[number];
```

### Pattern 3: Separate Container/Presentational
**Before** (mixed concerns):
```tsx
export function WorkflowTable({ filters }) {
  const [workflows, setWorkflows] = useState([]);
  
  useEffect(() => {
    fetchWorkflows(filters).then(setWorkflows);
  }, [filters]);
  
  return <table>{/* render workflows */}</table>;
}
```

**After** (separated):
```tsx
// Container component (logic)
function WorkflowTableContainer({ filters }: { filters: WorkflowFilters }) {
  const { data: workflows, loading } = useWorkflows(filters);
  return <WorkflowTableUI workflows={workflows} loading={loading} />;
}

// Presentational component (UI only - v0 friendly!)
function WorkflowTableUI({ workflows, loading }: { workflows: Workflow[]; loading: boolean }) {
  if (loading) return <Skeleton />;
  return <table>{/* render workflows */}</table>;
}

export { WorkflowTableContainer as WorkflowTable, WorkflowTableUI };
```

---

## Testing Guidelines for v0

### Unit Tests for Utilities
```tsx
// Component.test.ts
import { getButtonStyles } from './utils';

describe('getButtonStyles', () => {
  it('returns primary styles for primary variant', () => {
    const styles = getButtonStyles('primary', 'md');
    expect(styles).toContain('bg-primary');
  });
  
  it('returns correct size styles', () => {
    const styles = getButtonStyles('primary', 'lg');
    expect(styles).toContain('px-6');
  });
});
```

### Snapshot Tests for Components
```tsx
// Component.test.tsx
import { render } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

---

## Checklist for v0-Ready Components

- [ ] **TypeScript**: All props have explicit types
- [ ] **JSDoc**: All props and components are documented
- [ ] **Separation**: No business logic in presentational components
- [ ] **Utilities**: Complex logic extracted to utils.ts
- [ ] **Constants**: Magic values in constants.ts
- [ ] **Stories**: Storybook stories show all variants
- [ ] **Clean API**: Simple, intuitive prop interface
- [ ] **Compound Pattern**: Complex components use compound pattern
- [ ] **Tests**: Unit tests for utilities and components
- [ ] **No Side Effects**: Components don't cause side effects on render
- [ ] **Accessible**: Follows accessibility best practices
- [ ] **Documented**: README or stories show usage examples

---

## Integration with v0

### How v0 Uses v0-Ready Components

1. **Discovery**: v0 scans component directory structure
2. **Analysis**: Reads TypeScript interfaces and JSDoc comments
3. **Understanding**: Comprehends component props and usage
4. **Generation**: Creates new components following same patterns
5. **Modification**: Updates existing components with changes

### v0-Friendly Code

```tsx
// ✅ v0 CAN understand and modify this easily
interface CardProps {
  /** The card title */
  title: string;
  /** Card content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
}

export const Card = ({ title, children, onClick }: CardProps) => (
  <div onClick={onClick} className="rounded-lg border p-4">
    <h2>{title}</h2>
    {children}
  </div>
);
```

### v0-Unfriendly Code

```tsx
// ❌ v0 CANNOT easily modify this
const Card = ({ ...rest }: any) => {
  const [state, setState] = useState();
  useEffect(() => { /* complex logic */ });
  const handleSomething = useCallback(() => { /* complex logic */ }, []);
  
  return (
    <div {...rest}>
      {/* complex nested JSX */}
    </div>
  );
};
```

---

## Examples of Refactored Components

### Example 1: Button (BEFORE → AFTER)

**Current/BEFORE**:
```tsx
// One large file with mixed concerns
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ kind = 'primary', appearance = 'solid', size = 'medium', ... }, ref) => {
    const buttonColors = getButtonColors({ kind, appearance, loading });
    // ... lots of code
  }
);
```

**Refactored/AFTER**:
```
Button/
├── index.ts (1 line export)
├── Button.tsx (clean component, ~40 lines)
├── types.ts (interfaces, ~15 lines)
├── constants.ts (enums, ~10 lines)
├── utils.ts (getButtonStyles, ~50 lines)
└── Button.stories.tsx (Storybook showcase)
```

### Example 2: Modal/Dialog

**BEFORE**: Dialog mixed with useReducer and complex state

**AFTER**:
```
Dialog/
├── DialogRoot.tsx (context provider)
├── DialogTrigger.tsx (button to open)
├── DialogContent.tsx (modal content)
├── DialogClose.tsx (close button)
├── types.ts
├── utils.ts
└── Dialog.stories.tsx (shows all variations)
```

---

## Next Steps

1. **Audit existing components** using the category framework above
2. **Prioritize refactoring** by phase
3. **Create refactoring tickets** for each component
4. **Establish code review process** for v0-readiness
5. **Document lessons learned** for future components
6. **Set up Storybook** for component showcase
7. **Integrate v0** once foundation is solid

---

## Resources

- [shadcn/ui Component Library](https://ui.shadcn.com) - Reference implementations
- [Headless UI Patterns](https://headlessui.com) - Compound component patterns
- [Radix UI Primitives](https://www.radix-ui.com) - Accessible component patterns
- [v0 Documentation](https://v0.dev) - AI generation best practices
- [Tailwind CSS Documentation](https://tailwindcss.com) - Styling reference
