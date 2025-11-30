# Student Management System

## Overview

A comprehensive web application for managing students, teachers, books, and academic events. Built with Next.js 14 (App Router), React, TypeScript, and MongoDB. The system provides CRUD operations for educational entities, calendar event management, analytics dashboards, and public profile pages with QR code generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14 with App Router and React Server Components
- **Rationale**: Leverages modern React patterns with server-side rendering for better performance and SEO
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **State Management**: React hooks (useState, useEffect) for local component state
- **Form Handling**: React Hook Form with Zod validation (@hookform/resolvers)
- **Icons**: Lucide React icon library

**Design Patterns**:
- Protected routes using client-side authentication checks via `useAuth` hook
- Shared `ProtectedLayout` component wrapping authenticated pages
- Responsive design with desktop sidebar and mobile bottom navigation
- Reusable dialog components for CRUD operations
- Custom data table component with search, filtering, and actions

**Client-Side Routing**: Next.js App Router with nested layouts for profile pages

### Backend Architecture

**Runtime**: Next.js API Routes (serverless functions)
- **Rationale**: Collocated with frontend code, automatic API endpoint creation, edge-ready
- **Authentication**: JWT-based with environment variable credentials (no database for admin users)
- **Authorization**: Middleware pattern using `validateAuth` helper for protected endpoints

**API Structure**:
- RESTful endpoints organized by resource (`/api/students`, `/api/teachers`, `/api/books`, `/api/events`)
- CRUD operations using standard HTTP methods (GET, POST, PUT, DELETE)
- Nested routes for individual resource operations (`/api/students/[id]`)
- Centralized auth middleware (`lib/auth-middleware.ts`)
- Token extraction and validation reusable across endpoints

**Authentication Flow**:
1. Admin credentials validated against environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
2. JWT token generated with 7-day expiration
3. Token stored in localStorage on client
4. Device tracking on login with user agent parsing
5. Token verification on protected API requests via Authorization header

### Data Storage

**Database**: MongoDB with native Node.js driver
- **Rationale**: Flexible schema for varying entity structures, scalable, cloud-ready
- **Connection Management**: Cached connection pattern to reuse database instances across serverless invocations
- **Collections**: `students`, `teachers`, `books`, `events`, `devices`
- **Indexes**: Email index on students/teachers, ISBN on books for faster queries

**Schema Design**:
- Documents include `createdAt` and `updatedAt` timestamps
- ObjectId used for primary keys
- Nullable fields for optional data (imageUrl, description, isbn)
- No relational constraints (NoSQL approach)

**Initialization**: Database collections created on first connection if they don't exist

### External Dependencies

**Image Storage**: Cloudinary
- **Purpose**: Profile images for students/teachers, book covers
- **Configuration**: Cloud name, API key, and secret from environment variables
- **Upload Flow**: Client uploads to API route, server uploads to Cloudinary, returns URL
- **Validation**: File type checking (JPEG, PNG, GIF, WebP), 5MB size limit

**QR Code Generation**: qrcode library
- **Purpose**: Generate QR codes for public profile pages
- **Implementation**: Client-side generation on profile pages, data URL format
- **Use Case**: Shareable student/teacher/book profiles

**Analytics**: Vercel Analytics
- **Purpose**: Track page views and user interactions
- **Integration**: Client-side script injection

**Chart Library**: Recharts
- **Purpose**: Dashboard visualizations (bar charts, area charts)
- **Data**: Weekly statistics for students, teachers, books added

**Authentication**: jsonwebtoken
- **Purpose**: Generate and verify JWT tokens
- **Configuration**: Secret from `JWT_SECRET` environment variable
- **Expiration**: 7 days

**Environment Configuration**:
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Token signing secret
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account identifier
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `NEXT_PUBLIC_APP_URL`: Base URL for the application (fallback to Vercel/Replit domains)

**PDF/Print Generation**: Client-side HTML-to-print using browser print dialog
- **Rationale**: No backend PDF generation needed, uses native browser capabilities
- **Implementation**: Custom report templates with print-specific CSS

**Date Handling**: date-fns library for formatting and manipulation

**Middleware**: Next.js middleware for cache control headers on all routes (no-cache strategy)