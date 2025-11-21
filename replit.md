# Student Management System

## Overview

A comprehensive web-based student management platform built with Next.js 14 that enables administrators to manage students, teachers, books, and academic calendars. The application provides a modern, responsive interface with role-based access control and real-time data management capabilities.

**Core Purpose**: Centralized management of educational institution data including student records, teacher information, library books, and academic scheduling with live statistics and attendance tracking.

**Tech Stack**: Next.js 14 (App Router), React, TypeScript, MongoDB, Tailwind CSS, Radix UI components

**Recent Updates** (November 21, 2025):
- Implemented live dashboard statistics that fetch real-time counts from the database
- Added calendar feature with month/year navigation and attendance tracking
- Created dedicated `/api/stats` endpoint for efficient data counting
- Integrated calendar into sidebar and bottom navigation
- Added comprehensive error handling with null-safe fallbacks
- Created footer component with social media icons and contact information
- Added security attributes (rel="noopener noreferrer") to external links

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14 with App Router (RSC - React Server Components enabled)
- **Rationale**: Provides server-side rendering, optimized performance, and modern React features with file-based routing
- **UI Component Library**: Shadcn UI (Radix UI primitives) with "new-york" style preset
- **Styling**: Tailwind CSS with custom design tokens using OKLCH color space
- **State Management**: React hooks (useState, useEffect) for local component state
- **Client-Side Routing**: Next.js navigation with programmatic routing via `useRouter`

**Design System**:
- Custom color scheme with primary (blue), secondary (orange), accent (green), and tropical theme variants
- Support for light/dark mode theming
- Responsive design with mobile-first approach (bottom navigation for mobile, sidebar for desktop)
- Icon library: Lucide React

### Authentication & Authorization

**Authentication Mechanism**: Simple token-based authentication with localStorage
- **Approach**: Basic admin credentials (hardcoded) with base64-encoded tokens
- **Rationale**: Lightweight solution for single-user admin access without complex user management
- **Flow**: 
  1. Login validates against hardcoded credentials (username: "admin", password: "12345@Admin")
  2. Generates base64 token containing username and timestamp
  3. Stores token in localStorage
  4. Protected routes verify token via `/api/auth/verify` endpoint
- **Protected Routes**: Custom `ProtectedLayout` component wraps dashboard routes and redirects unauthenticated users
- **Limitations**: Not production-ready for multi-user scenarios; designed for MVP/demo purposes

### Backend Architecture

**API Structure**: Next.js API Routes (App Router convention)
- **Pattern**: RESTful endpoints organized by resource (`/api/students`, `/api/teachers`, `/api/books`, `/api/stats`, `/api/auth`)
- **Operations**: Standard CRUD operations (GET, POST, PUT, DELETE)
- **Route Handlers**: TypeScript-based route handlers using Next.js Route Handler API

**Key API Endpoints**:
- `POST /api/auth/login` - Authentication
- `GET /api/auth/verify` - Token verification
- `/api/students/*` - Student CRUD operations
- `/api/teachers/*` - Teacher CRUD operations
- `/api/books/*` - Book CRUD operations
- `GET /api/stats` - Dashboard statistics aggregation (efficient document counting)

### Data Layer

**Database**: MongoDB (NoSQL document database)
- **Connection Management**: Singleton pattern with connection caching to prevent connection pool exhaustion
- **Collections**:
  - `students` - Student records (indexed on email)
  - `teachers` - Teacher profiles (indexed on email)
  - `books` - Library inventory (indexed on ISBN)
- **Schema**: Document-based with timestamp tracking (createdAt, updatedAt)
- **Initialization**: Automatic collection creation with index setup via `initializeDatabase()`

**Data Access Pattern**:
- Direct MongoDB driver usage (no ORM)
- Connection pooling handled by cached client instance
- Type safety through TypeScript interfaces
- ObjectId handling for document references

### Component Architecture

**Layout Components**:
- `RootLayout` - Global HTML structure, font loading, analytics integration
- `ProtectedLayout` - Authentication wrapper with sidebar, bottom navigation, and footer
- `Sidebar` - Desktop navigation with menu items and calendar icon
- `BottomNav` - Mobile-optimized bottom navigation bar with calendar icon
- `Footer` - Dark gradient footer with social media icons, contact information, and quick links

**Feature Components**:
- `DataTable` - Reusable table component with search, edit, delete actions
- `AddStudentDialog` - Modal form for student creation/editing
- `Calendar` - Custom calendar implementation with month/year navigation, circular date selection, and today indicator
- `ProfileDropdown` - User menu with logout functionality
- `Avatar` - User avatar component with fallback initials

**UI Components**: Shadcn UI components (Button, Input, Dialog, Card, Table, Avatar, etc.)

**Dashboard Features**:
- **Live Statistics**: Real-time counts for students, teachers, and books fetched from MongoDB
- **Error Handling**: Robust null-safe fallbacks that display "N/A" when data cannot be retrieved
- **Today's Plan**: Task list showing scheduled activities
- **Quick Access**: Navigation cards to all modules with live counts

### Navigation & Routing

**Multi-Device Strategy**:
- Desktop: Persistent sidebar navigation
- Mobile: Bottom navigation bar (hidden on desktop via Tailwind breakpoints)
- Conditional rendering based on viewport size using `lg:` prefix

**Route Structure**:
- `/` - Landing/redirect page
- `/login` - Authentication page
- `/dashboard` - Main dashboard with live statistics and today's plan
- `/dashboard/students` - Student management
- `/dashboard/teachers` - Teacher management
- `/dashboard/books` - Library management
- `/dashboard/calendar` - Attendance calendar with student list

## External Dependencies

### Cloud Services & Databases

**MongoDB Atlas** (or self-hosted MongoDB)
- Connection via `mongodb` npm package
- Connection string via `MONGODB_URI` environment variable
- Default fallback: `mongodb://localhost:27017/student_management`
- Zstandard compression support via `@mongodb-js/zstd`

### Third-Party Libraries

**UI & Styling**:
- `@radix-ui/*` - Headless UI component primitives (20+ components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `lucide-react` - Icon library

**React Ecosystem**:
- `next` - Framework and React runtime
- `react-hook-form` & `@hookform/resolvers` - Form management
- `date-fns` - Date manipulation utilities
- `embla-carousel-react` - Carousel functionality
- `cmdk` - Command menu component

**Analytics**:
- `@vercel/analytics` - Vercel Analytics integration for usage tracking

**Development Dependencies**:
- TypeScript configuration with strict mode
- ESLint for code linting
- Path aliases configured (`@/*` maps to project root)

### Font Assets

- `Geist` & `Geist_Mono` from Google Fonts (loaded in root layout)

### Environment Configuration

**Required Environment Variables**:
- `MONGODB_URI` - MongoDB connection string (critical for database connectivity)

**Optional Integrations**:
- AWS SDK credentials (via `@aws-sdk/credential-providers`)
- GCP metadata (via `gcp-metadata`)