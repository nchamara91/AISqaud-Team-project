# Login Feature — Setup Guide

## Prerequisites

Before integrating the Login feature, ensure your project has the following installed:

### Required Dependencies

```bash
npm install react react-dom react-router-dom
```

### Required Dev Dependencies

```bash
npm install --save-dev @types/react @types/react-dom @types/node typescript
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest @types/jest ts-jest
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["node", "jest", "@testing-library/jest-dom"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "build"]
}
```

## Environment Variables

Create a `.env` file in your project root:

```bash
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

For production:

```bash
REACT_APP_API_BASE_URL=https://api.bargainingbank.com
```

## Tailwind CSS Setup

If not already configured, set up Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind directives to your CSS:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## React Router Setup

Wrap your app with React Router:

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

## Integration Example

```tsx
// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './features/auth';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Other routes */}
    </Routes>
  );
}

export default App;
```

## Testing Setup

Configure Jest with React Testing Library:

```javascript
// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
};
```

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
```

## Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run watch mode
npm test -- --watch
```

## Check Available Scripts

First, check what scripts are available in your project:

```bash
npm run
```

Common script names for development:
- `npm start` - Create React App projects
- `npm run dev` - Vite projects
- `npm run serve` - Some custom setups

## Run Development Server

Based on your project setup, use the appropriate command:

```bash
# For Vite projects
npm run dev

# For Create React App
npm start

# Check package.json for the correct script
```

## Build for Production

```bash
npm run build
```

## Verification Checklist

After setup, verify:

- [ ] Check available scripts: `npm run`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Tests pass: `npm test` (if configured)
- [ ] Development server runs (use script from package.json)
- [ ] Login page renders at `/login`
- [ ] Form validation works
- [ ] API calls are made (check Network tab)

## Troubleshooting

### "Missing script: 'dev'" or "Missing script: 'test'"

Check your `package.json` to see available scripts:

```bash
npm run
```

You may need to add scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "tsc && vite build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### "Cannot find module 'react'"

```bash
npm install react react-dom @types/react @types/react-dom
```

### "Cannot find namespace 'JSX'"

Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

### "process is not defined"

Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

Install types:
```bash
npm install --save-dev @types/node
```

### API calls fail with CORS errors

Configure your backend to allow requests from your frontend origin.

Backend example (Express):
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## Next Steps

1. Review [README.md](../README.md) for feature documentation
2. Check [usage-examples.tsx](../examples/usage-examples.tsx) for integration patterns
3. Review [implementation plan](../../../docs/login-feature-implementation-plan.md)
4. Connect to your backend API
5. Customize branding and styling

## Support

For issues or questions:
- Check the README.md
- Review the tests for usage examples
- Consult the implementation plan
