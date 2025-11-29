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
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Application Variables
- `JWT_SECRET` - JWT signing secret (set)
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry
- `NEXT_PUBLIC_APP_URL` - Public application URL

## Cloudinary Setup

To enable image uploads, you need to create an **unsigned upload preset** in your Cloudinary dashboard:

1. Go to cloudinary.com and log in
2. Navigate to Settings > Upload
3. Scroll to "Upload presets" section
4. Click "Add upload preset"
5. Set the preset name to: `student_management`
6. Set "Signing Mode" to: `Unsigned`
7. Save the preset

This allows the app to upload profile photos for students/teachers and book cover images.

## Recent Changes

### November 29, 2025 - Fresh Replit Environment Setup
1. **Project Import and Configuration**
   - Fresh clone from GitHub repository
   - Installed npm dependencies (517 packages)
   - Set up JWT_SECRET environment variable in shared environment
   - Configured workflow for Next.js dev server on port 5000 with webview output
   - Configured autoscale deployment settings (build + start commands)

2. **Verified Configuration**
   - Next.js config properly configured with REPLIT_DEV_DOMAIN and REPLIT_DOMAINS for proxy support
   - Package.json dev script already set to run on 0.0.0.0:5000
   - Workflow running successfully - application compiling and serving routes
   - All environment secrets pre-configured (MongoDB, Cloudinary, Admin credentials)

### November 28, 2025 - Previous Setup
1. **Fresh Replit Setup from GitHub Import**
   - Installed npm dependencies (509 packages)
   - Configured workflow for Next.js dev server on port 5000
   - Set up JWT_SECRET environment variable
   - Updated next.config.mjs with dynamic allowedDevOrigins using REPLIT_DEV_DOMAIN/REPLIT_DOMAINS
   - Configured autoscale deployment settings
   - Loaded 25 mock entries each for students, teachers, and books

2. **Cloudinary Integration for Image Uploads**
   - Installed next-cloudinary package
   - Created CloudinaryUpload component (components/cloudinary-upload.tsx)
   - Updated AddStudentDialog to use Cloudinary uploads
   - Updated Teachers page to use Cloudinary uploads
   - Added book cover image support to Books page
   - Updated DataTable to display both avatar (circular) and book cover (rectangular) images

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
