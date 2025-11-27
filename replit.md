# Student Management System

## Overview
A Next.js-based student management application for tracking students, teachers, books, and events. Built with React, TypeScript, and MongoDB for data storage, with environment variable-based authentication.

**Project State**: Configured for Replit and Vercel deployment (November 27, 2025)

## Tech Stack
- **Frontend**: Next.js 15.5.6, React 18.3, TypeScript 5.1
- **UI Components**: Radix UI, Tailwind CSS
- **Database**: MongoDB (for students, teachers, books, events data)
- **Authentication**: JWT-based admin auth with bcrypt password hashing (credentials stored in environment variables)

## Project Structure
```
/app                 - Next.js app directory
  /api              - API routes (auth, students, teachers, books, events, stats)
  /dashboard        - Dashboard pages
  /login            - Login page
/components         - React components (UI components, dialogs, layouts)
  /ui               - Shadcn UI components
/lib                - Utility functions (auth, database, init)
/public             - Static assets
```

## Database Schema
MongoDB collections:
- **students**: Student records (fullName, email, phone, image)
- **teachers**: Teacher records (fullName, email, phone, image)
- **books**: Book records (title, author)
- **events**: Calendar events (created via API)
- **admins**: Admin user accounts with hashed passwords

## Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string (required for data storage)
- `JWT_SECRET`: Secret key for JWT token signing (optional, has default for development)

### Secrets (Encrypted)
- `ADMIN_USERNAME`: Admin login username (stored securely, no one can see it)
- `ADMIN_PASSWORD`: Admin login password (stored securely, no one can see it)

### Dev Server
- Port: 5000
- Host: 0.0.0.0
- Configured for Replit proxy and Vercel deployment

### Authentication
- JWT-based authentication with credentials stored in encrypted secrets
- No database required for authentication - works with Vercel and any hosting platform
- Admin credentials are stored securely in environment secrets

## Workflow
- **Start Application**: Runs `next dev -p 5000 -H 0.0.0.0`

## Key Features
- Student management (add, view, delete)
- Teacher management
- Book library tracking
- Event calendar
- Dashboard with statistics
- **Admin Settings Page** with:
  - Profile management (username, email, profile image)
  - Password change with secure validation
  - System status monitoring (API, database, site health)
- Modern PC-optimized design with sidebar navigation
- Responsive layout (sidebar on desktop, bottom nav on mobile)
- Custom SVG favicon

## Recent Changes
- **2025-11-27**: Simplified Registration Forms Update
  - Updated student registration form: fullName, email, phone, image upload
  - Updated teacher registration form: fullName, email, phone, image upload
  - Updated book registration form: title and author only
  - Added photo display in data tables with avatar fallbacks
  - Modernized dialog styling with consistent slate/emerald theme

- **2025-11-27**: Fresh GitHub Import to Replit - Setup Complete
  - Successfully imported from GitHub repository to fresh Replit environment
  - Installed all npm dependencies (510 packages including Next.js SWC)
  - Configured workflow "Start Application" running on port 5000 with 0.0.0.0 host
  - Next.js 15.5.6 dev server verified working and accessible
  - Next.js config already properly configured with:
    - serverActions.allowedOrigins for Replit domains
    - Port 5000 binding with 0.0.0.0 host
    - Webpack configuration for MongoDB native dependencies
  - Deployment configuration set to autoscale deployment with:
    - Build: npm run build
    - Run: npm run start
  - Environment variables already configured as secrets (MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD)
  - Application fully functional and accessible through Replit proxy
  - Login page displaying correctly

- **2025-11-27**: Admin Settings & Security Update
  - Added comprehensive admin settings page (/dashboard/settings)
  - Implemented secure MongoDB-based authentication
  - Passwords now hashed with bcrypt (10 rounds)
  - JWT tokens for session management
  - Profile image upload support
  - System status monitoring (API, database, storage)
  - Fixed transparent dialog backgrounds with solid white styling
  - Fixed form input backgrounds for better visibility
  - Added custom SVG favicon

- **2025-11-27**: PC-optimized UI redesign
  - Updated sidebar to show on md+ screens with modern slate/emerald design
  - Added menu item descriptions and Settings button to sidebar
  - Hidden bottom navigation on desktop (md+ screens)
  - Modernized data tables with search icon, improved empty states
  - Updated all dashboard pages with consistent modern design
  - Configured deployment settings for production (autoscale)

- **2025-11-27**: Initial import and Replit environment setup
  - Configured for port 5000 with 0.0.0.0 host
  - Next.js config already includes Replit allowedDevOrigins
  - Removed replit.md from .gitignore
  - Set up workflow for Next.js dev server

## User Preferences
- PC-first design with sidebar navigation (requested 2025-11-27)

## Notes
- MongoDB needs to be set up externally (MongoDB Atlas recommended)
- Application requires MONGODB_URI environment variable to run
