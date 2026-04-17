# Coding Conventions

**Analysis Date:** 2025-02-14

## Naming Patterns

**Files:**
- PascalCase for React components and pages: `apps/admin/src/pages/LoginPage.jsx`, `apps/mobile/src/screens/HomeScreen.tsx`
- camelCase for hooks and utilities: `apps/admin/src/hooks/useAuth.js`, `apps/admin/src/utils/geocode.js`
- kebab-case for some config/meta files: `package-lock.json`, `tailwind.config.js`

**Functions:**
- PascalCase for component functions: `export default function App() { ... }` in `apps/admin/src/App.jsx`
- camelCase for hooks and logic functions: `export async function geocodeCity(city) { ... }` in `apps/admin/src/utils/geocode.js`

**Variables:**
- camelCase for regular variables, state, and props: `const { user, loading } = useAuth();`
- UPPER_SNAKE_CASE for constants: `const ADMIN_URL = 'https://gcr26-dev.netlify.app';` in `apps/mobile/src/screens/HomeScreen.tsx`

**Types:**
- PascalCase for interfaces and types: `export interface User { ... }` in `packages/shared/src/types.ts`
- camelCase for interface properties: `id: string;`, `isAdmin: boolean;`

## Code Style

**Formatting:**
- 2-space indentation (standard for JavaScript/React)
- Semi-colons used for statement termination
- Single quotes for strings: `'react-router-dom'`, `'#fff'`

**Linting:**
- ESLint (Flat Config) in `apps/admin/eslint.config.js`
- Standard React/Hooks recommendations: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Custom rule: `no-unused-vars` ignores variables starting with uppercase or underscores: `['error', { varsIgnorePattern: '^[A-Z_]' }]`

## Import Organization

**Order:**
1. React and framework core libraries
2. Third-party libraries (e.g., `firebase`, `react-leaflet`)
3. Monorepo shared packages (e.g., `@gcr26/shared`)
4. Local project files (hooks, components, utils)

**Path Aliases:**
- Monorepo imports use `@gcr26/shared` alias defined in `package.json` workspaces
- No internal path aliases (like `@/`) detected in `tsconfig.json` for apps

## Error Handling

**Patterns:**
- Use of `async/await` for asynchronous operations
- Conditional returns for early exits on failure or missing data: `if (!data.length) return null;` in `apps/admin/src/utils/geocode.js`
- Loading states for UI handling: `if (loading) return <ActivityIndicator />;`

## Logging

**Framework:** `console.log` (used sparingly in source)

**Patterns:**
- No formal logging framework or patterns observed. Error reporting to the user is mostly handled via UI state.

## Comments

**When to Comment:**
- Section headers in large files (e.g., `// ─── Users ────────────────────────────────────────────────────────────────────` in `packages/shared/src/types.ts`)
- Explanatory comments for complex logic or reasoning.

**JSDoc/TSDoc:**
- Minimal use of JSDoc. Brief inline comments for interface properties in `packages/shared/src/types.ts`.

## Function Design

**Size:**
- Components and hooks are kept relatively small and focused.
- Business logic is often extracted into hooks or shared utilities.

**Parameters:**
- Destructured objects for props in components (often implicit in React).
- Direct parameters for utility functions.

**Return Values:**
- Functional components return JSX/TSX.
- Hooks often return an object with state and methods: `{ profile, loading }`.

## Module Design

**Exports:**
- Default exports for primary components and pages: `export default function HomeScreen() { ... }`
- Named exports for hooks, utilities, and types: `export function useAuth() { ... }`, `export interface User { ... }`

**Barrel Files:**
- Used in `packages/shared/src/index.ts` to export all types.
- Used in `apps/mobile/src/navigation/index.tsx` for navigation exports.

---

*Convention analysis: 2025-02-14*
