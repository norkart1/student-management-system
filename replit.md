# Student Management System

## Overview

A comprehensive web-based Student Management System built with Next.js 16, providing functionality for managing students, teachers, library books, and leave records. The application features a dashboard interface with protected routes, data management capabilities, and a simple authentication system.

**Recent Changes (November 13, 2025)**
- Migrated from Vercel to Replit
- Updated to Next.js 16 with TypeScript 5.9.3
- Configured for Replit environment (port 5000, host 0.0.0.0)
- Running in production mode due to known Turbopack dev-mode instability
- MongoDB connection configured via environment variables

## User Preferences

Preferred communication style: Simple, everyday language.

## Replit Configuration

**Environment Variables**
- `MONGODB_URI` (required): MongoDB connection string
- `MONGODB_DB` (optional): Database name, defaults to "student_management"

**Workflow**
- Running in production mode using `pnpm run start` on port 5000
- Note: Dev mode (`pnpm run dev`) with Turbopack has known compilation issues with this project

**Deployment**
- Configured for autoscale deployment
- Build command: `pnpm run build`
- Start command: `pnpm run start`

## System Architecture

### Frontend Architecture

**Framework & UI Components**
- Next.js 16 with App Router and React Server Components (RSC)
- TypeScript 5.9.3 for type safety
- Shadcn/ui component library (New York style variant) built on Radix UI primitives
- Tailwind CSS with custom OKLCH color system for styling
- Client-side routing with protected route pattern

**Authentication & State Management**
- Client-side authentication using localStorage tokens
- Custom `useAuth` hook for authentication state management
- Protected layout wrapper component that guards authenticated routes
- Session verification via API calls on mount

**Component Architecture**
- Reusable UI components following atomic design principles
- Data table component with search/filter capabilities
- Dialog-based forms for CRUD operations
- Protected layout component wrapping authenticated pages
- Sidebar navigation component for dashboard access

### Backend Architecture

**API Design**
- RESTful API routes following Next.js App Router conventions
- Resource-based endpoints for students, teachers, books, and leaves
- CRUD operations (GET, POST, PUT, DELETE) for each resource
- Individual resource routes using dynamic `[id]` parameters

**Authentication System**
- Hardcoded admin credentials (username: "admin", password: "12345@Admin")
- Token-based authentication using Base64-encoded credentials
- Authorization header verification for protected API endpoints
- Simple token validation without expiration

**Data Layer**
- MongoDB collections for each entity (students, teachers, books, leaves)
- Connection pooling with cached client/database instances
- Indexed fields on email (students/teachers) and ISBN (books)
- Timestamps (createdAt, updatedAt) on all documents

### External Dependencies

**Database**
- MongoDB as primary data store
- Native MongoDB Node.js driver (not using Drizzle or other ORM)
- Collections: students, teachers, books, leaves
- Database initialization script creates collections and indexes on startup

**Third-Party Services**
- Vercel Analytics for application monitoring
- No external authentication providers (uses custom implementation)
- No external APIs or webhook integrations

**UI Libraries**
- Radix UI primitives for accessible component foundation
- Lucide icons for iconography
- next-themes for theme management (light/dark mode support)
- class-variance-authority for component variant styling

**Development Tools**
- TypeScript for static typing
- ESLint for code quality
- Geist and Geist Mono fonts from Google Fonts