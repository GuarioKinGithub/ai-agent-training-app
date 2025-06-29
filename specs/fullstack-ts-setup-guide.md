# AI Agent Development Training App - Full-Stack TypeScript Setup Guide

This guide provides a complete setup for a full-stack TypeScript application designed to help engineers learn best practices for using AI agents (like Claude Code) when developing new features. The application uses Angular + Signal Store for the frontend and Hono.js for the backend, with SQLite database and Drizzle ORM.

## Purpose

This application serves as a training tool to demonstrate:

- How to structure prompts for AI agents to generate code
- Best practices for iterating with AI agents on feature development
- Clear architectural patterns that AI agents can understand and extend
- How to write code that is AI-friendly and maintainable

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Initial Setup](#initial-setup)
4. [Code Quality Tools](#code-quality-tools)
5. [Shared Types and Validation](#shared-types-and-validation)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup (Angular)](#frontend-setup-angular)
8. [Database Setup](#database-setup)
9. [API Implementation](#api-implementation)
10. [Angular Implementation](#angular-implementation)
11. [Running the Application](#running-the-application)
12. [Code Quality Tools Usage](#code-quality-tools-usage)
13. [Coding Standards](#coding-standards)
14. [AI Agent Best Practices](#ai-agent-best-practices)

## Prerequisites

- **Bun** installed (latest version)
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- **Node.js** 18+ (for compatibility with Angular CLI)
- **Git** for version control

## Project Structure

```
ai-agent-training-app/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── db/
│   │   │   ├── schema.ts
│   │   │   └── migrations/
│   │   ├── repositories/
│   │   │   ├── base-repository.ts
│   │   │   └── user-repository.ts
│   │   ├── services/
│   │   │   └── user-service.ts
│   │   ├── routes/
│   │   │   ├── users/
│   │   │   │   ├── users.routes.ts
│   │   │   │   └── users.handlers.ts
│   │   │   └── health/
│   │   │       └── health.routes.ts
│   │   ├── middleware/
│   │   │   ├── error-handler.ts
│   │   │   └── logger.ts
│   │   └── lib/
│   │       └── create-app.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── user-list/
│   │   │   │   │   ├── user-list.component.ts
│   │   │   │   │   ├── user-list.component.html
│   │   │   │   │   └── user-list.component.css
│   │   │   │   ├── user-form/
│   │   │   │   │   ├── user-form.component.ts
│   │   │   │   │   ├── user-form.component.html
│   │   │   │   │   └── user-form.component.css
│   │   │   │   └── confirm-dialog/
│   │   │   │       └── confirm-dialog.component.ts
│   │   │   ├── services/
│   │   │   │   └── api.service.ts
│   │   │   ├── store/
│   │   │   │   └── users.store.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.component.html
│   │   │   ├── app.component.css
│   │   │   └── app.config.ts
│   │   ├── main.ts
│   │   ├── styles.css
│   │   └── index.html
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── proxy.conf.json
│   ├── .eslintrc.json
│   └── .env
├── shared/
│   ├── src/
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   └── api.ts
│   │   └── schemas/
│   │       ├── index.ts
│   │       └── user.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json
├── bun.lockb
├── .gitignore
├── .eslintrc.json
├── .prettierrc.json
├── .prettierignore
├── README.md
├── claude.md
└── AI-AGENT-GUIDE.md
```

## Initial Setup

### 1. initialize Project

```bash
bun init -y
```

### 2. Update root `package.json` for monorepo

```json
{
  "name": "ai-agent-training-app",
  "private": true,
  "workspaces": ["backend", "frontend", "shared"],
  "scripts": {
    "dev": "concurrently \"bun run dev:backend\" \"bun run dev:frontend\"",
    "dev:backend": "cd backend && bun run dev",
    "dev:frontend": "cd frontend && bun run dev",
    "build": "bun run build:shared && bun run build:backend && bun run build:frontend",
    "build:shared": "cd shared && bun run build",
    "build:backend": "cd backend && bun run build",
    "build:frontend": "cd frontend && bun run build",
    "db:generate": "cd backend && bun run db:generate",
    "db:push": "cd backend && bun run db:push",
    "db:studio": "cd backend && bun run db:studio",
    "typecheck": "bun run typecheck:shared && bun run typecheck:backend && bun run typecheck:frontend",
    "typecheck:shared": "cd shared && bun run typecheck",
    "typecheck:backend": "cd backend && bun run typecheck",
    "typecheck:frontend": "cd frontend && bun run typecheck",
    "lint": "eslint . --ext .ts,.js,.json --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.js,.json --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "quality": "bun run typecheck && bun run lint && bun run format:check",
    "quality:fix": "bun run typecheck && bun run lint:fix && bun run format"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "@types/bun": "latest",
    "typescript": "^5.3.3",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3"
  }
}
```

### 3. Create `.gitignore`

```gitignore
# Dependencies
node_modules/
bun.lockb
.angular/

# Environment files
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.vite/

# Database
*.db
*.db-journal
.drizzle/

# Logs
*.log

# OS files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
*.swp
*.swo
```

### 4. Install Code Quality Tools

```bash
bun add -d eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier
```

### 5. Create `claude.md`

````markdown
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
````

### 6. Create `.eslintrc.json`

```json
{
  "root": true,
  "env": {
    "node": true,
    "es2022": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": ["./tsconfig.json", "./*/tsconfig.json"]
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    // Prettier integration
    "prettier/prettier": "error",

    // TypeScript specific rules
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/prefer-unknown-over-any": "error",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      { "accessibility": "explicit" }
    ],

    // Naming conventions
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "function",
        "format": ["camelCase"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      },
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": false
        }
      },
      {
        "selector": "enumMember",
        "format": ["UPPER_CASE"]
      }
    ],

    // Code style preferences
    "prefer-arrow-callback": "error",
    "arrow-body-style": ["error", "as-needed"],
    "prefer-const": "error",
    "no-var": "error",

    // Import/export rules
    "import/prefer-default-export": "off",
    "@typescript-eslint/consistent-type-imports": "error",

    // Disable rules that conflict with prettier
    "indent": "off",
    "quotes": "off",
    "semi": "off"
  },
  "overrides": [
    {
      "files": ["*.spec.ts", "*.test.ts"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

### 7. Create `.prettierrc.json`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "bracketSameLine": false,
  "singleAttributePerLine": true
}
```

### 8. Create `.prettierignore`

```
# Dependencies
node_modules/
bun.lockb

# Build outputs
dist/
build/
.angular/

# Database
*.db
*.db-journal
.drizzle/

# Generated files
coverage/
*.min.js
*.min.css
```

## Shared Types and Validation

### 1. Create shared package

```bash
mkdir -p shared/src/{types,schemas}
cd shared
bun init -y
```

### 2. Update `shared/package.json`

```json
{
  "name": "@ai-agent-training/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts --max-warnings 0",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write src",
    "format:check": "prettier --check src"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

### 3. Create `shared/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create `shared/src/schemas/user.ts`

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUserSchema.partial();

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
```

### 5. Create `shared/src/types/api.ts`

```typescript
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
```

### 6. Create `shared/src/schemas/index.ts`

```typescript
export * from './user';
```

### 7. Create `shared/src/types/index.ts`

```typescript
export * from './api';
```

### 8. Create `shared/src/index.ts`

```typescript
export * from './types';
export * from './schemas';
```

## Backend Setup

### 1. Initialize backend

```bash
cd ../backend
bun init -y
```

### 2. Install backend dependencies

```bash
bun add hono @hono/node-server @hono/zod-validator drizzle-orm better-sqlite3 zod
bun add -d @types/node @types/better-sqlite3 drizzle-kit
```

### 3. Update `backend/package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "build": "bun build src/index.ts --outdir=dist --target=bun",
    "start": "bun run dist/index.js",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate:sqlite",
    "db:push": "drizzle-kit push:sqlite",
    "db:studio": "drizzle-kit studio",
    "lint": "eslint src --ext .ts --max-warnings 0",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write src",
    "format:check": "prettier --check src"
  },
  "dependencies": {
    "@ai-agent-training/shared": "workspace:*",
    "hono": "^4.0.0",
    "@hono/node-server": "^1.8.0",
    "@hono/zod-validator": "^0.2.0",
    "drizzle-orm": "^0.29.0",
    "better-sqlite3": "^9.3.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/better-sqlite3": "^7.6.8",
    "@types/bun": "latest",
    "drizzle-kit": "^0.20.0",
    "typescript": "^5.3.3"
  }
}
```

### 4. Create `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "types": ["bun-types"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Create `backend/drizzle.config.ts`

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './data.db',
  },
} satisfies Config;
```

### 6. Create `backend/.env`

```env
PORT=3001
DATABASE_URL=./data.db
NODE_ENV=development
```

## Database Setup

### 1. Create `backend/src/config/database.ts`

```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';

const sqlite = new Database(process.env.DATABASE_URL || './data.db');
export const db = drizzle(sqlite, { schema });

export default db;
```

### 2. Create `backend/src/db/schema.ts`

```typescript
import { sql } from 'drizzle-orm';
import { text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### 3. Create `backend/src/repositories/base-repository.ts`

```typescript
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';
import db from '../config/database';

export abstract class BaseRepository<T extends SQLiteTable> {
  constructor(protected table: T) {}

  public async findAll() {
    return await db.select().from(this.table);
  }

  public async findById(id: string) {
    const results = await db
      .select()
      .from(this.table)
      .where(eq((this.table as any).id, id))
      .limit(1);

    return results[0] || null;
  }

  public async create(data: any) {
    const results = await db.insert(this.table).values(data).returning();

    return results[0];
  }

  public async update(id: string, data: any) {
    const results = await db
      .update(this.table)
      .set(data)
      .where(eq((this.table as any).id, id))
      .returning();

    return results[0] || null;
  }

  public async delete(id: string) {
    const results = await db
      .delete(this.table)
      .where(eq((this.table as any).id, id))
      .returning();

    return results[0] || null;
  }
}
```

### 4. Create `backend/src/repositories/user-repository.ts`

```typescript
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { BaseRepository } from './base-repository';
import db from '../config/database';

export class UserRepository extends BaseRepository<typeof users> {
  constructor() {
    super(users);
  }

  public async findByEmail(email: string) {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return results[0] || null;
  }
}

export const userRepository = new UserRepository();
```

### 5. Create `backend/src/services/user-service.ts`

```typescript
import type { CreateUser, UpdateUser } from '@ai-agent-training/shared';
import { userRepository } from '../repositories/user-repository';

export class UserService {
  public async getAllUsers() {
    return await userRepository.findAll();
  }

  public async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async createUser(data: CreateUser) {
    // Check if user exists
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    return await userRepository.create(data);
  }

  public async updateUser(id: string, data: UpdateUser) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing) {
        throw new Error('User with this email already exists');
      }
    }

    return await userRepository.update(id, data);
  }

  public async deleteUser(id: string) {
    const user = await userRepository.delete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export const userService = new UserService();
```

## API Implementation

### 1. Create `backend/src/lib/create-app.ts`

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { ApiError, ApiResponse } from '@ai-agent-training/shared';

export const createApp = (): Hono => {
  const app = new Hono();

  // Middleware
  app.use('*', logger());
  app.use(
    '*',
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true,
    })
  );

  // Error handling
  app.onError((err, c) => {
    console.error(err);

    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 500);
  });

  // 404 handler
  app.notFound((c) => {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
      timestamp: new Date().toISOString(),
    };

    return c.json(response, 404);
  });

  return app;
};
```

### 2. Create `backend/src/routes/health/health.routes.ts`

```typescript
import { Hono } from 'hono';
import type { ApiResponse } from '@ai-agent-training/shared';

export const healthRoutes = new Hono();

healthRoutes.get('/', (c) => {
  const response: ApiResponse<{ status: string; timestamp: string }> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  return c.json(response);
});
```

### 3. Create `backend/src/routes/users/users.handlers.ts`

```typescript
import { Factory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { ApiResponse } from '@ai-agent-training/shared';
import { createUserSchema, updateUserSchema } from '@ai-agent-training/shared';
import { userService } from '../../services/user-service';

const factory = new Factory();

const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const getAllUsers = factory.createHandlers(async (c) => {
  try {
    const users = await userService.getAllUsers();

    const response: ApiResponse = {
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    };

    return c.json(response);
  } catch (error) {
    throw error;
  }
});

export const getUserById = factory.createHandlers(
  zValidator('param', idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const user = await userService.getUserById(id);

      const response: ApiResponse = {
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        };
        return c.json(response, 404);
      }
      throw error;
    }
  }
);

export const createUser = factory.createHandlers(
  zValidator('json', createUserSchema),
  async (c) => {
    try {
      const data = c.req.valid('json');
      const user = await userService.createUser(data);

      const response: ApiResponse = {
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      };

      return c.json(response, 201);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        };
        return c.json(response, 409);
      }
      throw error;
    }
  }
);

export const updateUser = factory.createHandlers(
  zValidator('param', idParamSchema),
  zValidator('json', updateUserSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');
      const user = await userService.updateUser(id, data);

      const response: ApiResponse = {
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: error.message,
            },
            timestamp: new Date().toISOString(),
          };
          return c.json(response, 404);
        }
        if (error.message.includes('already exists')) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'USER_EXISTS',
              message: error.message,
            },
            timestamp: new Date().toISOString(),
          };
          return c.json(response, 409);
        }
      }
      throw error;
    }
  }
);

