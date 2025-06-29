# Coding Standards for AI Agent Training App

This document outlines the coding standards for this project, designed to be easily understood and extended by AI agents.

## Final Angular Coding Standards

### 1. General Style & Structure

- **File Naming:** Use `feature.type.ts` as the naming pattern (e.g., `hero-list.component.ts`, `auth.service.ts`). Separate words within the feature name with hyphens (`-`).
- **File Structure:** Organize the application by feature, not by type. Group all files related to a single feature (component, service, store, etc.) within the same directory.
- **Class & Interface Naming:**
  - Use `PascalCase` for all class names.
  - Do NOT prefix interfaces with an `I` (e.g., use `User` not `IUser`).
- **Single Responsibility:** Keep components, services, and other classes focused on a single purpose to ensure they are lean, readable, and maintainable.

### 2. Components & Directives

- **Class Naming:** Suffix class names with their type (e.g., `HeroListComponent`, `HighlightDirective`).
- **Selectors:**
  - Use `kebab-case` for all component and directive selectors (e.g., `app-hero-list`).
  - Always prefix selectors with a unique identifier (`app-`, `my-org-`, etc.) to prevent conflicts with native HTML elements or third-party libraries.
- **Class Member Order:** Organize class members consistently:
  1. Properties (public before private)
  2. `constructor()`
  3. Lifecycle Hooks (e.g., `ngOnInit`, `ngOnDestroy`)
  4. Public Methods
  5. Private Methods
- **Lifecycle Hooks:** Implement the corresponding TypeScript interface for each lifecycle hook used (e.g., `implements OnInit`).

### 3. Services & Dependency Injection

- **Class Naming:** Suffix service class names with `Service` (e.g., `AuthService`, `LoggerService`).
- **Decorator:** Always add the `@Injectable()` decorator to services.
- **Providing:** For application-wide singleton services, use `@Injectable({ providedIn: 'root' })`. This is the preferred, modern approach for tree-shakable providers.

### 4. Templates & Data Binding

- **Keep Logic Out:** Avoid complex logic, calculations, or multi-line statements in HTML templates. Move this logic into the component's class.
- **Use `async` Pipe for Observables:** For data streams from traditional services (not Signal Store), prefer the `async` pipe (`| async`) to manage Observable subscriptions and unsubscriptions automatically, preventing memory leaks.

### 5. State Management (NgRx Signal Store)

- **File Naming:** Name store files `feature.store.ts` (e.g., `products.store.ts`) and place them within their corresponding feature directory.
- **Class & Interface Naming:**
  - Suffix store class names with `Store` (e.g., `ProductsStore`).
  - Define and export a clear `interface` for the store's state slice (e.g., `interface ProductsState { ... }`).
- **State Definition & Modification:**
  - Initialize the store's state shape using `withState`.
  - Use `patchState` for all state updates to ensure immutability.
  - For reusable state update logic, define custom updaters using the `withUpdaters` builder.
- **Derived State (Selectors):**
  - Use `computed()` for all derived or memoized state calculations.
  - Name computed signals based on the data they represent (e.g., `filteredProducts`, `cartTotal`).
- **Asynchronous Side Effects:**
  - Handle all asynchronous operations (e.g., API calls) using `rxMethod<T>()`.
  - Within an `rxMethod`, pipe the async operation's result directly to a `patchState` call.
- **Store Provisioning:**
  - For local or feature-specific state, provide the store in the `providers` array of a component or route.
  - Only use `@Injectable({ providedIn: 'root' })` for stores managing truly global, application-wide state.
- **Component Interaction:**
  - Inject the store directly into components that need to access its state.
  - Use the store's signals directly in your component's template. The `async` pipe is not required for signals.

## Backend Coding Standards

### General Rules

- Use single quotes for strings
- Use two spaces for indentation
- Use arrow functions as much as possible
- Export default for services and modules
- Use kebab naming convention for files (e.g., `user-service.ts`, `api.service.ts`)
- Use camelCase for variables and function declarations (e.g., `userId`, `getUserById`)
- Use UPPER_SNAKE_CASE for constants (e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`)

### File Organization

- Routes: `routes/[feature]/[feature].routes.ts`
- Handlers: `routes/[feature]/[feature].handlers.ts`
- Services: `services/[feature]-service.ts`
- Repositories: `repositories/[feature]-repository.ts`

### API Design (Hono.js)

- Use RESTful conventions
- Use factory pattern for handlers: `factory.createHandlers()`
- Use `app.route()` for modular route organization
- Always validate request data with Zod middleware
- Return consistent response formats

### Database (Drizzle)

- Use repository pattern for data access
- Keep business logic in services, not repositories
- Use transactions for multi-step operations
- Always handle database errors gracefully

## TypeScript Best Practices

- Always use explicit return types for functions
- Prefer types over interfaces for object shapes (use interface only when absolutely necessary)
  - Types are more flexible and can represent unions, intersections, and primitives
  - Use interface only when you need declaration merging or implementing class contracts
- Use `satisfies` operator for type-safe object literals
- Avoid `any` type - use `unknown` if type is truly unknown

### Examples

```typescript
// ✅ Good - using type
type User = {
  id: string;
  name: string;
  email: string;
};

// ❌ Avoid - using interface when not necessary
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good - type for union types
type Status = 'pending' | 'active' | 'inactive';

// ✅ Good - type for function signatures
type UserHandler = (user: User) => void;
```

## Error Handling

- Use custom error classes
- Always catch and handle errors appropriately
- Log errors with context
- Return meaningful error messages to clients

## AI Agent Considerations

- Write self-documenting code with clear variable names
- Include JSDoc comments for complex functions
- Structure code in predictable patterns
- Keep functions small and single-purpose
- Use consistent naming conventions throughout
- Leverage well-documented UI libraries (Angular Material)
- Prefer established patterns over custom implementations

## Benefits of Angular Material for AI Development

When working with AI agents:

1. **Standardized Components**: AI agents can reference official Material documentation
2. **Less Custom CSS**: Reduces complexity and potential styling bugs
3. **Accessibility Built-in**: Components follow ARIA standards automatically
4. **Consistent API**: Predictable component interfaces across the library
5. **Type Safety**: Full TypeScript support with clear interfaces

Note: Angular Material uses tree-shaking, so only imported components are included in the final bundle.

## Code Quality Enforcement

The project includes comprehensive ESLint and Prettier configurations that automatically enforce all the coding standards described above:

- **ESLint Rules**: Enforce TypeScript best practices, naming conventions, and code structure
- **Prettier Config**: Ensures consistent formatting with single quotes and 2-space indentation
- **IDE Integration**: Automatic formatting and linting on save

These tools ensure that all code follows the established patterns, making it easier for AI agents to understand and extend the codebase consistently.

## Development Commands

When working with this project, use these commands:

### Quality Checks
- `bun run typecheck` - Run TypeScript type checking
- `bun run lint` - Run ESLint
- `bun run format:check` - Check code formatting
- `bun run quality` - Run all quality checks

### Auto-fixes
- `bun run lint:fix` - Fix ESLint errors
- `bun run format` - Format code with Prettier
- `bun run quality:fix` - Fix all quality issues

### Development
- `bun run dev` - Start both frontend and backend
- `bun run build` - Build all packages
- `bun run db:push` - Push database schema changes
- `bun run db:studio` - Open database studio

Always run `bun run quality` before committing code to ensure it meets the project standards.
