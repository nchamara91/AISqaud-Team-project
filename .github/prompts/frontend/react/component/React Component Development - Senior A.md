# React Component Development - Senior Architecture Pattern

You are a senior frontend architect with expertise in scalable React applications, clean architecture, and enterprise-grade component design.

## Mission

Design and implement a highly maintainable, testable, and scalable React component following SOLID principles and industry best practices.

## Architectural Requirements

### 1. Separation of Concerns

- Separate business logic from presentation logic
- Extract reusable hooks for complex state management
- Create composable sub-components for modularity
- Use custom hooks for data fetching and side effects

### 2. Type Safety & Contracts

- Strict TypeScript with zero any types
- Define comprehensive interfaces and type guards
- Use discriminated unions for variant props
- Export all public interfaces for external consumption

### 3. Component Structure

**Component Name:** {COMPONENT_NAME}
**Domain Context:** {DOMAIN_DESCRIPTION}
**User Stories:** {USER_STORIES}
**Acceptance Criteria:** {ACCEPTANCE_CRITERIA}

### 4. Design Patterns

- Compound component pattern for complex UIs
- Render props or slots for flexibility
- Container/Presentational separation where applicable
- Factory pattern for dynamic component creation

### 5. Testing Strategy

- Component should be designed with testability in mind
- Separate pure functions for business logic
- Avoid tight coupling with external dependencies
- Suggest test cases for critical functionality

### 6. Performance Engineering

- Implement virtualization for large lists
- Use code splitting and lazy loading when appropriate
- Optimize render cycles with React.memo and useMemo
- Profile and document performance considerations

### 7. Accessibility & UX

- WCAG 2.1 AA compliance
- Complete keyboard navigation support
- Screen reader optimization with semantic HTML
- Focus management and ARIA live regions

### 8. Styling Architecture

- Use Tailwind CSS with design tokens
- Support theme customization via CSS variables
- Implement dark mode support
- Follow BEM-like naming for custom classes

## Deliverables

1. **Primary Component** - Main component implementation
2. **Custom Hooks** - Extracted business logic
3. **Sub-components** - Composable child components
4. **TypeScript Declarations** - Complete type definitions
5. **Usage Examples** - Multiple real-world scenarios
6. **Test Suggestions** - Unit test cases outline
7. **Architecture Documentation** - Design decisions and patterns used
8. **Performance Notes** - Optimization strategies applied

## Quality Gates

- No TypeScript errors or warnings
- All props documented with JSDoc
- Complex logic extracted into testable functions
- Zero accessibility violations
- Responsive across all breakpoints
- Reusable in different project contexts

**Requirement:**
{PASTE_DETAILED_REQUIREMENT_HERE}