export const deleteUser = factory.createHandlers(
  zValidator('param', idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      await userService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        data: { message: 'User deleted successfully' },
        timestamp: new Date().toISOString(),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        };
        return c.json(response, 404);
      }
      throw error;
    }
  }
);
```

### 4. Create `backend/src/routes/users/users.routes.ts`

```typescript
import { Hono } from 'hono';
import * as handlers from './users.handlers';

export const userRoutes = new Hono();

userRoutes.get('/', ...handlers.getAllUsers);
userRoutes.get('/:id', ...handlers.getUserById);
userRoutes.post('/', ...handlers.createUser);
userRoutes.patch('/:id', ...handlers.updateUser);
userRoutes.delete('/:id', ...handlers.deleteUser);
```

### 5. Create `backend/src/index.ts`

```typescript
import { serve } from '@hono/node-server';
import { createApp } from './lib/create-app';
import { healthRoutes } from './routes/health/health.routes';
import { userRoutes } from './routes/users/users.routes';

const app = createApp();
const PORT = Number(process.env.PORT) || 3001;

// Routes
app.route('/health', healthRoutes);
app.route('/api/users', userRoutes);

console.log(`Server is running on port ${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});
```

## Frontend Setup (Angular)

### 1. Install Angular CLI globally

```bash
npm install -g @angular/cli
```

### 2. Create Angular application

```bash
cd ../
ng new frontend --routing=false --style=css --skip-git --package-manager=npm
cd frontend
```

When prompted during creation:

- Would you like to add Angular routing? → No
- Which stylesheet format would you like to use? → CSS

### 3. Install additional dependencies

```bash
bun install @ngrx/signals @angular/forms @angular/material @angular/cdk @angular/animations zod
bun install --save-dev @types/node @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/schematics @angular-eslint/template-parser
```

### 4. Add Angular-specific ESLint configuration

Add Angular ESLint configuration:

```bash
bunx ng add @angular-eslint/schematics --skip-confirmation
```

### 5. Create `frontend/.eslintrc.json`

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "@typescript-eslint/recommended-requiring-type-checking",
        "@angular-eslint/recommended",
        "@angular-eslint/template/process-inline-templates",
        "prettier"
      ],
      "parserOptions": {
        "project": ["tsconfig.json"],
        "createDefaultProgram": true
      },
      "rules": {
        // Prettier integration
        "prettier/prettier": "error",

        // TypeScript rules
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/prefer-unknown-over-any": "error",

        // Angular-specific naming conventions
        "@typescript-eslint/naming-convention": [
          "error",
          {
            "selector": "variable",
            "format": ["camelCase", "UPPER_CASE"]
          },
          {
            "selector": "function",
            "format": ["camelCase"]
          },
          {
            "selector": "typeLike",
            "format": ["PascalCase"]
          },
          {
            "selector": "interface",
            "format": ["PascalCase"],
            "custom": {
              "regex": "^I[A-Z]",
              "match": false
            }
          },
          {
            "selector": "classProperty",
            "modifiers": ["private"],
            "format": ["camelCase"],
            "leadingUnderscore": "forbid"
          },
          {
            "selector": "classProperty",
            "modifiers": ["public"],
            "format": ["camelCase"]
          }
        ],

        // Angular-specific rules
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-class-suffix": "error",
        "@angular-eslint/directive-class-suffix": "error",
        "@angular-eslint/no-host-metadata-property": "error",
        "@angular-eslint/no-inputs-metadata-property": "error",
        "@angular-eslint/no-outputs-metadata-property": "error",
        "@angular-eslint/use-lifecycle-interface": "error",

        // Code style preferences
        "prefer-arrow-callback": "error",
        "arrow-body-style": ["error", "as-needed"],
        "prefer-const": "error",
        "no-var": "error"
      }
    },
    {
      "files": ["*.html"],
      "extends": [
        "@angular-eslint/template/recommended",
        "@angular-eslint/template/accessibility"
      ],
      "rules": {
        "@angular-eslint/template/click-events-have-key-events": "error",
        "@angular-eslint/template/mouse-events-have-key-events": "error",
        "@angular-eslint/template/no-autofocus": "error",
        "@angular-eslint/template/no-positive-tabindex": "error"
      }
    }
  ]
}
```

### 6. Update `frontend/package.json`

Add to scripts section:

```json
{
  "scripts": {
    "dev": "ng serve",
    "build": "ng build",
    "typecheck": "tsc --noEmit",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "format": "prettier --write src",
    "format:check": "prettier --check src"
  },
  "dependencies": {
    "@ai-agent-training/shared": "workspace:*"
  }
}
```

### 7. Add Angular Material

```bash
bunx ng add @angular/material --skip-confirmation
```

When prompted:

- Choose a prebuilt theme name → Deep Orange
- Set up global Angular Material typography styles? → Yes
- Include the Angular animations module? → Yes

### 8. Update `frontend/tsconfig.json`

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"],
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

### 9. Update `frontend/angular.json`

Add proxy configuration to serve options:

```json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "configurations": {
      "production": {
        "buildTarget": "frontend:build:production"
      },
      "development": {
        "buildTarget": "frontend:build:development"
      }
    },
    "defaultConfiguration": "development",
    "options": {
      "proxyConfig": "proxy.conf.json"
    }
  }
}
```

### 10. Create `frontend/proxy.conf.json`

```json
{
  "/api": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## Angular Implementation

### 1. Update `frontend/src/styles.css` with Material theme

```css
@import '@angular/material/prebuilt-themes/deeppurple-amber.css';

html,
body {
  height: 100%;
}
body {
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
}
```

Note: This theme uses Deep Purple as the primary color and Amber (orange) as the accent color. The Material Icons font is loaded via the link tag in index.html (shown in step 15).

### 2. Create `frontend/src/app/services/api.service.ts`

```typescript
import { Injectable } from '@angular/core';
import type { ApiResponse } from '@ai-agent-training/shared';

const API_BASE_URL = '/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || 'An error occurred');
    }

    return data.data as T;
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
```

### 3. Create `frontend/src/app/store/users.store.ts`

```typescript
import { computed, Injectable } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import type { User, CreateUser, UpdateUser } from '@ai-agent-training/shared';
import { ApiService } from '../services/api.service';

type UsersState = {
  users: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    userCount: computed(() => store.users().length),
    hasError: computed(() => !!store.error()),
  })),
  withMethods((store, apiService = new ApiService()) => ({
    async loadUsers(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const users = await apiService.get<User[]>('/users');
        patchState(store, { users, loading: false });
      } catch (error) {
        patchState(store, {
          error:
            error instanceof Error ? error.message : 'Failed to load users',
          loading: false,
        });
      }
    },

    async createUser(userData: CreateUser): Promise<User> {
      patchState(store, { error: null });
      try {
        const newUser = await apiService.post<User>('/users', userData);
        patchState(store, { users: [...store.users(), newUser] });
        return newUser;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to create user';
        patchState(store, { error: message });
        throw error;
      }
    },

    async updateUser(id: string, userData: UpdateUser): Promise<User> {
      patchState(store, { error: null });
      try {
        const updatedUser = await apiService.patch<User>(
          `/users/${id}`,
          userData
        );
        patchState(store, {
          users: store
            .users()
            .map((user) => (user.id === id ? updatedUser : user)),
        });
        return updatedUser;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update user';
        patchState(store, { error: message });
        throw error;
      }
    },

    async deleteUser(id: string): Promise<void> {
      patchState(store, { error: null });
      try {
        await apiService.delete(`/users/${id}`);
        patchState(store, {
          users: store.users().filter((user) => user.id !== id),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete user';
        patchState(store, { error: message });
        throw error;
      }
    },

    clearError(): void {
      patchState(store, { error: null });
    },
  }))
);
```

### 4. Create `frontend/src/app/components/user-form/user-form.component.ts`

```typescript
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersStore } from '../../store/users.store';
import type { CreateUser } from '@ai-agent-training/shared';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private usersStore = inject(UsersStore);

  public isSubmitting = false;

  public userForm: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    email: ['', [Validators.required, Validators.email]],
  });

  public getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }
    if (control?.hasError('minlength')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must be at least 2 characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must be less than 100 characters`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  public async onSubmit(): Promise<void> {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      try {
        const userData: CreateUser = this.userForm.value;
        await this.usersStore.createUser(userData);
        this.userForm.reset();
      } catch (error) {
        console.error('Error creating user:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
```

### 5. Create `frontend/src/app/components/user-form/user-form.component.html`

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Add New User</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" placeholder="John Doe" />
        <mat-error *ngIf="userForm.get('name')?.touched">
          {{ getErrorMessage('name') }}
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Email</mat-label>
        <input
          matInput
          type="email"
          formControlName="email"
          placeholder="john@example.com"
        />
        <mat-error *ngIf="userForm.get('email')?.touched">
          {{ getErrorMessage('email') }}
        </mat-error>
      </mat-form-field>

      <button
        mat-raised-button
        color="accent"
        type="submit"
        [disabled]="!userForm.valid || isSubmitting"
        class="full-width"
      >
        <mat-spinner
          *ngIf="isSubmitting"
          diameter="20"
          class="spinner"
        ></mat-spinner>
        <span *ngIf="!isSubmitting">Add User</span>
      </button>
    </form>
  </mat-card-content>
</mat-card>
```

### 6. Create `frontend/src/app/components/user-form/user-form.component.css`

```css
.full-width {
  width: 100%;
}

mat-form-field {
  margin-bottom: 1rem;
}

.spinner {
  display: inline-block;
  margin-right: 8px;
}

button {
  margin-top: 1rem;
}
```

### 7. Create `frontend/src/app/components/user-list/user-list.component.ts`

```typescript
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersStore } from '../../store/users.store';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  public usersStore = inject(UsersStore);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public async deleteUser(id: string, name: string): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${name}?`,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.usersStore.deleteUser(id);
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
          });
        } catch (error) {
          console.error('Error deleting user:', error);
          this.snackBar.open('Failed to delete user', 'Close', {
            duration: 3000,
          });
        }
      }
    });
  }
}
```

### 8. Create `frontend/src/app/components/user-list/user-list.component.html`

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Users ({{ usersStore.userCount() }})</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <div *ngIf="usersStore.loading()" class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Loading users...</p>
    </div>

    <div
      *ngIf="!usersStore.loading() && usersStore.users().length === 0"
      class="empty-state"
    >
      <mat-icon>person_add</mat-icon>
      <p>No users found. Add a user to get started!</p>
    </div>

    <mat-list *ngIf="!usersStore.loading() && usersStore.users().length > 0">
      <mat-list-item *ngFor="let user of usersStore.users(); last as isLast">
        <div matListItemTitle>{{ user.name }}</div>
        <div matListItemLine>{{ user.email }}</div>
        <button
          mat-icon-button
          color="warn"
          matListItemMeta
          (click)="deleteUser(user.id, user.name)"
          aria-label="Delete user"
        >
          <mat-icon>delete</mat-icon>
        </button>
        <mat-divider *ngIf="!isLast"></mat-divider>
      </mat-list-item>
    </mat-list>
  </mat-card-content>
</mat-card>
```

