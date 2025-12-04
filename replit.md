# Bright Future Academy - School Management System

## Overview
This project is a comprehensive Next.js-based School Management System for Bright Future Academy, a private educational institution. It serves as a private staff portal, providing a unified interface for managing students, teachers, library books, and events. The system aims to streamline administrative tasks and enhance communication within the academy. Key capabilities include student and teacher management, an advanced exam category system with public result search, a library system, event management, and secure authentication for different user roles. The vision is to provide a robust, all-in-one solution for the academy's operational needs.

## User Preferences
I prefer simple language and clear instructions.
I like an iterative development approach, where features are built and reviewed in stages.
Please ask before making major architectural changes or significant code refactors.
I prefer detailed explanations for complex implementations.
Do not make changes to the `public/` folder unless explicitly instructed.
Do not modify the core authentication logic in `lib/auth.ts` or `lib/jwt.ts` without prior discussion.

## System Architecture

### Technology Stack
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Image Management**: Cloudinary
- **Authentication**: JWT (JSON Web Tokens)

### UI/UX Decisions
- **Dashboard Design**: Separate dashboards for Admin, Student, and Teacher roles. All dashboards use consistent emerald/slate/teal color themes.
- **Mobile Navigation**: Redesigned mobile bottom navigation with a simplified 3-section layout (Home | Plus Menu | Profile & Settings) and a center floating "Plus" button for quick access to core modules.
- **Form Workflows**: Multi-step student registration flow, streamlined exam scoring with real-time pass/fail feedback.
- **Visual Feedback**: Color-coded results (green for pass, red for fail) for immediate understanding.
- **Branding**: Customizable dashboard settings for school branding.
- **Consistent Page Design**: Classes and Exam Categories pages share consistent card-based layouts with CardHeader, search inputs, and filtered grid views.
- **Settings Checkboxes**: Use div wrappers with onClick handlers for better desktop click behavior (instead of label wrappers).

### Technical Implementations & Feature Specifications
- **User Roles**: Admin, Teacher, and Student with distinct access levels and dashboards.
- **Authentication**: Secure, role-based authentication using JWTs, supporting username-based login for teachers and email/registration number for students/admins. Passwords are hashed using bcrypt.
- **Student Management**: Comprehensive student records, including birth date and registration number. Features self-registration, admin approval, and class assignment.
- **Teacher Management**: Profiles, assignments, and credential management (username-based login). Teachers can only view/edit students from their assigned classes, ensuring proper data isolation between class teachers.
- **Exam Category System**:
    - Creation of exam categories (e.g., "First Semester") with thumbnail images.
    - Subjects within categories with configurable max scores and individual pass marks (defaulting to 25% of max score, but customizable).
    - Admin-selected student participation for each exam.
    - Workflow: `draft` → `scoring` → `published` with server-side validation.
    - Score entry with real-time pass/fail visual feedback.
    - Public result search requiring both registration number and date of birth for enhanced security.
- **Quiz System**:
    - Admin/teacher quiz creation with multiple choice and true/false questions.
    - Configurable quiz settings: duration (minutes), passing score (percentage), points per question.
    - Quiz workflow: `draft` → `active` → `closed`.
    - Student quiz-taking interface with timer, progress tracking, and question navigation.
    - Automatic grading with immediate results (score, percentage, pass/fail status).
    - One attempt per student per quiz enforcement.
    - Quiz history tracking for students.
    - API routes: `/api/quizzes` (CRUD), `/api/quiz-attempts` (student submissions).
    - MongoDB collections: `quizzes`, `quizAttempts`.
- **Classes Registration System**: Management of classes with sections and academic years, allowing assignment of multiple students and teachers.
- **Library System**: Tracking of books, loans, and returns.
- **Event Calendar**: Scheduling and management of school events.
- **Announcements**: Display of important announcements on the home page, categorized (general/exam/event/urgent).
- **Image Uploads**: Integration with Cloudinary for handling profile pictures and other media.
- **QR Code Generation**: For student/teacher IDs.
- **PDF Report Export**: Capability to generate reports for records.
- **API Structure**: Organized API routes for different modules (admin, auth, student, teacher, books, events, etc.).
- **Database Initialization**: Automatic creation of MongoDB collections on first run.

### System Design Choices
- **Next.js App Router**: Utilizes the latest Next.js features for routing and data fetching.
- **Server-side Validation**: Implemented for critical actions like exam status transitions, class assignments, and admission details to ensure data integrity and security.
- **Middleware**: API authorization middleware (`auth-middleware.ts`) for enforcing role-based access control.
- **Environment Variables**: All sensitive configurations are managed via Replit secrets, ensuring secure handling of credentials.
- **Mobile Dialog Handling**: All dialog components use `modal={false}` to prevent scroll-locking issues on mobile Android devices. This avoids the white-screen bug caused by Radix's default modal scroll-lock behavior conflicting with the `h-screen` flex layout of the ProtectedLayout component.

## External Dependencies
- **MongoDB**: Primary database for all application data.
- **Cloudinary**: Cloud-based image and video management service for handling uploads.
- **JWT (JSON Web Tokens)**: For secure authentication and authorization.
- **bcrypt**: For hashing user passwords securely.

## Recent Changes
- **December 4, 2025**: Added Public Quiz System allowing anyone to participate without login:
    - Added `isPublic` flag to quiz schema for marking quizzes as publicly accessible.
    - Created public quiz API endpoints (`/api/public/quizzes`, `/api/public/quiz-attempts`).
    - Added public quiz notification section on home page showing active public quizzes with "LIVE" badge.
    - Created public quiz participation page (`/quiz/[id]`) with registration form (image, name, phone, place).
    - Added "Public Quiz" toggle in admin quiz creation dialog.
    - Public participants tracked in `publicQuizAttempts` collection (one attempt per phone number).
    - Updated image upload to support public (unauthenticated) uploads.
- **December 4, 2025**: Implemented new Quiz System with the following features:
    - Admin quiz management page (`/dashboard/quizzes`) with create, edit, delete, and status controls.
    - Multi-step quiz creation dialog supporting multiple choice and true/false questions.
    - Student quiz listing page (`/student-dashboard/quizzes`) with quiz history.
    - Interactive quiz-taking interface with timer, question navigation, and immediate results.
    - Added "Quizzes" to sidebar navigation and bottom nav.
    - Added "Take Quizzes" quick access link on student dashboard.
- **December 4, 2025**: Fixed student dashboard bug where `setAnnouncements`/`announcements` were used instead of `setNotifications`/`notifications`, causing errors for approved students accessing their dashboard.

## Development Setup
- **Workflow**: `npm run dev` runs the Next.js development server on port 5000
- **Deployment**: Configured for autoscale deployment with `npm run build` and `npm run start`