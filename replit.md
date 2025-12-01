# Student Management System

## Overview
A comprehensive Next.js-based Student Management System for educational institutions. The platform provides a unified interface for managing students, teachers, library books, and events.

**Status**: Successfully imported and running on Replit
**Last Updated**: December 1, 2025

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15.5.6 (React 18.3.1)
- **Language**: TypeScript
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Image Management**: Cloudinary
- **Authentication**: JWT (JSON Web Tokens)

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── admin/        # Admin-related endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   ├── books/        # Library book management
│   │   ├── events/       # Event management
│   │   └── upload/       # Image upload (Cloudinary)
│   ├── dashboard/        # Main dashboard pages
│   ├── login/            # Login page
│   └── profile/          # User profile pages
├── components/            # React components
│   └── ui/               # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   ├── db.ts            # MongoDB connection
│   ├── auth.ts          # Authentication logic
│   ├── jwt.ts           # JWT utilities
│   └── init-db.ts       # Database initialization
└── public/               # Static assets
```

## Environment Configuration

### Required Environment Variables (Secrets)
All sensitive credentials are stored as Replit secrets:

- `JWT_SECRET` - Secret key for JWT token signing
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_USERNAME` - Administrator username
- `ADMIN_PASSWORD` - Administrator password
- `ADMIN_EMAIL` - Administrator email (optional)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image uploads
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Auto-configured Variables
- `REPLIT_DEV_DOMAIN` - Auto-populated by Replit
- `REPL_ID` - Auto-populated by Replit

## Development

### Running the Application
The application runs automatically via the configured workflow:
- **Workflow**: Next.js Development Server
- **Command**: `npm run dev`
- **Port**: 5000
- **Host**: 0.0.0.0 (configured for Replit proxy)

### Key Features
1. **Student Management**: Add, edit, and track student records
2. **Teacher Management**: Manage teacher profiles and assignments
3. **Exam Results System**: Create exams, enter student results, view grades and statistics
4. **Library System**: Track books, loans, and returns
5. **Event Calendar**: Schedule and manage school events
6. **Authentication**: Secure admin and user authentication
7. **Image Uploads**: Profile pictures and media via Cloudinary
8. **QR Code Generation**: For student/teacher IDs
9. **PDF Report Export**: Generate reports for records

## Deployment

### Configuration
- **Target**: Autoscale (stateless web application)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 5000

### Notes
- The application is configured to work with Replit's proxy system
- Host header verification is bypassed for development (configured in next.config.mjs)
- WebSocket support for hot module reload in development

## Database

### MongoDB Collections
- `students` - Student records (indexed on email)
- `teachers` - Teacher records (indexed on email)
- `books` - Library book inventory (indexed on ISBN)
- `exams` - Exam records with subject, date, total/passing marks
- `results` - Student exam results with marks, grades, and pass/fail status
- Additional collections for events and other data

### Initialization
Database collections are automatically created on first run via `lib/init-db.ts`.

## Recent Changes
- December 1, 2025: Added Exam Results System with Enhanced Security
  - Created API routes for exams (CRUD operations) - ALL endpoints require authentication
  - Created API routes for results (CRUD with automatic grade calculation) - ALL endpoints require authentication
  - Added dashboard page for exam management with proper auth token handling
  - Added dialog components for adding exams and entering results
  - Added results view with statistics (pass rate, average, rankings)
  - Updated sidebar and bottom navigation with Exams section
  - Grading system: A+ (90+), A (80-89), B+ (70-79), B (60-69), C (50-59), D (40-49), F (<40)
  - Security: All exam/result GET endpoints require Bearer token authentication (protecting sensitive student grade data)

- December 1, 2025: Imported from GitHub and configured for Replit environment
  - Installed all dependencies
  - Configured environment variables
  - Set up Next.js development workflow on port 5000
  - Configured deployment settings for autoscale
  - Verified application is running successfully

## Notes
- The project already had proper Next.js configuration for Replit (port 5000, host 0.0.0.0)
- All environment variables were pre-configured as secrets
- The application uses MongoDB as its primary database
- Cloudinary integration is configured for image management