### 9. Create `frontend/src/app/components/user-list/user-list.component.css`

```css
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: rgba(0, 0, 0, 0.6);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(0, 0, 0, 0.6);
}

.empty-state mat-icon {
  font-size: 48px;
  width: 48px;
  height: 48px;
  color: rgba(0, 0, 0, 0.3);
}

mat-list-item {
  height: auto !important;
  padding: 1rem 0 !important;
}
```

### 10. Create `frontend/src/app/components/confirm-dialog/confirm-dialog.component.ts`

```typescript
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

type DialogData = {
  title: string;
  message: string;
};

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        Delete
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        padding: 1rem 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }
}
```

### 11. Update `frontend/src/app/app.component.ts`

```typescript
import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersStore } from './store/users.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    UserFormComponent,
    UserListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public title = 'AI Agent Training';
  public subtitle = 'User Management Demo';
  public usersStore = inject(UsersStore);
  private snackBar = inject(MatSnackBar);

  public ngOnInit(): void {
    this.usersStore.loadUsers();
  }

  public clearError(): void {
    this.usersStore.clearError();
    this.snackBar.open('Error cleared', 'Close', {
      duration: 2000,
    });
  }
}
```

### 12. Update `frontend/src/app/app.component.html`

```html
<mat-toolbar color="primary">
  <mat-icon>school</mat-icon>
  <span class="toolbar-title">{{ title }}</span>
  <span class="toolbar-subtitle">{{ subtitle }}</span>
</mat-toolbar>

<div class="container">
  <div class="content">
    <mat-toolbar
      color="warn"
      *ngIf="usersStore.hasError()"
      class="error-banner"
    >
      <span>{{ usersStore.error() }}</span>
      <span class="spacer"></span>
      <button mat-icon-button (click)="clearError()">
        <mat-icon>close</mat-icon>
      </button>
    </mat-toolbar>

    <div class="grid">
      <app-user-form></app-user-form>
      <app-user-list></app-user-list>
    </div>
  </div>
</div>
```

