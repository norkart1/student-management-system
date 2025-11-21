# Student Management System

## Overview

A comprehensive web-based student management platform built with Next.js 14+ that enables educational institutions to manage students, teachers, and books. The application features a modern, responsive interface with role-based access control and real-time data management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & UI Library**
- **Next.js 14+ with App Router**: Chosen for server-side rendering capabilities, file-based routing, and React Server Components support. Provides excellent SEO and initial load performance.
- **React 18+**: Leverages latest React features including hooks, suspense, and concurrent rendering.
- **Shadcn UI Components**: Built on Radix UI primitives, providing accessible, customizable components with consistent design patterns. Uses the "new-york" style variant.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development with custom design tokens defined in CSS variables (oklch color space).

**Design Patterns**
- **Component Composition**: Reusable UI components (`DataTable`, `Spinner`, `ProtectedLayout`) promote code reuse and maintainability.
- **Client Components**: Strategic use of `"use client"` directive for interactive features (forms, dialogs, navigation) while keeping data-fetching logic server-side where possible.
- **Protected Routes**: Custom `useAuth` hook with route guards ensures authenticated access to dashboard pages.

**State Management**
- **React Hooks**: `useState` and `useEffect` for local component state and side effects.
- **Client-side Storage**: localStorage for authentication token persistence.
- **Server State**: API calls with fetch for CRUD operations, with component-level loading states.

**Navigation & Routing**
- **Responsive Navigation**: Desktop sidebar and mobile bottom navigation for optimal UX across devices.
- **Dynamic Route Handling**: Next.js App Router with nested layouts and route groups.

### Backend Architecture

**API Design**
- **Next.js API Routes**: RESTful API endpoints following resource-based patterns (`/api/students`, `/api/teachers`, `/api/books`).
- **Route Handlers**: Support for GET, POST, PUT, DELETE operations with proper HTTP status codes.
- **Resource-based Routing**: Individual resource endpoints (`/api/students/[id]`) for granular operations.

**Authentication & Authorization**
- **Simple Token-based Auth**: Basic authentication using base64-encoded tokens (suitable for development; production should use JWT or OAuth).
- **Hardcoded Admin Credentials**: Username: "admin", Password: "12345@Admin" (defined in `lib/auth.ts`).
- **Auth Verification**: `/api/auth/verify` endpoint validates tokens on protected routes.
- **Client-side Guards**: `useAuth` hook prevents unauthorized access and redirects to login.

**Data Layer**
- **MongoDB Collections**: Three primary collections (students, teachers, books) with automatic timestamp tracking (createdAt, updatedAt).
- **Connection Pooling**: Cached MongoDB client and database connections to optimize performance.
- **Database Initialization**: Automatic collection creation with indexes on key fields (email for students/teachers, ISBN for books).

**Error Handling**
- Consistent error responses with appropriate HTTP status codes (401, 404, 500).
- Try-catch blocks around database operations with graceful error messages.

### External Dependencies

**Database**
- **MongoDB**: Primary data store requiring `MONGODB_URI` environment variable.
  - Default: `mongodb://localhost:27017`
  - Database name: `student_management` (configurable via `MONGODB_DB`)
  - Driver: Native MongoDB Node.js driver with Zstandard compression support (`@mongodb-js/zstd`)

**Cloud Services**
- **Vercel Analytics**: Integrated for usage tracking and performance monitoring.
- **AWS SDK**: Credential providers available for potential AWS service integration.
- **GCP Metadata**: Support for Google Cloud Platform metadata services.

**UI & Styling**
- **Radix UI**: Comprehensive collection of accessible component primitives (dialogs, dropdowns, checkboxes, tables, etc.).
- **Lucide Icons**: Icon library for consistent iconography throughout the application.
- **class-variance-authority**: Type-safe variant API for component styling.
- **tailwind-merge**: Intelligent Tailwind class merging utility.

**Fonts**
- **Geist & Geist Mono**: Google Fonts for modern typography.

**Development Tools**
- **TypeScript**: Strict type checking with ES6 target and Next.js plugin integration.
- **ESLint**: Code quality and consistency enforcement.

**Build Configuration**
- Custom development server on port 5000 bound to all interfaces (0.0.0.0) for Replit compatibility.
- TypeScript path aliases (@/ maps to root) for clean imports.

## Recent Changes

### Leave Functionality Removal (November 21, 2025)
- **Feature Removal**: Completely removed leave management functionality from the application
  - Deleted leave management page (`/dashboard/leaves`)
  - Removed leave API routes (`/api/leaves` and `/api/leaves/[id]`)
  - Removed leave navigation items from sidebar and bottom navigation
  - Removed leave database initialization code
  - Updated dashboard to show only 3 modules (Students, Teachers, Books)
- **Status**: Application now focuses on core student, teacher, and book management features

### Replit Migration (November 21, 2025)
- **Environment Setup**: Migrated project from Vercel to Replit environment
- **Dependencies**: Installed all project dependencies using pnpm package manager
- **Database Configuration**: MongoDB credentials configured via Replit Secrets (MONGODB_URI, MONGODB_DB)
- **Workflow Configuration**: Set up Next.js production server workflow on port 5000
  - Note: Using production server (`pnpm start`) instead of dev server due to Next.js 16 Turbopack compilation issues in Replit environment
  - Production build works perfectly and application runs without errors
- **Deployment**: Configured autoscale deployment with proper build and start commands
- **Status**: Application successfully running and accessible via web preview

### Known Issues
- Next.js 16 dev server with Turbopack crashes during compilation in Replit environment
- Workaround: Using production server for development, which requires running `pnpm build` after code changes
- Vercel Analytics warnings in console (expected, as not deployed on Vercel platform)