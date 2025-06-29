# AI Agent Training App

A full-stack TypeScript application designed to help engineers learn how to effectively collaborate with AI Agents like Claude Code for more efficient software development.

## 🎯 Purpose

This application teaches **universal principles for AI-friendly code organization** that work with any tech stack. While we use Hono.js and Angular for demonstration, the collaboration patterns you'll learn apply equally to React, Vue, Rails, Django, or any other framework.

**Key Learning Objectives:**

- Structure codebases for maximum AI agent understanding
- Use established patterns and conventions that AI agents can reference
- Organize code in predictable ways that reduce AI context switching
- Implement quality tools that create consistency AI agents can leverage

## 🚀 Framework Agnostic Learning

**Important:** The specific technologies used here (Hono.js, Angular) are just well-documented examples. The real value is learning **collaboration patterns that transfer to any project**.

### Universal AI Collaboration Principles

- **Established Patterns Over Custom**: Use well-known libraries/frameworks AI agents can reference
- **Clear Naming Conventions**: Self-documenting code works in any language
- **Predictable Structure**: Consistent organization aids AI understanding
- **Type Safety**: Whether TypeScript, Python typing, Sorbet, or others - types help AI agents
- **Quality Tools**: Linting and formatting create consistency AI agents can leverage

## 🏗️ Architecture Overview

**Demo Technology Stack** (chosen for training purposes):

- **Backend**: Hono.js + Drizzle ORM + Bun runtime
- **Frontend**: Angular 19 + NgRx Signal Store + Angular Material
- **Shared**: Zod schemas for full-stack type safety
- **Monorepo**: Clear separation of concerns across packages

**Why These Choices**: Well-documented, AI-agent friendly, but NOT required for effective AI collaboration.

**Core Patterns** (work with any framework):

- Repository pattern for data access
- Feature-based organization over type-based
- Shared types for end-to-end safety
- Consistent naming conventions

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Run both frontend and backend
bun run dev
```

- Frontend: http://localhost:4200
- Backend API: http://localhost:3001
- Features: User CRUD operations with real-time updates

_Note: You can apply the learned principles to your preferred tech stack_

## 📚 Learning Resources

- **[CLAUDE.md](./CLAUDE.md)** - Essential coding standards that work with any tech stack
- **Package Documentation**: See individual README files in `/frontend`, `/backend`, and `/shared`

## 🛠️ Apply to Your Stack

### Ruby on Rails Example

The same AI-friendly principles apply to Rails applications:

```ruby
# Feature-based organization
app/
  models/user/
  controllers/users/
  services/user/

# Clear naming conventions
class UserService
class UsersController
user_repository.rb

# Repository pattern with Rails
class UserRepository
  def self.find_active_users
    User.where(active: true)
  end
end

# Type safety with Sorbet
# typed: true
class User < ApplicationRecord
  sig { returns(T::Array[User]) }
  def self.active_users; end
end

# Quality tools
# .rubocop.yml for consistent formatting
# Sorbet/RBS for type annotations
# Rails conventions AI agents understand
```

## 📁 Project Structure

```
ai-agent-training-app/
├── shared/          # Common types and schemas
├── backend/         # Hono.js API server
├── frontend/        # Angular application
├── CLAUDE.md        # AI agent coding standards
└── README.md        # This file
```

## 💡 AI Agent Benefits

This codebase demonstrates features that make any project AI-agent friendly:

- Self-documenting code with clear naming
- Established patterns over custom implementations
- Comprehensive type safety across the stack
- Automated quality enforcement
- Predictable file and folder organization

---

**Remember**: The goal isn't to master Hono.js or Angular, but to learn collaboration patterns that make you more productive with AI agents in any codebase.