### 13. Update `frontend/src/app/app.component.css`

```css
.toolbar-title {
  margin-left: 8px;
  margin-right: 16px;
}

.toolbar-subtitle {
  opacity: 0.8;
  font-size: 14px;
}

.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content {
  margin-top: 2rem;
}

.error-banner {
  margin-bottom: 2rem;
  border-radius: 4px;
}

.spacer {
  flex: 1 1 auto;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 1rem;
  }
}
```

### 14. Update `frontend/src/app/app.config.ts`

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideAnimations()],
};
```

### 15. Update `frontend/src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>AI Agent Training App</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
  </head>
  <body class="mat-typography">
    <app-root></app-root>
  </body>
</html>
```

## Running the Application

### 1. Install dependencies

```bash
# From root directory
bun install
```

### 2. Build shared package

```bash
bun run build:shared
```

### 3. Initialize database

```bash
bun run db:push
```

### 4. Run development servers

```bash
# From root directory
bun run dev
```

This will start:

- Backend server on http://localhost:3001
- Frontend server on http://localhost:4200

### 5. Access the application

Open your browser and navigate to http://localhost:4200

## Code Quality Tools Usage

### Running Code Quality Checks

The project includes comprehensive code quality tools that enforce the coding standards described in `claude.md`.

#### Development Workflow

1. **Before committing code:**

   ```bash
   # Check everything
   bun run quality

   # Or run individual checks
   bun run typecheck
   bun run lint
   bun run format:check
   ```

2. **Auto-fix issues:**

   ```bash
   # Fix linting and formatting issues
   bun run quality:fix

   # Or run individual fixes
   bun run lint:fix
   bun run format
   ```

#### Individual Package Commands

**Root level (all packages):**

```bash
bun run lint           # Lint all packages
bun run format         # Format all packages
bun run typecheck      # Type check all packages
```

**Individual packages:**

```bash
cd backend && bun run lint
cd frontend && bun run lint
cd shared && bun run lint
```

#### IDE Integration

**VS Code Configuration:**
Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.workingDirectories": ["backend", "frontend", "shared"],
  "typescript.preferences.quoteStyle": "single",
  "prettier.requireConfig": true
}
```

