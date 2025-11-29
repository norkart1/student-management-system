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

### Optional: Image Upload (Cloudinary)
Note: Image upload feature requires Cloudinary credentials. If not configured, the upload feature will return an error.
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key  
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Recent Changes

### November 29, 2025 - Fresh GitHub Import Setup (Third Session)
1. **Project Re-Import from GitHub**
   - Fresh clone re-imported to Replit environment
   - Installed all npm dependencies (537 packages) using --legacy-peer-deps flag to resolve gcp-metadata peer dependency conflict
   - All secrets pre-configured and verified (MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET, JWT_SECRET, CLOUDINARY credentials)

2. **Workflow Configuration**
   - Configured "Next.js App" workflow with `npm run dev` command
   - Server properly bound to 0.0.0.0:5000 for Replit proxy compatibility
   - Webview output type configured for port 5000
   - Application successfully compiles and serves all routes

3. **Deployment Configuration**
   - Set up Replit Autoscale deployment
   - Build command: `npm run build`
   - Run command: `npm run start`
   - Port 5000 configured for production serving

4. **Verification**
   - Login page rendering successfully with beautiful UI
   - Database connection verified: API status shows database online (0ms latency, 0.02 MB storage)
   - API endpoints functional (status: online with 12ms API latency, 42ms main site latency)
   - All Next.js routes compiling successfully
   - Application ready for use in Replit environment

### November 29, 2025 - Fresh GitHub Import Setup (Second Session)
1. **Project Re-Import from GitHub**
   - Fresh clone re-imported to Replit environment
   - Installed all npm dependencies (572 packages successfully)
   - All secrets pre-configured and verified (MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET, JWT_SECRET)

2. **Workflow Configuration**
   - Configured "Next.js App" workflow with `npm run dev` command
   - Server properly bound to 0.0.0.0:5000 for Replit proxy compatibility
   - Webview output type configured for port 5000
   - Application successfully compiles and serves all routes

3. **Deployment Configuration**
   - Set up Replit Autoscale deployment
   - Build command: `npm run build`
   - Run command: `npm run start`
   - Port 5000 configured for production serving

4. **Verification**
   - Login page rendering successfully with beautiful UI
   - Database connection verified: API status shows database online (158ms latency)
   - API endpoints functional (status, auth, students, teachers, books, events)
   - All Next.js routes compiling successfully
   - Application ready for use in Replit environment

### November 29, 2025 - Auto-Capitalization & Bulk Reports with Images
1. **Auto-Capitalization for Names**
   - Created `lib/text-utils.ts` with `toTitleCase` utility function
   - Student names automatically capitalize each word as you type
   - Teacher names automatically capitalize each word as you type
   - Book titles and author names automatically capitalize each word as you type

2. **Bulk Reports with Profile Images**
   - Updated `lib/report-utils.ts` to include photos in bulk report tables
   - Students/Teachers: Circular profile thumbnails (40x40px)
   - Books: Rectangular cover thumbnails (35x50px)
   - Placeholder icons shown for records without images
   - Works for both Print and PDF Download options

### November 29, 2025 - Image Display Fix & Mobile UI Improvements
1. **Fixed Image Display in Data Tables**
   - Added imageUrl column to Students page columns with type="image"
   - Added imageUrl column to Teachers page columns with type="image"
   - Added imageUrl column to Books page columns with type="image" and imageStyle="book"
   - Images now properly display in both desktop table and mobile card views

2. **Improved Mobile Delete Dialog**
   - Made delete confirmation dialog wider on mobile
   - Improved responsive padding and spacing
   - Better text sizing for mobile readability

### November 29, 2025 - Image Upload Feature
1. **Cloudinary Integration**
   - Installed next-cloudinary and cloudinary packages
   - Created image upload component with preview and remove functionality
   - Created /api/upload route for handling image uploads to Cloudinary
   - Profile images auto-cropped to face-centered 200x200
   - Book covers auto-cropped to 300x450

2. **Updated Dialogs**
   - Added image upload to Add/Edit Student dialog
   - Added image upload to Add/Edit Teacher dialog
   - Added image upload to Add/Edit Book dialog (with book cover aspect ratio)

3. **Configuration**
   - Added Cloudinary domain to Next.js image remotePatterns
   - Image URLs stored in MongoDB with each record

### November 29, 2025 - Fresh GitHub Project Import to Replit
1. **Project Import and Setup**
   - Fresh clone from GitHub repository
   - Installed all npm dependencies (518 packages)
   - Verified MongoDB connection successfully established
   - JWT_SECRET environment variable configured in shared environment
   - All secrets properly configured (MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET)

2. **Workflow Configuration**
   - Set up "Next.js App" workflow running on port 5000 with webview output
   - Server bound to 0.0.0.0:5000 for Replit proxy compatibility
   - Next.js config already includes REPLIT_DEV_DOMAIN and REPLIT_DOMAINS for proper host header handling
   - Webpack polling enabled for Replit file system compatibility

3. **Deployment Configuration**
   - Configured Replit Autoscale deployment
   - Build command: `npm run build`
   - Run command: `npm run start`
   - Port 5000 configured for frontend serving

4. **Verification**
   - Application successfully compiles and serves all routes
   - Login page rendering correctly with beautiful UI
   - MongoDB connection verified: `[v0] Successfully connected to MongoDB`
   - Database status endpoint confirmed: database online with 487ms latency
   - API endpoints functional (status, login, students, teachers, books, events)
   - All middleware and routes compiling successfully

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

### November 29, 2025 - Security & Code Quality Improvements
1. **Enhanced API Security**
   - Added JWT authentication validation to all mutating API routes (POST, PUT, DELETE)
   - Students, Teachers, Books, Events routes now require valid JWT token
   - Upload route protected with auth middleware
   - Admin devices route uses consistent auth-middleware pattern
   - GET endpoints remain public for profile viewing/sharing

2. **Improved Error Handling**
   - Added input validation for all API routes
   - ObjectId validation prevents invalid MongoDB queries
   - Proper HTTP status codes (400 for bad request, 401 for unauthorized, 404 for not found)
   - Consistent error response format across all endpoints

3. **Code Quality**
   - Fixed JWT_SECRET variable reference to use getJwtSecret() function
   - Added TypeScript interfaces for request input types
   - Removed "latest" tags from package.json dependencies
   - Moved @types packages to devDependencies
   - Consolidated font loading using Google Fonts CDN with preconnect

4. **Font Configuration**
   - Using Anek Latin and Anek Malayalam fonts for improved typography
   - Google Fonts loaded via CDN with preconnect for performance
   - Tailwind fontFamily configured for consistent styling

## Known Issues/Notes
- TypeScript build errors ignored in next.config.mjs (legacy code)
- Images are unoptimized for faster builds
- Webpack polling enabled for Replit file system compatibility
- Minor hydration mismatch warning in development (caused by browser extensions, not a production issue)
