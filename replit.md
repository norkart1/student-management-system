# Bright Future Academy - School Management System

## Overview
A comprehensive Next.js-based School Management System for Bright Future Academy, a private educational institution. The platform provides a unified interface for managing students, teachers, library books, and events. This is a **private staff portal** - not for public use.

**School Name**: Bright Future Academy
**Status**: Successfully imported and running on Replit
**Last Updated**: December 2, 2025

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
1. **Student Management**: Add, edit, and track student records with registration numbers
2. **Teacher Management**: Manage teacher profiles and assignments
3. **Exam Category System**: 
   - Create categories (First Sem, Second Sem) with thumbnail images
   - Add subjects with individual max scores AND pass marks per subject
   - Pass marks default to 25% of max score but can be customized
   - Admin selects which students participate in each exam (no student applications)
   - Enter per-subject scores with real-time pass/fail visual feedback
   - Results display pass/fail status with color coding (green=pass, red=fail)
   - Simplified workflow: draft → scoring → published
4. **Public Result Search**: Students can search results by registration number AND date of birth on home page (enhanced security)
5. **Announcements**: Display important announcements on home page
6. **Library System**: Track books, loans, and returns
7. **Event Calendar**: Schedule and manage school events
8. **Authentication**: Secure admin and user authentication
9. **Image Uploads**: Profile pictures and media via Cloudinary
10. **QR Code Generation**: For student/teacher IDs
11. **PDF Report Export**: Generate reports for records

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
- `students` - Student records (indexed on email, registrationNumber, dateOfBirth)
- `teachers` - Teacher records (indexed on email)
- `books` - Library book inventory (indexed on ISBN)
- `examCategories` - Exam categories with status workflow (draft/scoring/published) and selectedStudents array
- `examSubjects` - Subjects within categories with maxScore
- `examResults` - Per-subject scores for selected students
- `announcements` - Home page announcements (general/exam/event/urgent)
- Additional collections for events and other data

### Initialization
Database collections are automatically created on first run via `lib/init-db.ts`.

## Recent Changes
- December 2, 2025: Redesigned Mobile Bottom Navigation
  - **New Layout**: Simplified 3-section design (Home | Plus Menu | Profile & Settings)
  - **Center Plus Button**: Floating button that expands to show Students, Exams, Teachers, Books
  - **Quick Access**: Home on left, Profile and Settings on right for faster navigation
  - **Expandable Menu**: 2x2 grid popup with smooth animations
  - **New Profile Page**: Added dedicated profile page at /dashboard/profile

- December 2, 2025: Individual Pass Marks per Subject
  - **Subject Creation**: Each subject now has both max score and pass marks fields
  - **Smart Defaults**: Pass marks auto-calculate to 25% of max score, but can be customized
  - **Select Books Dialog**: Improved UX with expandable per-book settings and default value propagation
  - **Manual Override Tracking**: Tracks which subjects have custom settings vs defaults
  - **Real-time Pass/Fail Feedback**: Score entry shows green (pass) or red (fail) as you type
  - **Results Display**: All results views show pass/fail status with color coding
  - **Public Results**: Students see pass/fail status when searching their results

- December 2, 2025: Enhanced Student Management with Birth Date
  - **Add Student Dialog**: Added date of birth input field (required)
  - **Student List**: Now displays Registration Number, Full Name, Birth Date, and Phone
  - **Student API**: PUT route now supports updating dateOfBirth field
  - **Public Results Search**: Now requires both registration number AND date of birth for enhanced security
  - **Home Page Search**: Updated search form with two fields (Registration Number + Date of Birth)

- December 1, 2025: Comprehensive Exam Category System Redesign
  - **Exam Categories**: Create categories like "First Semester", "Second Semester" with thumbnail images (1280x720)
  - **Subject Management**: Add subjects to categories with max scores (scores only, no grades)
  - **Admin Selection**: Admin manually selects which students participate in each exam (no student applications)
  - **Status Lifecycle**: draft → scoring → published (with server-side enforcement)
  - **Score Entry**: Enter per-subject scores for selected students only
  - **Result Publishing**: Results visible only after category is published
  - **Home Page Updates**: Added announcements section and result search by registration number
  - **Security**: Status transitions validated server-side, scores require selected students
  - New APIs: /api/announcements, /api/public/results, /api/exam-results, /api/exam-results/bulk
  - New Collections: examCategories, examSubjects, examResults, announcements

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
