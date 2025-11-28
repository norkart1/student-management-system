# Student Management System

## Overview
A comprehensive student management system built with Next.js 15, React, TypeScript, and MongoDB. This application provides a complete portal for managing students, teachers, books, and academic events.

## Project Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB (cloud-hosted)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Authentication**: JWT-based authentication with bcryptjs

### Directory Structure
- `/app` - Next.js App Router pages and API routes
  - `/api` - Backend API endpoints (auth, students, teachers, books, events, stats)
  - `/dashboard` - Dashboard pages (students, teachers, books, calendar, settings)
  - `/login` - Login page
- `/components` - Reusable React components
  - `/ui` - Base UI components (button, input, dialog, etc.)
- `/lib` - Utility functions and configurations
  - `db.ts` - MongoDB connection handler
  - `auth.ts` - Client-side auth utilities
  - `jwt.ts` - JWT token management
  - `init-db.ts` - Database initialization
- `/hooks` - Custom React hooks
- `/public` - Static assets

## Environment Variables

### Required Secrets (Already Configured)
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_USERNAME` - Admin login username
- `ADMIN_PASSWORD` - Admin login password
- `SESSION_SECRET` - Session encryption secret

### Application Variables
- `JWT_SECRET` - JWT signing secret (set)
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry
- `NEXT_PUBLIC_APP_URL` - Public application URL

## Recent Changes (November 28, 2025)

1. **Initial Replit Setup**
   - Installed npm dependencies (509 packages)
   - Configured workflow for Next.js dev server on port 5000
   - Set up JWT_SECRET environment variable
   - Fixed TypeScript type error in `lib/init-db.ts`
   - Added middleware.ts for cache control headers (prevents Replit iframe caching issues)
   - Updated next.config.mjs with allowedDevOrigins for Replit proxy compatibility
   - Configured deployment settings for autoscale deployment

2. **Configuration Updates**
   - Already properly configured for Replit environment:
     - Port 5000 with 0.0.0.0 host binding
     - Webpack polling for file watching
     - MongoDB external dependencies handling
     - Replit-specific allowed origins for server actions

3. **Dashboard UI Enhancements**
   - Enhanced delete confirmation dialog with larger modal, gradient backgrounds, and themed styling
   - Redesigned dashboard home page with colorful gradient stat cards (Students, Teachers, Books, Events)
   - Added Weekly Overview bar chart and Activity Overview area chart using recharts library

4. **Live Chart Data Integration**
   - Updated /api/stats endpoint to return weekly enrollment data
   - Charts now display real-time data from MongoDB based on createdAt timestamps
   - Shows students, teachers, and books added in the last 7 days
   - Activity chart aggregates total additions per day
   - Loading and empty states for charts handled gracefully

## Running the Application

### Development
The workflow "Next.js App" runs automatically and executes:
```bash
npm run dev
```
This starts the Next.js development server on http://0.0.0.0:5000

### Production Build
```bash
npm run build
npm run start
```

## Database
- MongoDB is used for data persistence
- Collections: students, teachers, books
- Database initialization runs automatically on first connection
- Indexes created on email fields for students/teachers and isbn for books

## Deployment
Configured for Replit Autoscale deployment:
- Build command: `npm run build`
- Run command: `npm run start`
- Automatically scales based on traffic

## Authentication Flow
1. Admin logs in with username/password
2. Server validates credentials and returns JWT token
3. Token stored in localStorage on client
4. Protected routes verify token on each request
5. Token expires after 7 days

## Known Issues/Notes
- TypeScript build errors ignored in next.config.mjs (legacy code)
- Images are unoptimized for faster builds
- Webpack polling enabled for Replit file system compatibility