**VS Code Extensions:**

- ESLint
- Prettier - Code formatter
- Angular Language Service

#### Enforced Standards

The ESLint configuration enforces:

- **Single quotes** for strings
- **2-space indentation**
- **Arrow functions** preference
- **Explicit return types** for functions
- **No `any` type** usage
- **PascalCase** for classes and types
- **camelCase** for variables and functions
- **kebab-case** for Angular selectors
- **No interface prefixing** (no `IUser`, use `User`)
- **UPPER_SNAKE_CASE** for constants

## AI Agent Best Practices

When working with this codebase using AI agents like Claude Code:

1. **Clear Instructions**: Be specific about what feature you want to add
2. **Reference Patterns**: Point to existing code patterns to follow
3. **Incremental Changes**: Build features step by step
4. **Test as You Go**: Verify each change before moving to the next
5. **Use Type Safety**: Leverage TypeScript and Zod for validation

## Summary

This setup provides:

1. **Modern Angular**: Using standalone components and Signal Store
2. **Material Design UI**: Angular Material components with Deep Purple/Amber (orange) theme
   - Pre-built form controls with validation states
   - Consistent theming across all components
   - Built-in accessibility features
   - Responsive design patterns
3. **Type Safety**: Shared Zod schemas for runtime validation
4. **Clean Architecture**: Repository pattern with service layer
5. **Simple State Management**: Angular Signals for reactive state
6. **Database**: SQLite with Drizzle ORM
7. **API Design**: RESTful APIs with Hono.js best practices
8. **Native Fetch**: No external HTTP libraries
9. **Code Quality**: Comprehensive ESLint and Prettier configurations
   - Enforces single quotes, 2-space indentation
   - TypeScript best practices with explicit return types
   - Angular-specific naming conventions
   - No `any` type usage
   - Consistent code formatting across all packages
10. **AI-Friendly Code**: Clear patterns following comprehensive Angular coding standards

The application serves as both a functional demo and a teaching tool for engineers learning to work with AI agents in their development workflow, with automated code quality enforcement to maintain consistency.

## Potential Enhancements

To further demonstrate AI agent capabilities, consider adding:

- **Data Tables**: Use `MatTableModule` for sortable, paginated lists
- **Form Dialogs**: Use `MatDialogModule` for edit functionality
- **Navigation**: Use `MatSidenavModule` for multi-feature apps
- **Theming**: Custom Material themes to match brand colors
- **Testing**: Unit tests with Jasmine/Karma or Jest
- **E2E Tests**: Cypress or Playwright for full workflow testing
